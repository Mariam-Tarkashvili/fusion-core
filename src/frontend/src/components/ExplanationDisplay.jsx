// ExplanationDisplay.jsx - Polished Visual Design
import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Divider,
  Fade,
} from "@mui/material";
import {
  ThumbUp,
  ThumbDown,
  CheckCircle,
  FiberManualRecord,
  WarningAmber,
  Medication,
  Info,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

const ExplanationDisplay = ({
  medicationName,
  explanation,
  keyPoints = [],
  readabilityScore = { grade: 6, level: "Elementary School" },
  sources = [],
  sideEffects = [],
  warnings = [],
}) => {
  const [feedback, setFeedback] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const safeScore =
    readabilityScore && typeof readabilityScore === "object"
      ? readabilityScore
      : { grade: 6, level: "Elementary School" };

  const handleFeedback = async (type) => {
    setFeedback(type);

    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicationName,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      const data = await response.json();
      enqueueSnackbar(data.message || "Thank you for your feedback!", { variant: "success" });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      enqueueSnackbar("Thank you for your feedback!", { variant: "success" });
    }
  };

  return (
    <Fade in timeout={600}>
      <Card
        elevation={4}
        sx={{
          mb: 4,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header Section with Gradient */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 4,
            color: "white",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Medication sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h4" component="h2" fontWeight="bold">
                {medicationName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                Medication Information
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`Reading Level: Grade ${safeScore.grade}`}
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                color: "white",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
              size="small"
            />
            <Chip
              label={safeScore.level}
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                color: "white",
                fontWeight: 600,
                backdropFilter: "blur(10px)",
              }}
              size="small"
            />
          </Stack>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Main Explanation */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Info color="primary" />
              <Typography variant="h6" fontWeight={600} color="primary">
                Overview
              </Typography>
            </Stack>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 2,
                borderLeft: 4,
                borderColor: "primary.main",
              }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                {explanation}
              </Typography>
            </Paper>
          </Box>

          {/* Key Points */}
          {keyPoints && keyPoints.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <CheckCircle color="success" />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Key Information
                </Typography>
              </Stack>
              <Paper elevation={0} sx={{ p: 3, bgcolor: "success.lighter", borderRadius: 2 }}>
                <List sx={{ py: 0 }}>
                  {keyPoints.map((point, index) => (
                    <ListItem key={index} sx={{ py: 1, px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            bgcolor: "success.main",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={point}
                        primaryTypographyProps={{
                          color: "text.secondary",
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {/* Side Effects */}
          {sideEffects && sideEffects.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <WarningAmber color="info" />
                <Typography variant="h6" fontWeight={600} color="primary">
                  Common Side Effects
                </Typography>
              </Stack>
              <Paper elevation={0} sx={{ p: 3, bgcolor: "info.lighter", borderRadius: 2 }}>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {sideEffects.map((effect, index) => (
                    <Chip
                      key={index}
                      label={effect}
                      size="medium"
                      sx={{
                        bgcolor: "white",
                        fontWeight: 500,
                        "&:hover": {
                          bgcolor: "grey.100",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Paper>
            </Box>
          )}

          {/* Warnings */}
          {warnings && warnings.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <WarningAmber sx={{ color: "warning.main" }} />
                <Typography variant="h6" fontWeight={600} color="warning.main">
                  Important Warnings
                </Typography>
              </Stack>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: "warning.lighter",
                  borderRadius: 2,
                  border: 2,
                  borderColor: "warning.main",
                }}
              >
                <List sx={{ py: 0 }}>
                  {warnings.map((warning, index) => (
                    <ListItem key={index} sx={{ py: 1, px: 0, alignItems: "flex-start" }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                        <WarningAmber sx={{ color: "warning.main", fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={warning}
                        primaryTypographyProps={{
                          color: "text.secondary",
                          variant: "body2",
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          )}

          {/* Sources/Interactions */}
          {sources && sources.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Medication color="error" />
                <Typography variant="h6" fontWeight={600} color="error.main">
                  Drug Interactions
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {sources.map((source, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      borderLeft: 4,
                      borderColor: "error.main",
                      bgcolor: "error.lighter",
                      transition: "all 0.3s",
                      "&:hover": {
                        boxShadow: 2,
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight={600} color="error.dark" gutterBottom>
                      {source.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {source.snippet}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Feedback Section */}
          <Box
            sx={{
              p: 3,
              bgcolor: "grey.50",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary" gutterBottom fontWeight={500}>
              Was this explanation helpful?
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              <Button
                variant={feedback === "helpful" ? "contained" : "outlined"}
                size="medium"
                startIcon={<ThumbUp />}
                onClick={() => handleFeedback("helpful")}
                disabled={feedback !== null}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  fontWeight: 600,
                  ...(feedback === "helpful" && {
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }),
                }}
              >
                Helpful
              </Button>
              <Button
                variant={feedback === "unclear" ? "contained" : "outlined"}
                size="medium"
                startIcon={<ThumbDown />}
                onClick={() => handleFeedback("unclear")}
                disabled={feedback !== null}
                color="inherit"
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Unclear
              </Button>
            </Stack>
            {feedback && (
              <Fade in>
                <Typography variant="caption" color="success.main" sx={{ mt: 2, display: "block", fontWeight: 600 }}>
                  ✓ Thank you for your feedback!
                </Typography>
              </Fade>
            )}
          </Box>

          {/* Medical Disclaimer */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              bgcolor: "primary.lighter",
              borderRadius: 2,
              borderLeft: 4,
              borderColor: "primary.main",
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
              <strong>⚕️ Medical Disclaimer:</strong> This information is for educational purposes only and should not
              replace professional medical advice. Always consult with a healthcare professional before starting,
              stopping, or changing any medication.
            </Typography>
          </Paper>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default ExplanationDisplay;
