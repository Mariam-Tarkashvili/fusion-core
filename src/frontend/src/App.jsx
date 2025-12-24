import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { observer } from "mobx-react-lite";
import {
  Paper,
  Stack,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Link,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  Select,
  MenuItem,
  Container,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Send, ChatBubbleOutline, Home, Warning, CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { medicationStore } from "./stores/MedicationStore";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6366F1",
      light: "#8B8CFF",
      dark: "#4F46E5",
    },
    success: {
      main: "#10B981",
    },
    error: {
      main: "#EF4444",
    },
    background: {
      default: "#F9FAFB",
      paper: "#ffffff",
    },
    text: {
      primary: "#1F2937",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h2: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  spacing: 8,
});

const ChatAssistant = observer(() => {
  const [chatPrompt, setChatPrompt] = React.useState("");
  const [mode, setMode] = React.useState("assistant");
  const [level, setLevel] = React.useState("Intermediate");
  const [medsList, setMedsList] = React.useState([]);
  const [medInput, setMedInput] = React.useState("");
  const chatHistory = medicationStore.chatHistory;
  const isLoading = medicationStore.isLoading;
  const endRef = React.useRef(null);

  React.useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory.length]);

  const handleModeChange = (event, value) => {
    if (value) setMode(value);
  };

  const handleLevelChange = (e) => setLevel(e.target.value);

  const handleSend = async () => {
    const prompt = chatPrompt.trim();
    if (mode !== "interactions" && !prompt) return;
    if (mode !== "interactions") setChatPrompt("");

    const userContent = mode === "interactions" && medsList.length > 0 ? medsList.join(", ") : prompt;
    medicationStore.addChatMessage({ role: "user", content: userContent, timestamp: new Date(), mode });

    medicationStore.addChatMessage({
      role: "assistant",
      content: "Thinking...",
      timestamp: new Date(),
      isPending: true,
    });

    medicationStore.setIsLoading(true);

    const clearPending = () => {
      medicationStore.removePendingMessage();
    };

    try {
      if (mode === "assistant") {
        await medicationStore.sendChatMessage(`[level:${level}] ${prompt}`);
        clearPending();
      } else if (mode === "search") {
        try {
          const data = await medicationStore.getMedicationInfo(prompt, true, true);
          clearPending();

          if (data && data.data) {
            medicationStore.addChatMessage({
              role: "assistant",
              content: `Medication information for ${data.data.generic_name || prompt}`,
              timestamp: new Date(),
              meta: { type: "medication_info", data: data.data },
            });
          }
        } catch (err) {
          clearPending();

          // Error is already added to chatHistory by the store, so we don't need to add it again
          // But we need to ensure it's visible
          if (!medicationStore.chatHistory.some((m) => m.isError && m.timestamp > new Date(Date.now() - 1000))) {
            medicationStore.addChatMessage({
              role: "assistant",
              content:
                err.message ||
                "Failed to retrieve medication information. Please check the medication name and try again.",
              timestamp: new Date(),
              isError: true,
            });
          }
        }
      } else if (mode === "interactions") {
        let meds = Array.isArray(medsList) && medsList.length > 0 ? medsList.slice() : [];
        if (meds.length === 0 && prompt) {
          meds = prompt
            .split(/[;,\n]/)
            .map((m) => m.trim())
            .filter(Boolean);
        }

        if (meds.length === 0) {
          clearPending();
          medicationStore.addChatMessage({
            role: "assistant",
            content: "Please provide one or more medication names to check for interactions.",
            timestamp: new Date(),
            isError: true,
          });
          medicationStore.setIsLoading(false);
          return;
        }

        setMedsList([]);
        setMedInput("");

        try {
          const result = await medicationStore.checkInteractions(meds);
          clearPending();

          if (result && result.data) {
            medicationStore.addChatMessage({
              role: "assistant",
              content: `Interaction check results for: ${meds.join(", ")}`,
              timestamp: new Date(),
              meta: { type: "interaction_result", data: result.data },
            });
          }
        } catch (err) {
          clearPending();
          medicationStore.addChatMessage({
            role: "assistant",
            content: err.message || "Failed to check interactions. Please try again.",
            timestamp: new Date(),
            isError: true,
          });
        }
      }
    } catch (err) {
      clearPending();

      // Generic fallback error
      if (!medicationStore.chatHistory.some((m) => m.isError && m.timestamp > new Date(Date.now() - 1000))) {
        medicationStore.addChatMessage({
          role: "assistant",
          content: "An unexpected error occurred. Please try again later.",
          timestamp: new Date(),
          isError: true,
        });
      }
    } finally {
      medicationStore.setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (mode === "interactions") {
        if (medInput.trim()) {
          const m = medInput.trim();
          if (!medsList.includes(m)) setMedsList((s) => [...s, m]);
          setMedInput("");
        }
        return;
      }

      handleSend();
    }
  };

  const addMed = () => {
    const m = medInput.trim();
    if (!m) return;
    if (!medsList.includes(m)) setMedsList((s) => [...s, m]);
    setMedInput("");
  };

  const removeMed = (m) => setMedsList((s) => s.filter((x) => x !== m));

  const renderMessage = (msg, idx) => {
    const isUser = msg.role === "user";
    const align = isUser ? "flex-end" : "flex-start";

    // Render error messages
    if (msg.isError) {
      return (
        <Box key={idx} sx={{ display: "flex", justifyContent: "flex-start", width: "100%" }}>
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{
              maxWidth: "70%",
              borderRadius: 2,
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <AlertTitle>Error</AlertTitle>
            {msg.content}
          </Alert>
        </Box>
      );
    }

    // Render pending/loading state
    if (msg.isPending) {
      return (
        <Box key={idx} sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: "white",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Thinking...
            </Typography>
          </Paper>
        </Box>
      );
    }

    // Render medication info
    if (msg.meta && msg.meta.type === "medication_info") {
      const d = msg.meta.data || {};
      const brandNames = Array.isArray(d.brand_names) ? d.brand_names : [];
      const uses = Array.isArray(d.uses) ? d.uses : [];
      const sideEffects = Array.isArray(d.side_effects) ? d.side_effects : [];
      const warnings = Array.isArray(d.warnings) ? d.warnings : [];

      return (
        <Box key={idx} sx={{ display: "flex", justifyContent: align }}>
          <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: "divider", maxWidth: "85%" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h3" fontWeight={900} sx={{ lineHeight: 1 }}>
                  {d.generic_name || "Medication"}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {d.drug_class || "Drug"}
                </Typography>
                {brandNames.length > 0 && (
                  <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {brandNames.map((b, i) => (
                      <Chip key={i} label={b} size="small" variant="outlined" />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 1 }}>
              Uses
            </Typography>
            {uses.length > 0 ? (
              uses.map((u, i) => (
                <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  • {u}
                </Typography>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                Not specified
              </Typography>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Dosage
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {d.common_dosage || "Consult a healthcare provider"}
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Side Effects
              </Typography>
              {sideEffects.length > 0 ? (
                sideEffects.map((s, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    • {s}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Not specified
                </Typography>
              )}
            </Box>

            {warnings.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  p: 1.5,
                  borderRadius: 1,
                  bgcolor: "rgba(244,67,54,0.06)",
                  border: 1,
                  borderColor: "error.light",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Warning color="error" />
                  <Typography variant="subtitle1" fontWeight={800} color="error">
                    Warnings
                  </Typography>
                </Box>
                {warnings.map((w, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    • {w}
                  </Typography>
                ))}
              </Box>
            )}

            <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                ⚕️ This information is for educational purposes only and is not medical advice. Consult your healthcare
                provider for personalized guidance.
              </Typography>
            </Box>

            {d.sources && d.sources.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  References
                </Typography>
                {d.sources.map((s, i) => {
                  if (typeof s === "string") {
                    const isUrl = /^https?:\/\//i.test(s);
                    return (
                      <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        •{" "}
                        {isUrl ? (
                          <Link href={s} target="_blank" rel="noopener noreferrer" underline="hover">
                            {new URL(s).hostname}
                          </Link>
                        ) : (
                          s
                        )}
                      </Typography>
                    );
                  }
                  return (
                    <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      •{" "}
                      {s.name ? (
                        s.url ? (
                          <Link href={s.url} target="_blank" rel="noopener noreferrer" underline="hover">
                            {s.name}
                          </Link>
                        ) : (
                          s.name
                        )
                      ) : s.url ? (
                        <Link href={s.url} target="_blank" rel="noopener noreferrer" underline="hover">
                          {new URL(s.url).hostname}
                        </Link>
                      ) : (
                        "Source"
                      )}
                    </Typography>
                  );
                })}
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    // Render interaction results
    if (msg.meta && msg.meta.type === "interaction_result") {
      const d = msg.meta.data || {};
      const interactions = Array.isArray(d.interactions) ? d.interactions : [];
      const medications = Array.isArray(d.medications) ? d.medications : [];
      const totalInteractions = d.total_interactions || 0;

      const getSeverityColor = (severity) => {
        const s = (severity || "").toLowerCase();
        if (s === "major" || s === "high") return "error";
        if (s === "moderate" || s === "medium") return "warning";
        if (s === "minor" || s === "low") return "info";
        return "default";
      };

      const getSeverityIcon = (severity) => {
        const s = (severity || "").toLowerCase();
        if (s === "major" || s === "high") return <Warning />;
        if (s === "moderate" || s === "medium") return <Warning />;
        return <CheckCircle />;
      };

      return (
        <Box key={idx} sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, border: 1, borderColor: "divider", maxWidth: "85%" }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
              Interaction Check Results
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Checked {medications.length} medication{medications.length !== 1 ? "s" : ""}: {medications.join(", ")}
            </Typography>

            {totalInteractions === 0 ? (
              <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2 }}>
                <AlertTitle>No Interactions Found</AlertTitle>
                No known drug interactions were found between these medications. However, always consult your healthcare
                provider before taking multiple medications together.
              </Alert>
            ) : (
              <>
                <Alert severity="warning" icon={<Warning />} sx={{ mb: 2, borderRadius: 2 }}>
                  <AlertTitle>
                    ⚠️ {totalInteractions} Interaction{totalInteractions !== 1 ? "s" : ""} Found
                  </AlertTitle>
                  Please review the interactions below and consult your healthcare provider.
                </Alert>

                <Stack spacing={2}>
                  {interactions.map((int, i) => (
                    <Paper
                      key={i}
                      elevation={0}
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: `${getSeverityColor(int.severity)}.main`,
                        borderRadius: 2,
                        bgcolor: `${getSeverityColor(int.severity)}.50`,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        {getSeverityIcon(int.severity)}
                        <Typography variant="subtitle1" fontWeight={700}>
                          {int.drug1 || "Drug 1"} + {int.drug2 || "Drug 2"}
                        </Typography>
                        <Chip
                          label={(int.severity || "Unknown").toUpperCase()}
                          size="small"
                          color={getSeverityColor(int.severity)}
                          sx={{ ml: "auto" }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {int.description || "No description available."}
                      </Typography>
                      <Box sx={{ p: 1, bgcolor: "background.paper", borderRadius: 1, mt: 1 }}>
                        <Typography variant="caption" fontWeight={600} color="text.primary">
                          Recommendation:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {int.recommendation || "Consult your healthcare provider."}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </>
            )}

            <Box sx={{ mt: 2, p: 1.5, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                ⚕️ This information is for educational purposes only. Always consult your healthcare provider before
                making changes to your medication regimen.
              </Typography>
            </Box>

            {d.sources && d.sources.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 1 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  Data Sources
                </Typography>
                {d.sources.map((s, i) => (
                  <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    • {s.name || "Source"}{" "}
                    {s.url && (
                      <Link href={s.url} target="_blank" rel="noopener noreferrer" underline="hover">
                        ({new URL(s.url).hostname})
                      </Link>
                    )}
                  </Typography>
                ))}
              </Box>
            )}
          </Paper>
        </Box>
      );
    }

    // Render default message (user or assistant text)
    return (
      <Box key={idx} sx={{ display: "flex", justifyContent: align }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
            color: isUser ? "white" : "text.primary",
            borderRadius: 2,
            border: !isUser ? 1 : 0,
            borderColor: "divider",
            maxWidth: "70%",
          }}
        >
          <Typography variant="caption" display="block" fontWeight="bold" sx={{ mb: 0.5, opacity: 0.8 }}>
            {isUser ? "You" : "🤖 AI Assistant"}
            {isUser && msg.mode && <Chip label={msg.mode} size="small" sx={{ ml: 1 }} variant="outlined" />}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
            {msg.content}
          </Typography>
          {msg.function && (
            <Chip label={`⚡ Tool used`} size="small" sx={{ mt: 1, fontWeight: 500 }} variant="outlined" />
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 0,
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          px: "15%",
          py: 3,
          color: "white",
        })}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <ChatBubbleOutline />
          <Typography variant="h5" fontWeight="bold">
            AI Assistant
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.95 }}>
          Ask questions about medications, interactions, or side effects
        </Typography>
      </Box>

      <Box sx={{ p: 0, flex: 1, display: "flex", flexDirection: "column", overflow: "auto" }}>
        <Paper
          variant="outlined"
          sx={{
            px: "15%",
            py: 2,
            mb: 0,
            pb: 4,
            borderRadius: 2,
            bgcolor: "grey.50",
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatHistory.length === 0 ? (
            <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box sx={{ textAlign: "center" }}>
                <ChatBubbleOutline sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                <Typography variant="body2" color="text.secondary">
                  Start a conversation by asking a question below
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              <Stack spacing={2}>{chatHistory.map((msg, idx) => renderMessage(msg, idx))}</Stack>
              <div ref={endRef} />
            </Box>
          )}
        </Paper>

        <Box sx={{ px: "15%", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} size="small" color="primary">
              <ToggleButton value="assistant">Assistant</ToggleButton>
              <ToggleButton value="search">Search</ToggleButton>
              <ToggleButton value="interactions">Interactions</ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small">
              <Select value={level} onChange={handleLevelChange} sx={{ minWidth: 140 }}>
                <MenuItem value="Basic">Basic</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Expert">Expert</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Stack direction="row" spacing={2} alignItems="flex-end">
            {mode === "interactions" ? (
              <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}>
                {medsList.length > 0 && (
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 1 }}>
                    {medsList.map((m) => (
                      <Chip key={m} label={m} onDelete={() => removeMed(m)} />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    label="Add medication"
                    placeholder="Type a medication and press Enter or Add"
                    value={medInput}
                    onChange={(e) => setMedInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    fullWidth
                    disabled={isLoading}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    size="small"
                  />
                  <Button variant="outlined" onClick={addMed} disabled={!medInput.trim() || isLoading}>
                    Add
                  </Button>
                </Box>
              </Box>
            ) : (
              <TextField
                label="Ask a question..."
                placeholder="e.g., Can I take aspirin with warfarin?"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                multiline
                maxRows={4}
                fullWidth
                disabled={isLoading}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            )}

            <Button
              variant="contained"
              onClick={handleSend}
              disabled={
                isLoading ||
                (mode === "interactions" ? medsList.length === 0 && !chatPrompt.trim() : !chatPrompt.trim())
              }
              startIcon={isLoading ? <CircularProgress size={20} /> : <Send />}
              sx={{
                minWidth: 140,
                height: 56,
                borderRadius: 2,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${isLoading ? "#ddd" : "#4facfe"} 0%, #00f2fe 100%)`,
                "&:hover": { background: "linear-gradient(135deg, #3e9bed 0%, #00e1ed 100%)" },
              }}
            >
              {isLoading ? "Sending..." : mode === "assistant" ? "Ask AI" : mode === "search" ? "Search" : "Check"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
});

const Index = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth={false} disableGutters sx={{ py: 0 }}>
        <Box sx={{ py: 2 }}>
          <ChatAssistant />
        </Box>
      </Container>
    </Box>
  );
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          gap: 3,
        }}
      >
        <Typography variant="h1" component="h1" sx={{ fontSize: "6rem", fontWeight: "bold" }}>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" size="large" startIcon={<Home />} onClick={() => navigate("/")}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
