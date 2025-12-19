import React, { useEffect, useRef } from "react";
import { Paper, Stack, Typography, Box, TextField, Button, CircularProgress, Chip, Link, Divider } from "@mui/material";
import { Send, ChatBubbleOutline } from "@mui/icons-material";

const ChatAssistant = ({ chatPrompt, setChatPrompt, handleSendChat, handleKeyPress, chatHistory = [], isLoading }) => {
  const endRef = useRef(null);

  useEffect(() => {
    // auto-scroll to the latest message
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory]);

  return (
    <Paper elevation={2} sx={{ borderRadius: 3 }}>
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          p: 3,
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

      <Box sx={{ p: 3 }}>
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, maxHeight: 400, overflowY: "auto", borderRadius: 2, bgcolor: "grey.50" }}
        >
          {chatHistory.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <ChatBubbleOutline sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Start a conversation by asking a question below
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {chatHistory.map((msg, idx) => {
                // Render structured medication info with improved layout
                if (msg.meta && msg.meta.type === "medication_info") {
                  const d = msg.meta.data || {};
                  const brandNames = Array.isArray(d.brand_names) ? d.brand_names : [];
                  const uses = Array.isArray(d.uses) ? d.uses : [];
                  const sideEffects = Array.isArray(d.side_effects) ? d.side_effects : [];
                  const warnings = Array.isArray(d.warnings) ? d.warnings : [];

                  return (
                    <Paper key={idx} elevation={1} sx={{ p: 2.5, borderRadius: 3, borderColor: "divider" }}>
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
                  );
                }

                // Default rendering for other messages
                return (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: msg.role === "user" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                      color: msg.role === "user" ? "white" : "text.primary",
                      borderRadius: 2,
                      border: msg.role === "assistant" ? 1 : 0,
                      borderColor: "divider",
                      ...(msg.isError && { bgcolor: "error.light", color: "error.contrastText" }),
                    }}
                  >
                    <Typography variant="caption" display="block" fontWeight="bold" sx={{ mb: 0.5, opacity: 0.8 }}>
                      {msg.role === "user" ? "You" : "🤖 AI Assistant"}
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
              })}
              <div ref={endRef} />
            </Stack>
          )}
        </Paper>

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
            disabled={isLoading}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            variant="contained"
            onClick={handleSendChat}
            disabled={isLoading || !chatPrompt.trim()}
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
            {isLoading ? "Sending..." : "Ask AI"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ChatAssistant;
