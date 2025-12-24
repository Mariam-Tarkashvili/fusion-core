import { makeAutoObservable, runInAction } from "mobx";

class MedicationStore {
  // Observable state
  showQuery = false;
  isLoading = false;
  explanation = null;
  error = null;
  selectedMedications = [];
  interactions = null;
  chatHistory = [];

  // API base URL
  baseURL = "http://localhost:5000/api";

  constructor() {
    makeAutoObservable(this);
  }

  // Actions
  // Add a chat message (use from UI to respect MobX actions)
  addChatMessage(message) {
    this.chatHistory.push(message);
  }

  // Remove the first pending message (used to clear 'Thinking...')
  removePendingMessage() {
    const idx = this.chatHistory.findIndex((m) => m.isPending);
    if (idx !== -1) this.chatHistory.splice(idx, 1);
  }

  setShowQuery(value) {
    this.showQuery = value;
  }

  setIsLoading(value) {
    this.isLoading = value;
  }

  setError(error) {
    this.error = error;
  }

  clearError() {
    this.error = null;
  }

  addSelectedMedication(medication) {
    if (!this.selectedMedications.includes(medication)) {
      this.selectedMedications.push(medication);
    }
  }

  removeSelectedMedication(medication) {
    this.selectedMedications = this.selectedMedications.filter((med) => med !== medication);
  }

  clearSelectedMedications() {
    this.selectedMedications = [];
  }

