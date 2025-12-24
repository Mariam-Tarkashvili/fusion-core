import { runInAction } from "mobx";
import MedicationStore from "../stores/MedicationStore";

describe("MedicationStore", () => {
  let store;

  beforeEach(() => {
    store = new MedicationStore();
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Initial State", () => {
    test("should initialize with default values", () => {
      expect(store.showQuery).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.explanation).toBeNull();
      expect(store.error).toBeNull();
      expect(store.selectedMedications).toEqual([]);
      expect(store.interactions).toBeNull();
      expect(store.chatHistory).toEqual([]);
    });

    test("should have correct baseURL", () => {
      expect(store.baseURL).toBe("http://localhost:5000/api");
    });
  });

  describe("Actions - Basic Setters", () => {
    test("setShowQuery should update showQuery", () => {
      store.setShowQuery(true);
      expect(store.showQuery).toBe(true);

      store.setShowQuery(false);
      expect(store.showQuery).toBe(false);
    });

    test("setIsLoading should update isLoading", () => {
      store.setIsLoading(true);
      expect(store.isLoading).toBe(true);

      store.setIsLoading(false);
      expect(store.isLoading).toBe(false);
    });

    test("setError should update error", () => {
      const errorMsg = "Test error";
      store.setError(errorMsg);
      expect(store.error).toBe(errorMsg);
    });

    test("clearError should reset error to null", () => {
      store.setError("Test error");
      store.clearError();
      expect(store.error).toBeNull();
    });
  });

  describe("Medication Selection", () => {
    test("addSelectedMedication should add unique medication", () => {
      store.addSelectedMedication("aspirin");
      expect(store.selectedMedications).toContain("aspirin");
      expect(store.selectedMedications.length).toBe(1);
    });

    test("addSelectedMedication should not add duplicate medication", () => {
      store.addSelectedMedication("aspirin");
      store.addSelectedMedication("aspirin");
      expect(store.selectedMedications.length).toBe(1);
    });

    test("removeSelectedMedication should remove medication", () => {
      store.addSelectedMedication("aspirin");
      store.addSelectedMedication("ibuprofen");

      store.removeSelectedMedication("aspirin");

      expect(store.selectedMedications).not.toContain("aspirin");
      expect(store.selectedMedications).toContain("ibuprofen");
      expect(store.selectedMedications.length).toBe(1);
    });

    test("clearSelectedMedications should remove all medications", () => {
      store.addSelectedMedication("aspirin");
      store.addSelectedMedication("ibuprofen");

      store.clearSelectedMedications();

      expect(store.selectedMedications).toEqual([]);
    });
  });

  describe("getMedicationInfo", () => {
    const mockMedicationData = {
      data: {
        generic_name: "Ibuprofen",
        brand_names: ["Advil", "Motrin"],
        drug_class: "NSAID",
        uses: ["Pain relief", "Fever reduction"],
        common_dosage: "200-400mg every 4-6 hours",
        warnings: ["Do not exceed 1200mg per day"],
        interactions: [{ with: "Aspirin", severity: "moderate", note: "May increase bleeding risk" }],
        side_effects: ["Nausea", "Headache"],
      },
    };

    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockMedicationData,
      });
    });

    test("should fetch medication info successfully", async () => {
      await store.getMedicationInfo("ibuprofen");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/medication-info",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medication_name: "ibuprofen",
            include_interactions: true,
            include_side_effects: true,
          }),
        })
      );
    });

    test("should transform API response to expected format", async () => {
      await store.getMedicationInfo("ibuprofen");

      expect(store.explanation).toMatchObject({
        medicationName: "Ibuprofen",
        brandNames: ["Advil", "Motrin"],
        drugClass: "NSAID",
      });

      expect(store.explanation.keyPoints).toContain("Drug Class: NSAID");
      expect(store.explanation.sideEffects).toEqual(["Nausea", "Headache"]);
      expect(store.explanation.warnings).toEqual(["Do not exceed 1200mg per day"]);
    });

    test("should set isLoading correctly during fetch", async () => {
      const fetchPromise = store.getMedicationInfo("ibuprofen");

      // Should be loading
      expect(store.isLoading).toBe(true);

      await fetchPromise;

      // Should finish loading
      expect(store.isLoading).toBe(false);
    });

    test("should handle fetch errors", async () => {
      const errorMessage = "Network error";
      global.fetch.mockRejectedValue(new Error(errorMessage));

      await expect(store.getMedicationInfo("ibuprofen")).rejects.toThrow();

      expect(store.error).toBe(errorMessage);
      expect(store.isLoading).toBe(false);
    });

    test("should handle API error responses", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Medication not found" }),
      });

      await expect(store.getMedicationInfo("unknown")).rejects.toThrow("Medication not found");

      expect(store.error).toBe("Medication not found");
      expect(store.isLoading).toBe(false);
    });

    test("should handle missing data gracefully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          data: {
            generic_name: "Test Drug",
          },
        }),
      });

      await store.getMedicationInfo("test");

      expect(store.explanation.brandNames).toEqual([]);
      expect(store.explanation.sideEffects).toEqual([]);
      expect(store.explanation.warnings).toEqual([]);
    });
  });

  describe("checkInteractions", () => {
    const mockInteractionData = {
      data: {
        medications: ["aspirin", "warfarin"],
        pairs_evaluated: 1,
        total_interactions: 1,
        interactions: [
          {
            drug1: "aspirin",
            drug2: "warfarin",
            severity: "major",
            description: "Increased bleeding risk",
            recommendation: "Consult healthcare provider",
          },
        ],
      },
    };

    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockInteractionData,
      });
    });

    test("should check interactions successfully", async () => {
      const medications = ["aspirin", "warfarin"];
      const result = await store.checkInteractions(medications);

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/check-interactions",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ medications }),
        })
      );

      expect(store.interactions).toEqual(mockInteractionData.data);
      expect(result).toEqual(mockInteractionData);
    });

    test("should set isLoading during check", async () => {
      const checkPromise = store.checkInteractions(["aspirin", "warfarin"]);

      expect(store.isLoading).toBe(true);

      await checkPromise;

      expect(store.isLoading).toBe(false);
    });

    test("should handle interaction check errors", async () => {
      global.fetch.mockRejectedValue(new Error("API error"));

      await expect(store.checkInteractions(["aspirin"])).rejects.toThrow();

      expect(store.error).toBe("API error");
      expect(store.isLoading).toBe(false);
    });
  });

  describe("sendChatMessage", () => {
    const mockTextResponse = {
      text: "This is a response",
      via: "gemini",
    };

    const mockFunctionCallResponse = {
      via: "gemini:function_call",
      function: "check_interactions",
      result: {
        data: {
          interactions: [
            {
              drug1: "aspirin",
              drug2: "warfarin",
              severity: "major",
              description: "Test interaction",
              recommendation: "Test recommendation",
            },
          ],
          total_interactions: 1,
          medications: ["aspirin", "warfarin"],
        },
      },
    };

    test("should send chat message and add to history", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockTextResponse,
      });

      await store.sendChatMessage("What is aspirin?");

      // The store now only appends assistant responses; the UI is responsible for adding user messages.
      expect(store.chatHistory.length).toBe(1);
      expect(store.chatHistory[0]).toMatchObject({
        role: "assistant",
        content: "This is a response",
        via: "gemini",
      });
    });

    test("should handle function call responses", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockFunctionCallResponse,
      });

      await store.sendChatMessage("Check aspirin and warfarin");

      // The store will append the structured function result (interaction_result) as an assistant message.
      expect(store.chatHistory.length).toBeGreaterThanOrEqual(1);
      const assistantMsg = store.chatHistory[store.chatHistory.length - 1];
      expect(assistantMsg.role).toBe("assistant");
      expect(assistantMsg.meta).toBeDefined();
      expect(assistantMsg.meta.type).toBe("interaction_result");
      expect(assistantMsg.meta.data.medications).toContain("aspirin");
      expect(assistantMsg.meta.data.medications).toContain("warfarin");
    });

    test("should handle chat errors and add error message", async () => {
      global.fetch.mockRejectedValue(new Error("Chat error"));

      await expect(store.sendChatMessage("test")).rejects.toThrow();

      const lastMessage = store.chatHistory[store.chatHistory.length - 1];
      expect(lastMessage.isError).toBe(true);
      expect(lastMessage.content).toMatch(/unexpected error|There was an unexpected error/i);
    });
  });

  describe("logQuery", () => {
    test("should log query successfully", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await store.logQuery("user123", ["aspirin"], 1, "major");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/log-query",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            user_id: "user123",
            medications: ["aspirin"],
            interactions_found: 1,
            severity_level: "major",
          }),
        })
      );

      expect(result).toEqual({ success: true });
    });

    test("should handle logging errors gracefully", async () => {
      global.fetch.mockRejectedValue(new Error("Log error"));

      const result = await store.logQuery("user123", ["aspirin"], 0, "none");

      expect(result).toBeNull(); // Should not throw
    });

    test("should handle non-ok responses", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
      });

      const result = await store.logQuery("user123", ["aspirin"], 0, "none");

      expect(result).toBeNull();
    });
  });

  describe("reset", () => {
    test("should reset all state to initial values", () => {
      // Modify state
      runInAction(() => {
        store.showQuery = true;
        store.isLoading = true;
        store.explanation = { medicationName: "Test" };
        store.error = "Test error";
        store.selectedMedications = ["aspirin"];
        store.interactions = { data: "test" };
        store.chatHistory = [{ role: "user", content: "test" }];
      });

      store.reset();

      expect(store.showQuery).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.explanation).toBeNull();
      expect(store.error).toBeNull();
      expect(store.selectedMedications).toEqual([]);
      expect(store.interactions).toBeNull();
      expect(store.chatHistory).toEqual([]);
    });
  });
});
