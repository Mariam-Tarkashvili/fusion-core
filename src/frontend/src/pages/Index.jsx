import React from "react";
import { observer } from "mobx-react";
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Divider,
  Paper,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  Grow,
} from "@mui/material";
import { Search, Add, Clear, Send, Science, ChatBubbleOutline, WarningAmber } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { medicationStore } from "../stores/MedicationStore";

// Enhanced Hero Component
const Hero = ({ onGetStarted }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 10,
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: 4,
      color: "white",
      mb: 4,
    }}
  >
    <Typography variant="h2" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
      Medsplain
    </Typography>
    <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
      AI-Powered Medication Intelligence
    </Typography>
    <Typography variant="body1" sx={{ mb: 4, maxWidth: 600, mx: "auto", opacity: 0.9 }}>
      Get clear, easy-to-understand medication information and check drug interactions with AI assistance
    </Typography>
    <Button
      variant="contained"
      size="large"
      onClick={onGetStarted}
      sx={{
        bgcolor: "white",
        color: "primary.main",
        px: 4,
        py: 1.5,
        fontSize: "1.1rem",
        fontWeight: 600,
        "&:hover": {
          bgcolor: "grey.100",
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
        transition: "all 0.3s",
      }}
    >
      Get Started
    </Button>
  </Box>
);

// Enhanced Query Interface
const QueryInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery("");
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 4,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              label="Enter medication name"
              placeholder="e.g., ibuprofen, aspirin, warfarin"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !query.trim()}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Search />}
              sx={{
                minWidth: 140,
                height: 56,
                borderRadius: 2,
                fontWeight: 600,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a4193 100%)",
                },
              }}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

