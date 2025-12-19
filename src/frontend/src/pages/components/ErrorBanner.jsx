import React from "react";
import { Alert, AlertTitle, Box, Button } from "@mui/material";

const ErrorBanner = ({ error, onAction }) => {
  if (!error) return null;

  // Accept either string or structured error
  const title = error.title || (typeof error === "string" ? "Error" : "Something went wrong");
  const message = error.message || (typeof error === "string" ? error : null);
  const action = error.action || null;

  return (
    <Box sx={{ mb: 2 }}>
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
        {action && (
          <Box sx={{ mt: 1 }}>
            <div>{action}</div>
          </Box>
        )}
        {onAction && (
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={onAction} color="inherit">
              Try again
            </Button>
          </Box>
        )}
      </Alert>
    </Box>
  );
};

export default ErrorBanner;
