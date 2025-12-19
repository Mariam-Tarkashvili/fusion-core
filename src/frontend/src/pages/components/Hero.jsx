import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Hero = ({ onGetStarted }) => (
  <Box
    sx={(theme) => ({
      textAlign: "center",
      py: 10,
      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
      borderRadius: 4,
      color: "white",
      mb: 4,
    })}
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

export default Hero;
