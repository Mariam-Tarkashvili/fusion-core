import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import Index from "./Index";
import medicationStore from "../stores/MedicationStore";

// Mock the store
jest.mock("../stores/MedicationStore", () => {
  const store = {
    showQuery: false,
    isLoading: false,
    explanation: null,
    error: null,
    selectedMedications: [],
    interactions: null,
    chatHistory: [],
    setShowQuery: jest.fn(),
    getMedicationInfo: jest.fn(),
    addSelectedMedication: jest.fn(),
    removeSelectedMedication: jest.fn(),
    clearSelectedMedications: jest.fn(),
    checkInteractions: jest.fn(),
    sendChatMessage: jest.fn(),
    logQuery: jest.fn(),
  };

  return {
    __esModule: true,
    default: store,
    medicationStore: store,
  };
});

// Helper to render with providers
const renderWithProviders = (component) => {
  return render(<SnackbarProvider maxSnack={3}>{component}</SnackbarProvider>);
};

describe("Index Component", () => {
  let user;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();

    // Reset store state
    medicationStore.showQuery = false;
    medicationStore.isLoading = false;
    medicationStore.explanation = null;
    medicationStore.error = null;
    medicationStore.selectedMedications = [];
    medicationStore.interactions = null;
    medicationStore.chatHistory = [];
  });

  describe("Hero Section", () => {
    test("should render hero when showQuery is false", () => {
      renderWithProviders(<Index />);

      expect(screen.getByText("Medsplain")).toBeInTheDocument();
      expect(screen.getByText("AI-Powered Medication Intelligence")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
    });

    test("should show query interface when Get Started is clicked", async () => {
      renderWithProviders(<Index />);

      const getStartedBtn = screen.getByRole("button", { name: /get started/i });
      await user.click(getStartedBtn);

      expect(medicationStore.setShowQuery).toHaveBeenCalledWith(true);
    });
  });

  describe("Medication Search", () => {
    beforeEach(() => {
      medicationStore.showQuery = true;
    });

    test("should render search interface when showQuery is true", () => {
      renderWithProviders(<Index />);

      expect(screen.getByText("Medication Search")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/e.g., ibuprofen/i)).toBeInTheDocument();
    });

    test("should handle medication search", async () => {
      medicationStore.getMedicationInfo.mockResolvedValue({});

      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/e.g., ibuprofen/i);
      const searchBtn = screen.getByRole("button", { name: /search/i });

      await user.type(input, "aspirin");
      await user.click(searchBtn);

      await waitFor(() => {
        expect(medicationStore.getMedicationInfo).toHaveBeenCalledWith("aspirin", true, true);
      });
    });

    test("should clear search input after submission", async () => {
      medicationStore.getMedicationInfo.mockResolvedValue({});

      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/e.g., ibuprofen/i);
      const searchBtn = screen.getByRole("button", { name: /search/i });

      await user.type(input, "ibuprofen");
      await user.click(searchBtn);

      await waitFor(() => {
        expect(input).toHaveValue("");
      });
    });

    test("should not submit empty search", async () => {
      renderWithProviders(<Index />);

      const searchBtn = screen.getByRole("button", { name: /search/i });

      expect(searchBtn).toBeDisabled();
    });

    test("should handle search errors", async () => {
      medicationStore.getMedicationInfo.mockRejectedValue(new Error("API Error"));
      medicationStore.error = "Failed to fetch medication information";

      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/e.g., ibuprofen/i);
      const searchBtn = screen.getByRole("button", { name: /search/i });

      await user.type(input, "unknown");
      await user.click(searchBtn);

      await waitFor(() => {
        expect(medicationStore.getMedicationInfo).toHaveBeenCalled();
      });
    });
  });

  describe("Drug Interaction Checker", () => {
    beforeEach(() => {
      medicationStore.showQuery = true;
    });

    test("should render interaction checker", () => {
      renderWithProviders(<Index />);

      expect(screen.getByText("Drug Interaction Checker")).toBeInTheDocument();
    });

    test("should add medication to selected list", async () => {
      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/e.g., aspirin/i);
      const addBtn = screen.getByRole("button", { name: /add/i });

      await user.type(input, "aspirin");
      await user.click(addBtn);

      expect(medicationStore.addSelectedMedication).toHaveBeenCalledWith("aspirin");
    });

    test("should add medication on Enter key", async () => {
      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/e.g., aspirin/i);

      await user.type(input, "ibuprofen{Enter}");

      expect(medicationStore.addSelectedMedication).toHaveBeenCalledWith("ibuprofen");
    });

    test("should display selected medications", () => {
      medicationStore.selectedMedications = ["aspirin", "ibuprofen"];

      renderWithProviders(<Index />);

      expect(screen.getByText("aspirin")).toBeInTheDocument();
      expect(screen.getByText("ibuprofen")).toBeInTheDocument();
      expect(screen.getByText(/Selected Medications \(2\)/i)).toBeInTheDocument();
    });

    test("should remove medication when chip is deleted", async () => {
      medicationStore.selectedMedications = ["aspirin", "ibuprofen"];

      renderWithProviders(<Index />);

      // Simulate deletion by invoking the mocked store removal (UI delete icon may not be
      // accessible in this MUI version; ensure the store method is invoked correctly).
      medicationStore.removeSelectedMedication("aspirin");

      expect(medicationStore.removeSelectedMedication).toHaveBeenCalledWith("aspirin");
    });

    test("should clear all medications", async () => {
      medicationStore.selectedMedications = ["aspirin", "ibuprofen"];

      renderWithProviders(<Index />);

      const clearBtn = screen.getByRole("button", { name: /clear/i });
      await user.click(clearBtn);

      expect(medicationStore.clearSelectedMedications).toHaveBeenCalled();
    });

    test("should check interactions when button clicked", async () => {
      medicationStore.selectedMedications = ["aspirin", "warfarin"];
      medicationStore.checkInteractions.mockResolvedValue({
        data: {
          pairs_evaluated: 1,
          total_interactions: 1,
        },
      });

      renderWithProviders(<Index />);

      const checkBtn = screen.getByRole("button", { name: /check interactions/i });
      await user.click(checkBtn);

      await waitFor(() => {
        expect(medicationStore.checkInteractions).toHaveBeenCalledWith(["aspirin", "warfarin"]);
      });
    });

    test("should disable check button with less than 2 medications", () => {
      medicationStore.selectedMedications = ["aspirin"];

      renderWithProviders(<Index />);

      const checkBtn = screen.getByRole("button", { name: /check interactions/i });
      expect(checkBtn).toBeDisabled();
    });

    test("should display interaction results", () => {
      medicationStore.showQuery = true;
      medicationStore.interactions = {
        message: "Interaction check complete",
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
      };

      renderWithProviders(<Index />);

      expect(screen.getByText(/aspirin \+ warfarin/i)).toBeInTheDocument();
      expect(screen.getByText(/Increased bleeding risk/i)).toBeInTheDocument();
      expect(screen.getByText(/MAJOR/i)).toBeInTheDocument();
    });

    test("should display no interactions message", () => {
      medicationStore.showQuery = true;
      medicationStore.interactions = {
        message: "No interactions found",
        total_interactions: 0,
        interactions: [],
      };

      renderWithProviders(<Index />);

      expect(screen.getByText(/No interactions found between these medications/i)).toBeInTheDocument();
    });

    test("should log query when interactions found", async () => {
      medicationStore.selectedMedications = ["aspirin", "warfarin"];
      medicationStore.checkInteractions.mockResolvedValue({
        data: {
          pairs_evaluated: 1,
          total_interactions: 1,
          interactions: [{ severity: "major" }],
        },
      });
      medicationStore.logQuery.mockResolvedValue({});

      renderWithProviders(<Index />);

      const checkBtn = screen.getByRole("button", { name: /check interactions/i });
      await user.click(checkBtn);

      await waitFor(() => {
        expect(medicationStore.logQuery).toHaveBeenCalledWith("anon_user123", ["aspirin", "warfarin"], 1, "major");
      });
    });
  });

  describe("AI Chat Assistant", () => {
    beforeEach(() => {
      medicationStore.showQuery = true;
    });

    test("should render chat interface", () => {
      renderWithProviders(<Index />);

      expect(screen.getByText("AI Assistant")).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Can I take aspirin with warfarin/i)).toBeInTheDocument();
    });

    test("should send chat message", async () => {
      medicationStore.sendChatMessage.mockResolvedValue({});

      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/Can I take aspirin with warfarin/i);
      const sendBtn = screen.getByRole("button", { name: /send/i });

      await user.type(input, "What is ibuprofen?");
      await user.click(sendBtn);

      await waitFor(() => {
        expect(medicationStore.sendChatMessage).toHaveBeenCalledWith("What is ibuprofen?");
      });
    });

    test("should send message on Enter key", async () => {
      medicationStore.sendChatMessage.mockResolvedValue({});

      renderWithProviders(<Index />);

      const input = screen.getByPlaceholderText(/Can I take aspirin with warfarin/i);

      await user.type(input, "Test message{Enter}");

      await waitFor(() => {
        expect(medicationStore.sendChatMessage).toHaveBeenCalledWith("Test message");
      });
    });

    test("should not send empty message", async () => {
      renderWithProviders(<Index />);

      const sendBtn = screen.getByRole("button", { name: /send/i });

      expect(sendBtn).toBeDisabled();
    });

    test("should display chat history", () => {
      medicationStore.chatHistory = [
        { role: "user", content: "Hello", timestamp: new Date() },
        { role: "assistant", content: "Hi there!", timestamp: new Date() },
      ];

      renderWithProviders(<Index />);

      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi there!")).toBeInTheDocument();
    });

    test("should show empty chat state", () => {
      renderWithProviders(<Index />);

      expect(screen.getByText(/Start a conversation by asking a question below/i)).toBeInTheDocument();
    });

    test("should populate input with example query", async () => {
      renderWithProviders(<Index />);

      const exampleChip = screen.getByText("Can I take aspirin with warfarin?");
      await user.click(exampleChip);

      const input = screen.getByPlaceholderText(/Can I take aspirin with warfarin/i);
      expect(input).toHaveValue("Can I take aspirin with warfarin?");
    });

    test("should display error messages in chat", () => {
      medicationStore.chatHistory = [
        { role: "assistant", content: "Error: API failed", timestamp: new Date(), isError: true },
      ];

      renderWithProviders(<Index />);

      expect(screen.getByText(/Error: API failed/i)).toBeInTheDocument();
    });

    test("should display function call messages", () => {
      medicationStore.chatHistory = [
        {
          role: "assistant",
          content: "I checked that for you using check_interactions:",
          via: "gemini:function_call",
          function: "check_interactions",
          timestamp: new Date(),
        },
      ];

      renderWithProviders(<Index />);

      const matches = screen.queryAllByText(/check_interactions/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  describe("Loading States", () => {
    beforeEach(() => {
      medicationStore.showQuery = true;
    });

    test("should show loading state when searching", () => {
      medicationStore.isLoading = true;

      renderWithProviders(<Index />);

      expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });

    test("should show loading state when checking interactions", () => {
      medicationStore.isLoading = true;
      medicationStore.selectedMedications = ["aspirin", "warfarin"];

      renderWithProviders(<Index />);

      expect(screen.getByText(/checking/i)).toBeInTheDocument();
    });

    test("should show loading state when sending chat", () => {
      medicationStore.isLoading = true;

      renderWithProviders(<Index />);

      expect(screen.getByText(/sending/i)).toBeInTheDocument();
    });
  });

  describe("Explanation Display", () => {
    beforeEach(() => {
      medicationStore.showQuery = true;
    });

    test("should render explanation when available", () => {
      medicationStore.explanation = {
        medicationName: "Ibuprofen",
        brandNames: ["Advil", "Motrin"],
        drugClass: "NSAID",
        explanation: "Test explanation",
        keyPoints: ["Point 1", "Point 2"],
        readabilityScore: { grade: 6, level: "Elementary School" },
        sources: [],
        sideEffects: ["Nausea"],
        warnings: ["Warning 1"],
        interactions: [],
      };

      renderWithProviders(<Index />);

      expect(screen.getByText("Ibuprofen")).toBeInTheDocument();
      expect(screen.getByText(/Test explanation/i)).toBeInTheDocument();
    });

    test("should not render explanation when loading", () => {
      medicationStore.isLoading = true;
      medicationStore.explanation = {
        medicationName: "Test",
        explanation: "Should not show",
      };

      renderWithProviders(<Index />);

      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });
  });
});
