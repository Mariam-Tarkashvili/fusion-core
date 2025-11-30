// src/pages/Dashboard.jsx
import { observer } from "mobx-react-lite";
import { Container, Box, Typography, Grid, Tab, Tabs, Paper, Button } from "@mui/material";
import { useState } from "react";
import { Refresh } from "@mui/icons-material";
import QueryInterface from "@/components/QueryInterface";
import ExplanationDisplay from "@/components/ExplanationDisplay";
import InteractionChecker from "@/components/InteractionChecker";
import ChatInterface from "@/components/ChatInterface";
import { medicationStore } from "@/stores/MedicationStore";
import { useSnackbar } from "notistack";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = async (query) => {
    try {
      await medicationStore.getMedicationInfo(query, true, true);
      enqueueSnackbar("Medication information retrieved successfully", {
        variant: "success",
      });
    } catch (error) {
      console.error("Error fetching medication data:", error);
      enqueueSnackbar(medicationStore.error || "Failed to fetch medication information. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleReset = () => {
    medicationStore.reset();
    enqueueSnackbar("Application reset successfully", { variant: "info" });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Medsplain Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive medication information and drug interaction checking
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleReset}>
          Reset All
        </Button>
      </Box>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab label="Medication Info" />
          <Tab label="Interaction Checker" />
          <Tab label="AI Chat" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Medication Information Lookup
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Search for detailed information about any medication
              </Typography>

              <QueryInterface onSearch={handleSearch} isLoading={medicationStore.isLoading} />
            </Paper>
          </Grid>

          {medicationStore.explanation && !medicationStore.isLoading && (
            <Grid item xs={12}>
              <ExplanationDisplay
                medicationName={medicationStore.explanation.medicationName}
                brandNames={medicationStore.explanation.brandNames}
                drugClass={medicationStore.explanation.drugClass}
                uses={medicationStore.explanation.uses}
                dosage={medicationStore.explanation.dosage}
                sideEffects={medicationStore.explanation.sideEffects}
                warnings={medicationStore.explanation.warnings}
                interactions={medicationStore.explanation.interactions}
              />
            </Grid>
          )}
        </Grid>
      )}

      {activeTab === 1 && <InteractionChecker />}

      {activeTab === 2 && <ChatInterface />}
    </Container>
  );
};

export default observer(Dashboard);
