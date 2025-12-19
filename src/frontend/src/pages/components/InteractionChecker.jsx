import React from "react";
import {
  Card,
  CardContent,
  Box,
  Stack,
  TextField,
  Button,
  Paper,
  Typography,
  Chip,
  Grow,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Add, Clear, Science, WarningAmber } from "@mui/icons-material";

const InteractionChecker = ({
  interactionInput,
  setInteractionInput,
  onAddMedication,
  onClearSelected,
  selectedMedications,
  onRemoveMedication,
  onCheckInteractions,
  interactions,
  isLoading,
}) => {
  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
      <Box
        sx={(theme) => ({
          background: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
          p: 3,
          color: "white",
        })}
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
            onKeyPress={(e) => e.key === "Enter" && onAddMedication()}
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
            onClick={onAddMedication}
            disabled={!interactionInput.trim()}
            startIcon={<Add />}
            sx={{ minWidth: 140, borderRadius: 2 }}
          >
            Add Medication
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={onClearSelected}
            disabled={selectedMedications.length === 0}
            startIcon={<Clear />}
            sx={{ minWidth: 140, borderRadius: 2 }}
          >
            Clear List
          </Button>
        </Stack>

        {selectedMedications.length > 0 && (
          <Grow in>
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600} color="primary">
                Selected Medications ({selectedMedications.length}):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {selectedMedications.map((med) => (
                  <Chip
                    key={med}
                    label={med}
                    onDelete={() => onRemoveMedication(med)}
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
          disabled={selectedMedications.length < 2 || isLoading}
          onClick={onCheckInteractions}
          startIcon={isLoading ? <CircularProgress size={20} /> : <Science />}
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
          {isLoading ? "Checking..." : "Check Interactions"}
        </Button>

        {interactions && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600} color="primary">
              Results
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {interactions.message}
            </Typography>

            {interactions.total_interactions === 0 ? (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" fontWeight={600}>
                  ✓ No interactions found between these medications
                </Typography>
              </Alert>
            ) : (
              <Stack spacing={2}>
                {interactions.interactions.map((interaction, idx) => (
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
        )}
      </CardContent>
    </Card>
  );
};

export default InteractionChecker;
