import React, { useState } from "react";
import { Card, CardContent, Box, Stack, TextField, Button, CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";

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
      sx={(theme) => ({
        mb: 4,
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light} 100%)`,
        borderRadius: 3,
      })}
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
              {isLoading ? "Searching..." : "Search Medication"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QueryInterface;
