import { useState } from "react";
import { Box, TextField, Button, Chip, Typography, InputAdornment, CircularProgress } from "@mui/material";
import { Search } from "@mui/icons-material";
import styles from "./QueryInterface.module.css";

const QueryInterface = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const examples = ["ibuprofen", "warfarin", "aspirin"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleExampleClick = (example) => {
    setQuery(example);
    onSearch(example);
  };

  return (
    <Box className={styles.container}>
      <form onSubmit={handleSubmit}>
        <Box className={styles.searchBox}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Enter medication name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "1.125rem",
                height: "56px",
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={!query.trim() || isLoading}
            sx={{ height: "56px", minWidth: "120px" }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </Button>
        </Box>
      </form>

      <Box className={styles.examplesSection}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Try these examples:
        </Typography>
        <Box className={styles.chipContainer}>
          {examples.map((example) => (
            <Chip
              key={example}
              label={example}
              onClick={() => handleExampleClick(example)}
              disabled={isLoading}
              variant="outlined"
              className={styles.exampleChip}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default QueryInterface;