  /**
   * Get medication information from API
   * Maps API response to component-expected format
   */
  async getMedicationInfo(medicationName, includeInteractions = true, includeSideEffects = true) {
    this.setIsLoading(true);
    this.clearError();

    try {
      const response = await fetch(`${this.baseURL}/medication-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medication_name: medicationName,
          include_interactions: includeInteractions,
          include_side_effects: includeSideEffects,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const status = response.status;
        const err = new Error(errorData.message || "Failed to fetch medication information");
        err.code = errorData.code || status;
        err.handled = true;

        runInAction(() => {
          if (status === 404 || err.code === 404) {
            this.error = {
              title: errorData.title || "Medication not found",
              message:
                errorData.message ||
                `We couldn't find information for "${medicationName}". Please check the spelling or try a different medication name.`,
              action: errorData.action || "Try a different medication name or check spelling.",
            };

            // Don't add to chat history here - let the UI component handle it
          } else {
            this.error = {
              title: errorData.title || "Medication lookup failed",
              message: errorData.message || "The medication could not be retrieved.",
              action: errorData.action || "Please check the name or try again later.",
            };
          }

          this.isLoading = false;
        });

        throw err;
      }

      const data = await response.json();
      const medData = data.data;

      runInAction(() => {
        // Safely access arrays with fallbacks
        const uses = Array.isArray(medData.uses) ? medData.uses : [];
        const warnings = Array.isArray(medData.warnings) ? medData.warnings : [];
        const interactions = Array.isArray(medData.interactions) ? medData.interactions : [];
        const sideEffects = Array.isArray(medData.side_effects) ? medData.side_effects : [];
        const brandNames = Array.isArray(medData.brand_names) ? medData.brand_names : [];

        // Transform API response to match ExplanationDisplay expectations
        this.explanation = {
          medicationName: medData.generic_name || medicationName,
          brandNames: brandNames,
          drugClass: medData.drug_class || "Unknown",
          explanation: `${medData.generic_name || medicationName} is a ${
            medData.drug_class || "medication"
          }. ${uses.join(". ")}${uses.length > 0 ? "." : ""} ${
            medData.common_dosage ? `Common dosage: ${medData.common_dosage}.` : ""
          }`,
          keyPoints: [
            `Drug Class: ${medData.drug_class || "Unknown"}`,
            uses.length > 0 ? `Common Uses: ${uses.join(", ")}` : "Uses: Not specified",
            medData.common_dosage ? `Dosage: ${medData.common_dosage}` : "Dosage: Consult healthcare provider",
            ...warnings.map((w) => `⚠️ ${w}`),
          ],
          readabilityScore: {
            grade: 6,
            level: "Elementary School",
          },
          sources: interactions.map((int) => ({
            name: `Interaction with ${int.with || "Unknown"}`,
            snippet: `${(int.severity || "unknown").toUpperCase()}: ${int.note || "No details available"}`,
          })),
          sideEffects: sideEffects,
          warnings: warnings,
          interactions: interactions,
        };
        this.isLoading = false;
      });

      return data;
    } catch (error) {
      runInAction(() => {
        if (!error.handled) {
          this.error = {
            title: "Request failed",
            message: error.message || "Failed to fetch medication information",
            action: "Please try again or check your network connection.",
          };
        }
        this.isLoading = false;
      });
      throw error;
    }
  }

  /**
   * Check drug interactions
   */
  async checkInteractions(medications) {
    this.setIsLoading(true);
    this.clearError();

    try {
      const response = await fetch(`${this.baseURL}/check-interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medications: medications,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to check interactions");
      }

      const data = await response.json();

      runInAction(() => {
        this.interactions = data.data;
        this.isLoading = false;
      });

      return data;
    } catch (error) {
      runInAction(() => {
        this.error = error.message || "Failed to check interactions";
        this.isLoading = false;
      });
      throw error;
    }
  }

  /**
   * AI Chat with Gemini - supports function calling
   * FIXED: Now properly handles both function calls AND text-only responses
   */
  async sendChatMessage(prompt) {
    this.setIsLoading(true);
    this.clearError();

    // Don't add user message here - let the UI component handle it
    // The UI already adds it before calling this function

    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send chat message");
      }

      const data = await response.json();

      runInAction(() => {
        // Handle function call responses
        if (data.via === "gemini:function_call") {
          if (data.result && data.result.data) {
            const resultData = data.result.data;
            let resultText = "";

            if (resultData.interactions && Array.isArray(resultData.interactions)) {
              // Interaction check result
              resultText = `Found ${resultData.total_interactions || 0} interaction(s) among ${
                Array.isArray(resultData.medications) ? resultData.medications.join(", ") : "medications"
              }.`;
              resultData.interactions.forEach((int) => {
                resultText += `\n\n⚠️ ${int.drug1 || "Drug 1"} + ${int.drug2 || "Drug 2"} (${
                  int.severity || "unknown"
                }):\n${int.description || "No description"}\nRecommendation: ${
                  int.recommendation || "Consult healthcare provider"
                }`;
              });

              // Push structured interaction result for richer UI rendering
              this.chatHistory.push({
                role: "assistant",
                content: resultText,
                timestamp: new Date(),
                meta: { type: "interaction_result", data: resultData },
              });
            } else if (resultData.generic_name) {
              // Medication info result
              resultText = `**${resultData.generic_name}** (${resultData.drug_class || "Unknown class"})\n\n`;
              resultText += `Uses: ${Array.isArray(resultData.uses) ? resultData.uses.join(", ") : "Not specified"}\n`;
              resultText += `Dosage: ${resultData.common_dosage || "Consult healthcare provider"}\n\n`;
              resultText += `Side Effects: ${
                Array.isArray(resultData.side_effects) ? resultData.side_effects.join(", ") : "Not specified"
              }`;

              this.chatHistory.push({
                role: "assistant",
                content: resultText,
                timestamp: new Date(),
                meta: { type: "medication_info", data: resultData },
              });
            }
          }
        }

        if (data.text) {
          this.chatHistory.push({
            role: "assistant",
            content: data.text,
            via: data.via,
            timestamp: new Date(),
          });
        }

        this.isLoading = false;
      });

      return data;
    } catch (error) {
      console.error("sendChatMessage error:", error);

      runInAction(() => {
        const generic = "There was an unexpected error. Please try again later.";
        this.error = {
          title: "Unexpected error",
          message: generic,
          action: "Please try again later.",
        };

        this.chatHistory.push({
          role: "assistant",
          content: generic,
          timestamp: new Date(),
          isError: true,
        });

        this.isLoading = false;
      });

      throw error;
    }
  }

  /**
   * Log interaction query
   */
  async logQuery(userId, medications, interactionsFound, severityLevel) {
    try {
      const response = await fetch(`${this.baseURL}/log-query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          medications: medications,
          interactions_found: interactionsFound,
          severity_level: severityLevel,
        }),
      });

      if (!response.ok) {
        console.warn("Failed to log query");
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to log query:", error);
      return null;
    }
  }

  /**
   * Clear all data
   */
  reset() {
    this.showQuery = false;
    this.isLoading = false;
    this.explanation = null;
    this.error = null;
    this.selectedMedications = [];
    this.interactions = null;
    this.chatHistory = [];
  }
}

// Create singleton instance
const medicationStore = new MedicationStore();

// Export the class as default (so tests can `new MedicationStore()`),
// and export the singleton for application runtime imports.
export default MedicationStore;
export { medicationStore };
