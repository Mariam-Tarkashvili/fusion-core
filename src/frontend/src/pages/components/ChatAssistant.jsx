import React from "react";
import { Paper, Stack, Typography, Box, TextField, Button, CircularProgress, Chip } from "@mui/material";
import { Send, ChatBubbleOutline } from "@mui/icons-material";

const ChatAssistant = ({ chatPrompt, setChatPrompt, handleSendChat, handleKeyPress, chatHistory = [], isLoading }) => {
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
              {chatHistory.map((msg, idx) => (
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
                  <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.6 }}>
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
              ))}
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
