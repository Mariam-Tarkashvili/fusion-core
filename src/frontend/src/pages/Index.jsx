import { observer } from "mobx-react";
import { useState } from "react";
import { Container, Box, Typography, Divider } from "@mui/material";
import { useSnackbar } from "notistack";
import { medicationStore } from "../stores/MedicationStore";

import Hero from "./components/Hero";
import QueryInterface from "./components/QueryInterface";
import ExplanationDisplay from "./components/ExplanationDisplay";
import InteractionChecker from "./components/InteractionChecker";
import ChatAssistant from "./components/ChatAssistant";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorBanner from "./components/ErrorBanner";

const Index = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [interactionInput, setInteractionInput] = useState("");
  const [chatPrompt, setChatPrompt] = useState("");

  // Medication info search
  const handleGetStarted = () => {
    medicationStore.setShowQuery(true);
  };

  const handleSearch = async (query) => {
    try {
      await medicationStore.getMedicationInfo(query, true, true);
      enqueueSnackbar("Medication information retrieved successfully", { variant: "success" });
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to fetch medication information", {
        variant: "error",
      });
    }
  };

  // Drug interaction check
  const handleAddMedication = () => {
    if (interactionInput.trim()) {
      medicationStore.addSelectedMedication(interactionInput.trim().toLowerCase());
      setInteractionInput("");
    }
  };

  const handleRemoveMedication = (med) => {
    medicationStore.removeSelectedMedication(med);
  };

  const handleCheckInteractions = async () => {
    try {
      const result = await medicationStore.checkInteractions(medicationStore.selectedMedications);
      enqueueSnackbar(`Checked ${result.data.pairs_evaluated} drug pairs`, { variant: "success" });

      // Log the query
      if (result.data.total_interactions > 0) {
        const maxSeverity = result.data.interactions.reduce((max, int) => {
          const severities = ["minor", "moderate", "major"];
          return severities.indexOf(int.severity) > severities.indexOf(max) ? int.severity : max;
        }, "minor");

        await medicationStore.logQuery(
          "anon_user123",
          medicationStore.selectedMedications,
          result.data.total_interactions,
          maxSeverity
        );
      }
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to check interactions", { variant: "error" });
    }
  };

  // Gemini chat
  const handleSendChat = async () => {
    if (!chatPrompt.trim()) return;
    const message = chatPrompt.trim();
    setChatPrompt("");

    try {
      await medicationStore.sendChatMessage(message);
    } catch (error) {
      enqueueSnackbar(medicationStore.error || "Failed to send message", { variant: "error" });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fa" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!medicationStore.showQuery ? (
          <Hero onGetStarted={handleGetStarted} />
        ) : (
          <>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
                Medication Search
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter a medication name to get detailed, easy-to-understand information
              </Typography>
            </Box>

            <ErrorBanner error={medicationStore.error} onAction={() => medicationStore.clearError()} />

            <QueryInterface onSearch={handleSearch} isLoading={medicationStore.isLoading} />

            {medicationStore.isLoading && !medicationStore.explanation && (
              <LoadingSpinner message="Fetching medication details..." estimate="2-5 seconds" />
            )}

            {medicationStore.explanation && !medicationStore.isLoading && (
              <ExplanationDisplay {...medicationStore.explanation} />
            )}

            <Divider sx={{ my: 6 }} />

            <InteractionChecker
              interactionInput={interactionInput}
              setInteractionInput={setInteractionInput}
              onAddMedication={handleAddMedication}
              onClearSelected={medicationStore.clearSelectedMedications}
              selectedMedications={medicationStore.selectedMedications}
              onRemoveMedication={handleRemoveMedication}
              onCheckInteractions={handleCheckInteractions}
              interactions={medicationStore.interactions}
              isLoading={medicationStore.isLoading}
              error={medicationStore.error}
            />

            <Divider sx={{ my: 6 }} />

            <ChatAssistant
              chatPrompt={chatPrompt}
              setChatPrompt={setChatPrompt}
              handleSendChat={handleSendChat}
              handleKeyPress={handleKeyPress}
              chatHistory={medicationStore.chatHistory}
              isLoading={medicationStore.isLoading}
            />
          </>
        )}
      </Container>
    </Box>
  );
};

export default observer(Index);
