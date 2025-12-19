import React from "react";
import { Fade, Card, Box, Typography, Stack, Chip, CardContent, Divider, Paper } from "@mui/material";

const ExplanationDisplay = ({
  medicationName,
  explanation,
  keyPoints = [],
  readabilityScore = { grade: "N/A", level: "" },
  sources = [],
}) => (
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
        sx={(theme) => ({
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          p: 3,
          color: "white",
        })}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {medicationName}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip
            label={`Grade: ${readabilityScore.grade}`}
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

export default ExplanationDisplay;