// Enhanced Explanation Display
const ExplanationDisplay = ({ medicationName, explanation, keyPoints, readabilityScore, sources }) => (
  <Fade in timeout={600}>
    <Card
      elevation={3}
      sx={{
        mb: 4,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
          color: "white",
        }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {medicationName}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`Grade Level: ${readabilityScore.grade}`}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
            size="small"
          />
          <Chip
            label={readabilityScore.level}
            sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: 600 }}
            size="small"
          />
        </Stack>
      </Box>

      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Overview
        </Typography>
        <Typography variant="body1" paragraph sx={{ lineHeight: 1.8, color: "text.secondary" }}>
          {explanation}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
          Key Points
        </Typography>
        <Box component="ul" sx={{ pl: 2, "& li": { mb: 1 } }}>
          {keyPoints.map((point, idx) => (
            <Typography key={idx} component="li" variant="body2" color="text.secondary">
              {point}
            </Typography>
          ))}
        </Box>

        {sources && sources.length > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
              Important Interactions
            </Typography>
            <Stack spacing={2}>
              {sources.map((source, idx) => (
                <Paper
                  key={idx}
                  variant="outlined"
                  sx={{ p: 2, borderRadius: 2, borderLeft: 4, borderColor: "warning.main" }}
                >
                  <Typography variant="subtitle2" fontWeight={600}>
                    {source.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {source.snippet}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  </Fade>
);

const Index = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [interactionInput, setInteractionInput] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");

  // Medication info search
  const handleGetStarted = () => {
    medicationStore.setShowQuery(true);
  };

  const handleSearch = async (query) => {
    try {
      await medicationStore.getMedicationInfo(query, true, true);
      enqueueSnackbar("Medication information retrieved successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to fetch medication information", {
        variant: "error",
      });
    }
  };

  // Drug interaction check
  const handleAddMedication = () => {
    if (interactionInput.trim()) {
      medicationStore.addSelectedMedication(interactionInput.trim().toLowerCase());
      setInteractionInput("");
    }
  };

  const handleRemoveMedication = (med) => {
    medicationStore.removeSelectedMedication(med);
  };

  const handleCheckInteractions = async () => {
    try {
      const result = await medicationStore.checkInteractions(medicationStore.selectedMedications);
      enqueueSnackbar(`Checked ${result.data.pairs_evaluated} drug pairs`, { variant: "success" });

      // Log the query
      if (result.data.total_interactions > 0) {
        const maxSeverity = result.data.interactions.reduce((max, int) => {
          const severities = ["minor", "moderate", "major"];
          return severities.indexOf(int.severity) > severities.indexOf(max) ? int.severity : max;
        }, "minor");

        await medicationStore.logQuery(
          "anon_user123",
          medicationStore.selectedMedications,
          result.data.total_interactions,
          maxSeverity
        );
      }
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to check interactions", { variant: "error" });
    }
  };

  // Gemini chat
  const handleSendChat = async () => {
    if (!chatPrompt.trim()) return;
    const message = chatPrompt.trim();
    setChatPrompt("");

    try {
      await medicationStore.sendChatMessage(message);
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to send message", { variant: "error" });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!medicationStore.showQuery ? (
          <Hero onGetStarted={handleGetStarted} />
        ) : (
          <>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                Medication Search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter a medication name to get detailed, easy-to-understand information
              </Typography>
            </Box>

            <QueryInterface onSearch={handleSearch} isLoading={medicationStore.isLoading} />

            {medicationStore.explanation && !medicationStore.isLoading && (
              <ExplanationDisplay {...medicationStore.explanation} />
            )}

            <Divider sx={{ my: 6 }} />

            {/* Drug Interaction Checker */}
            <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                  p: 3,
                  color: "white",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Science />
                  <Typography variant="h5" fontWeight="bold">
                    Drug Interaction Checker
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.95 }}>
                  Add 2-5 medications to check for potential interactions
                </Typography>
              </Box>

              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <TextField
                    label="Medication name"
                    placeholder="e.g., aspirin"
                    value={interactionInput}
                    onChange={(e) => setInteractionInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddMedication()}
                    size="small"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddMedication}
                    disabled={!interactionInput.trim()}
                    startIcon={<Add />}
                    sx={{ minWidth: 120, borderRadius: 2 }}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={medicationStore.clearSelectedMedications}
                    disabled={medicationStore.selectedMedications.length === 0}
                    startIcon={<Clear />}
                    sx={{ minWidth: 120, borderRadius: 2 }}
                  >
                    Clear
                  </Button>
                </Stack>

                {medicationStore.selectedMedications.length > 0 && (
                  <Grow in>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "grey.50" }}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600} color="primary">
                        Selected Medications ({medicationStore.selectedMedications.length}):
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {medicationStore.selectedMedications.map((med) => (
                          <Chip
                            key={med}
                            label={med}
                            onDelete={() => handleRemoveMedication(med)}
                            color="primary"
                            sx={{ fontWeight: 500 }}
                          />
                        ))}
                      </Stack>
                    </Paper>
                  </Grow>
                )}

                <Button
                  variant="contained"
                  disabled={medicationStore.selectedMedications.length < 2 || medicationStore.isLoading}
                  onClick={handleCheckInteractions}
                  startIcon={medicationStore.isLoading ? <CircularProgress size={20} /> : <Science />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #e082ea 0%, #e4465b 100%)",
                    },
                  }}
                >
                  {medicationStore.isLoading ? "Checking..." : "Check Interactions"}
                </Button>

                {medicationStore.interactions && (
                  <Fade in timeout={600}>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
                        Results
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {medicationStore.interactions.message}
                      </Typography>

                      {medicationStore.interactions.total_interactions === 0 ? (
                        <Alert severity="success" sx={{ borderRadius: 2 }}>
                          <Typography variant="body2" fontWeight={600}>
                            ✓ No interactions found between these medications
                          </Typography>
                        </Alert>
                      ) : (
                        <Stack spacing={2}>
                          {medicationStore.interactions.interactions.map((interaction, idx) => (
                            <Alert
                              key={idx}
                              severity={
                                interaction.severity === "major"
                                  ? "error"
                                  : interaction.severity === "moderate"
                                  ? "warning"
                                  : "info"
                              }
                              icon={<WarningAmber />}
                              sx={{ borderRadius: 2 }}
                            >
                              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                {interaction.drug1} + {interaction.drug2}
                                <Chip
                                  label={interaction.severity.toUpperCase()}
                                  size="small"
                                  sx={{ ml: 1, fontWeight: 600 }}
                                  color={
                                    interaction.severity === "major"
                                      ? "error"
                                      : interaction.severity === "moderate"
                                      ? "warning"
                                      : "info"
                                  }
                                />
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {interaction.description}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 500 }}>
                                💡 Recommendation: {interaction.recommendation}
                              </Typography>
                            </Alert>
                          ))}
                        </Stack>
                      )}
                    </Box>
                  </Fade>
                )}
              </CardContent>
            </Card>

            <Divider sx={{ my: 6 }} />

            {/* Gemini AI Chat */}
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <Box
                sx={{
                  background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                  p: 3,
                  color: "white",
                }}
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

              <CardContent sx={{ p: 3 }}>
                {/* Chat History */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    maxHeight: 400,
                    overflowY: "auto",
                    borderRadius: 2,
                    bgcolor: "grey.50",
                  }}
                >
                  {medicationStore.chatHistory.length === 0 ? (
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <ChatBubbleOutline sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Start a conversation by asking a question below
                      </Typography>
                    </Box>
                  ) : (
                    <Stack spacing={2}>
                      {medicationStore.chatHistory.map((msg, idx) => (
                        <Fade in key={idx} timeout={300}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              bgcolor:
                                msg.role === "user" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                              color: msg.role === "user" ? "white" : "text.primary",
                              borderRadius: 2,
                              border: msg.role === "assistant" ? 1 : 0,
                              borderColor: "divider",
                              ...(msg.isError && { bgcolor: "error.light", color: "error.contrastText" }),
                            }}
                          >
                            <Typography
                              variant="caption"
                              display="block"
                              fontWeight="bold"
                              sx={{ mb: 0.5, opacity: 0.8 }}
                            >
                              {msg.role === "user" ? "You" : "🤖 AI Assistant"}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}
                            >
                              {msg.content}
                            </Typography>
                            {msg.function && (
                              <Chip
                                label={`⚡ ${msg.function}`}
                                size="small"
                                sx={{ mt: 1, fontWeight: 500 }}
                                variant="outlined"
                              />
                            )}
                          </Paper>
                        </Fade>
                      ))}
                    </Stack>
                  )}
                </Paper>

                {/* Chat Input */}
                <Stack direction="row" spacing={2} alignItems="flex-end">
                  <TextField
                    label="Ask a question..."
                    placeholder="e.g., Can I take aspirin with warfarin?"
                    value={chatPrompt}
                    onChange={(e) => setChatPrompt(e.target.value)}
                    onKeyPress={handleKeyPress}
                    multiline
                    maxRows={4}
                    fullWidth
                    disabled={medicationStore.isLoading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendChat}
                    disabled={medicationStore.isLoading || !chatPrompt.trim()}
                    startIcon={medicationStore.isLoading ? <CircularProgress size={20} /> : <Send />}
                    sx={{
                      minWidth: 120,
                      height: 56,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #3e9bed 0%, #00e1ed 100%)",
                      },
                    }}
                  >
                    {medicationStore.isLoading ? "Sending..." : "Send"}
                  </Button>
                </Stack>

                {/* Example queries */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                    💡 Try asking:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {[
                      "Can I take aspirin with warfarin?",
                      "What is ibuprofen used for?",
                      "Tell me about warfarin side effects",
                    ].map((example, idx) => (
                      <Chip
                        key={idx}
                        label={example}
                        size="small"
                        onClick={() => setChatPrompt(example)}
                        sx={{
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "primary.light",
                            color: "white",
                          },
                          transition: "all 0.2s",
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Container>
    </Box>
  );
};

export default observer(Index);
