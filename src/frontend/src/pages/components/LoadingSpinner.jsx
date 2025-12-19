import React from "react";
import { Box, Typography, CircularProgress } from "@mui/material";

const LoadingSpinner = ({ message = "Loading...", estimate }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, py: 3 }}>
      <CircularProgress />
      <Box>
        <Typography variant="body1" fontWeight={600}>
          {message}
        </Typography>
        {estimate && (
          <Typography variant="caption" color="text.secondary">
            Typically takes {estimate}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
