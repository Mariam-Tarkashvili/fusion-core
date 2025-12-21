import React, { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import { Send, ChatBubbleOutline } from "@mui/icons-material";
import { medicationStore } from "../../stores/MedicationStore";

const ChatAssistant = () => {
  const [chatPrompt, setChatPrompt] = useState("");
  const [mode, setMode] = useState("assistant"); // assistant | search | interactions
  const [level, setLevel] = useState("Intermediate");
  const [medsList, setMedsList] = useState([]);
  const [medInput, setMedInput] = useState("");
  const chatHistory = medicationStore.chatHistory;
  const isLoading = medicationStore.isLoading;
  const endRef = useRef(null);

  useEffect(() => {
    // auto-scroll to the latest message when the number of messages changes
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory.length]);

  // Prevent the page itself from scrolling while the chat is open;
  // keep scrolling confined to the internal messages panel.
  // useEffect(() => {
  //   const prev = document.body.style.overflow;
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = prev || "";
  //   };
  // }, []);

  const handleModeChange = (event, value) => {
    if (value) setMode(value);
  };

  const handleLevelChange = (e) => setLevel(e.target.value);

  const handleSend = async () => {
    const prompt = chatPrompt.trim();
    // For interactions mode, we may send an empty chatPrompt if medsList is used
    if (mode !== "interactions" && !prompt) return;
    // Clear chat prompt for non-interactions flows
    if (mode !== "interactions") setChatPrompt("");

    // Prepare a user-visible content string (use medsList for interactions when present)
    const userContent = mode === "interactions" && medsList.length > 0 ? medsList.join(", ") : prompt;
    // Add the user's message to the unified chat history (tag with mode)
    medicationStore.chatHistory.push({ role: "user", content: userContent, timestamp: new Date(), mode });

    // Add a temporary assistant message to indicate waiting state
    const pending = { role: "assistant", content: "Thinking...", timestamp: new Date(), isPending: true };
    medicationStore.chatHistory.push(pending);

    const clearPending = () => {
      const idx = medicationStore.chatHistory.findIndex((m) => m.isPending);
      if (idx !== -1) medicationStore.chatHistory.splice(idx, 1);
    };

    try {
      if (mode === "assistant") {
        // include comprehension level as a short hint for the assistant
        await medicationStore.sendChatMessage(`[level:${level}] ${prompt}`);
        // store may have already replaced/added assistant content; ensure pending removed
        clearPending();
      } else if (mode === "search") {
        const data = await medicationStore.getMedicationInfo(prompt, true, true);
        clearPending();
        if (data && data.data) {
          medicationStore.chatHistory.push({
            role: "assistant",
            content: `Medication information for ${data.data.generic_name || prompt}`,
            timestamp: new Date(),
            meta: { type: "medication_info", data: data.data },
          });
        }
      } else if (mode === "interactions") {
        // Prefer using the structured medsList when available (added via chips input)
        let meds = Array.isArray(medsList) && medsList.length > 0 ? medsList.slice() : [];
        if (meds.length === 0 && prompt) {
          meds = prompt
            .split(/[;,\n]/)
            .map((m) => m.trim())
            .filter(Boolean);
        }

        if (meds.length === 0) {
          clearPending();
          medicationStore.chatHistory.push({
            role: "assistant",
            content: "Please provide one or more medication names.",
            timestamp: new Date(),
            isError: true,
          });
          return;
        }

        // clear local meds UI after sending
        setMedsList([]);
        setMedInput("");

        const result = await medicationStore.checkInteractions(meds);
        clearPending();
        if (result && result.data) {
          medicationStore.chatHistory.push({
            role: "assistant",
            content: `Interaction check results`,
            timestamp: new Date(),
            meta: { type: "interaction_result", data: result.data },
          });
        }
      }
    } catch (err) {
      clearPending();
      // error messages are handled by store; ensure a generic user-visible message if needed
      medicationStore.chatHistory.push({
        role: "assistant",
        content: medicationStore.error?.message || "There was an unexpected error. Please try again later.",
        timestamp: new Date(),
        isError: true,
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (mode === "interactions") {
        // In interactions mode, Enter adds the current med input instead of sending
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

  const removeMed = (m) => {
    setMedsList((s) => s.filter((x) => x !== m));
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
              <Stack spacing={2}>
                {chatHistory.map((msg, idx) => {
                  const isUser = msg.role === "user";
                  const align = isUser ? "flex-end" : "flex-start";

                  // helper to render default message bubble
                  const renderDefault = () => (
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
                        ...(msg.isError && { bgcolor: "error.light", color: "error.contrastText" }),
                      }}
                    >
                      <Typography variant="caption" display="block" fontWeight="bold" sx={{ mb: 0.5, opacity: 0.8 }}>
                        {isUser ? "You" : "🤖 AI Assistant"}
                        {isUser && msg.mode && <Chip label={msg.mode} size="small" sx={{ ml: 1 }} variant="outlined" />}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}
                      >
                        {msg.content}
                      </Typography>
                      {msg.function && (
                        <Chip label={`⚡ Tool used`} size="small" sx={{ mt: 1, fontWeight: 500 }} variant="outlined" />
                      )}
                    </Paper>
                  );

                  // Render structured medication info with improved layout
                  if (msg.meta && msg.meta.type === "medication_info") {
                    const d = msg.meta.data || {};
                    const brandNames = Array.isArray(d.brand_names) ? d.brand_names : [];
                    const uses = Array.isArray(d.uses) ? d.uses : [];
                    const sideEffects = Array.isArray(d.side_effects) ? d.side_effects : [];
                    const warnings = Array.isArray(d.warnings) ? d.warnings : [];

                    return (
                      <Box key={idx} sx={{ display: "flex", justifyContent: align }}>
                        <Paper elevation={1} sx={{ p: 2.5, borderRadius: 3, borderColor: "divider", maxWidth: "70%" }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                            <Box>
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
                            {d.recommendation && (
                              <Box sx={{ textAlign: "right" }}>
                                <Typography variant="subtitle2" color="primary" fontWeight={700}>
                                  Recommendation
                                </Typography>
                                <Typography variant="body2" color="text.primary" sx={{ maxWidth: 320 }}>
                                  {d.recommendation}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box sx={{ my: 1 }}>
                            <Divider />
                          </Box>

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
                              Side effects
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
                            <Box sx={{ mt: 2, p: 1, borderRadius: 1, bgcolor: "rgba(244,67,54,0.06)" }}>
                              <Typography variant="subtitle1" fontWeight={800} color="error">
                                Warnings
                              </Typography>
                              {warnings.map((w, i) => (
                                <Typography key={i} variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  • {w}
                                </Typography>
                              ))}
                            </Box>
                          )}

                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>
                              This information is for educational purposes only and is not medical advice. Consult your
                              healthcare provider for personalized guidance.
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

                  // Default rendering for other messages
                  return (
                    <Box key={idx} sx={{ display: "flex", justifyContent: align }}>
                      {renderDefault()}
                    </Box>
                  );
                })}
              </Stack>
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
                  <Button variant="outlined" onClick={addMed} disabled={!medInput.trim()}>
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
};

export default observer(ChatAssistant);
