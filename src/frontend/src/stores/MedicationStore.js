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
        throw new Error(errorData.message || "Failed to fetch medication information");
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
        this.error = error.message || "Failed to fetch medication information";
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
   */
  async sendChatMessage(prompt) {
    this.setIsLoading(true);
    this.clearError();

    // Add user message to history immediately
    runInAction(() => {
      this.chatHistory.push({
        role: "user",
        content: prompt,
        timestamp: new Date(),
      });
    });

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
        // Handle different response types from Gemini
        if (data.via === "gemini:function_call") {
          // Function call response - show the function result
          this.chatHistory.push({
            role: "assistant",
            content: `I checked that for you using ${data.function}:`,
            via: data.via,
            function: data.function,
            timestamp: new Date(),
          });

          // Add the function result as a separate message
          if (data.result && data.result.data) {
            const resultData = data.result.data;
            let resultText = "";

            if (resultData.interactions && Array.isArray(resultData.interactions)) {
              // Interaction check result
              resultText = `Found ${resultData.total_interactions || 0} interaction(s) among ${
                Array.isArray(resultData.medications) ? resultData.medications.join(", ") : "medications"
              }.\n\n`;
              resultData.interactions.forEach((int) => {
                resultText += `⚠️ ${int.drug1 || "Drug 1"} + ${int.drug2 || "Drug 2"} (${
                  int.severity || "unknown"
                }):\n${int.description || "No description"}\nRecommendation: ${
                  int.recommendation || "Consult healthcare provider"
                }\n\n`;
              });
            } else if (resultData.generic_name) {
              // Medication info result
              resultText = `**${resultData.generic_name}** (${resultData.drug_class || "Unknown class"})\n\n`;
              resultText += `Uses: ${Array.isArray(resultData.uses) ? resultData.uses.join(", ") : "Not specified"}\n`;
              resultText += `Dosage: ${resultData.common_dosage || "Consult healthcare provider"}\n\n`;
              resultText += `Side Effects: ${
                Array.isArray(resultData.side_effects) ? resultData.side_effects.join(", ") : "Not specified"
              }`;
            }

            this.chatHistory.push({
              role: "assistant",
              content: resultText,
              timestamp: new Date(),
            });
          }
        } else {
          // Text-only response
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
      runInAction(() => {
        this.error = error.message || "Failed to send chat message";
        this.chatHistory.push({
          role: "assistant",
          content: `Error: ${this.error}`,
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
      // Don't throw error for logging failures
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
export default medicationStore;
