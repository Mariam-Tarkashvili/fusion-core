import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider } from "notistack";
import ExplanationDisplay from "../components/ExplanationDisplay";

// Mock fetch globally
global.fetch = jest.fn();

const renderWithProviders = (component) => {
  return render(<SnackbarProvider maxSnack={3}>{component}</SnackbarProvider>);
};

describe("ExplanationDisplay Component", () => {
  let user;

  const defaultProps = {
    medicationName: "Ibuprofen",
    explanation:
      "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to reduce fever and treat pain or inflammation.",
    keyPoints: ["Drug Class: NSAID", "Common Uses: Pain relief, Fever reduction", "Dosage: 200-400mg every 4-6 hours"],
    readabilityScore: {
      grade: 6,
      level: "Elementary School",
    },
    sources: [],
    sideEffects: ["Nausea", "Headache", "Dizziness"],
    warnings: ["Do not exceed 1200mg per day", "May cause stomach bleeding"],
  };

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    global.fetch.mockReset();
  });

  describe("Rendering", () => {
    test("should render medication name", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText("Ibuprofen")).toBeInTheDocument();
    });

    test("should render explanation text", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText(/nonsteroidal anti-inflammatory drug/i)).toBeInTheDocument();
    });

    test("should render readability score", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText(/Reading Level: Grade 6/i)).toBeInTheDocument();
      expect(screen.getByText("Elementary School")).toBeInTheDocument();
    });

    test("should render all key points", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText(/Drug Class: NSAID/i)).toBeInTheDocument();
      expect(screen.getByText(/Common Uses: Pain relief/i)).toBeInTheDocument();
      expect(screen.getByText(/Dosage: 200-400mg/i)).toBeInTheDocument();
    });

    test("should render side effects section", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText("Common Side Effects")).toBeInTheDocument();
      expect(screen.getByText("Nausea")).toBeInTheDocument();
      expect(screen.getByText("Headache")).toBeInTheDocument();
      expect(screen.getByText("Dizziness")).toBeInTheDocument();
    });

    test("should render warnings section", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText("Important Warnings")).toBeInTheDocument();
      expect(screen.getByText(/Do not exceed 1200mg per day/i)).toBeInTheDocument();
      expect(screen.getByText(/May cause stomach bleeding/i)).toBeInTheDocument();
    });

    test("should render medical disclaimer", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText(/Medical Disclaimer/i)).toBeInTheDocument();
      expect(screen.getByText(/educational purposes only/i)).toBeInTheDocument();
    });
  });

  describe("Drug Interactions", () => {
    test("should render interactions when provided", () => {
      const propsWithInteractions = {
        ...defaultProps,
        sources: [
          {
            name: "Interaction with Aspirin",
            snippet: "MODERATE: May increase bleeding risk",
          },
          {
            name: "Interaction with Warfarin",
            snippet: "MAJOR: Significantly increases bleeding risk",
          },
        ],
      };

      renderWithProviders(<ExplanationDisplay {...propsWithInteractions} />);

      expect(screen.getByText("Drug Interactions")).toBeInTheDocument();
      expect(screen.getByText("Interaction with Aspirin")).toBeInTheDocument();
      expect(screen.getByText(/MODERATE: May increase bleeding risk/i)).toBeInTheDocument();
      expect(screen.getByText("Interaction with Warfarin")).toBeInTheDocument();
    });

    test("should not render interactions section when empty", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.queryByText("Drug Interactions")).not.toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    test("should handle missing key points", () => {
      const propsWithoutKeyPoints = {
        ...defaultProps,
        keyPoints: [],
      };

      renderWithProviders(<ExplanationDisplay {...propsWithoutKeyPoints} />);

      // Should still render but with no key points
      expect(screen.queryByText("Key Information")).not.toBeInTheDocument();
    });

    test("should handle missing side effects", () => {
      const propsWithoutSideEffects = {
        ...defaultProps,
        sideEffects: [],
      };

      renderWithProviders(<ExplanationDisplay {...propsWithoutSideEffects} />);

      expect(screen.queryByText("Common Side Effects")).not.toBeInTheDocument();
    });

    test("should handle missing warnings", () => {
      const propsWithoutWarnings = {
        ...defaultProps,
        warnings: [],
      };

      renderWithProviders(<ExplanationDisplay {...propsWithoutWarnings} />);

      expect(screen.queryByText("Important Warnings")).not.toBeInTheDocument();
    });

    test("should handle all optional props missing", () => {
      const minimalProps = {
        medicationName: "Test Med",
        explanation: "Test explanation",
      };

      renderWithProviders(<ExplanationDisplay {...minimalProps} />);

      expect(screen.getByText("Test Med")).toBeInTheDocument();
      expect(screen.getByText("Test explanation")).toBeInTheDocument();
    });
  });

  describe("Feedback Functionality", () => {
    test("should render feedback buttons", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      expect(screen.getByText(/Was this explanation helpful/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /helpful/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /unclear/i })).toBeInTheDocument();
    });

    test("should submit helpful feedback", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Thank you for your feedback!" }),
      });

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      await user.click(helpfulBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/feedback",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              medicationName: "Ibuprofen",
              type: "helpful",
            }),
          })
        );
      });
    });

    test("should submit unclear feedback", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Thank you for your feedback!" }),
      });

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const unclearBtn = screen.getByRole("button", { name: /unclear/i });
      await user.click(unclearBtn);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "http://localhost:5000/api/feedback",
          expect.objectContaining({
            method: "POST",
            body: JSON.stringify({
              medicationName: "Ibuprofen",
              type: "unclear",
            }),
          })
        );
      });
    });

    test("should disable feedback buttons after submission", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Thank you!" }),
      });

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      const unclearBtn = screen.getByRole("button", { name: /unclear/i });

      await user.click(helpfulBtn);

      await waitFor(() => {
        expect(helpfulBtn).toBeDisabled();
        expect(unclearBtn).toBeDisabled();
      });
    });

    test("should show thank you message after feedback", async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Thank you!" }),
      });

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      await user.click(helpfulBtn);

      await waitFor(() => {
        expect(screen.getByText(/Thank you for your feedback/i)).toBeInTheDocument();
      });
    });

    test("should handle feedback submission errors gracefully", async () => {
      global.fetch.mockRejectedValue(new Error("Network error"));

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      await user.click(helpfulBtn);

      // Should still show at least one thank you message despite error
      await waitFor(() => {
        const matches = screen.queryAllByText(/Thank you for your feedback/i);
        expect(matches.length).toBeGreaterThan(0);
      });
    });

    test("should handle non-ok fetch responses", async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Server error" }),
      });

      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      await user.click(helpfulBtn);

      // Should still show at least one thank you message
      await waitFor(() => {
        const matches = screen.queryAllByText(/Thank you for your feedback/i);
        expect(matches.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Visual Elements", () => {
    test("should render medication icon", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      // MUI icons are rendered as SVG elements
      const medicationIcon = screen.getByTestId ? screen.getByTestId("MedicationIcon") : null;
      // If icon can't be tested directly, at least verify the section exists
      expect(screen.getByText("Ibuprofen")).toBeInTheDocument();
    });

    test("should render numbered list for key points", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const keyPointsSection = screen.getByText("Key Information");
      expect(keyPointsSection).toBeInTheDocument();

      // Verify list items exist
      expect(screen.getByText(/Drug Class: NSAID/i)).toBeInTheDocument();
    });

    test("should apply correct styling classes", () => {
      const { container } = renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      // Check for MUI Card component
      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("should have proper heading structure", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const heading = screen.getByRole("heading", { name: "Ibuprofen" });
      expect(heading).toBeInTheDocument();
    });

    test("should have accessible buttons", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const helpfulBtn = screen.getByRole("button", { name: /helpful/i });
      const unclearBtn = screen.getByRole("button", { name: /unclear/i });

      expect(helpfulBtn).toBeInTheDocument();
      expect(unclearBtn).toBeInTheDocument();
    });

    test("should render list items properly", () => {
      renderWithProviders(<ExplanationDisplay {...defaultProps} />);

      const listItems = screen.getAllByRole("listitem");
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    test("should handle very long medication names", () => {
      const longNameProps = {
        ...defaultProps,
        medicationName: "Acetylsalicylic Acid Dipyridamole Extended Release",
      };

      renderWithProviders(<ExplanationDisplay {...longNameProps} />);

      expect(screen.getByText(/Acetylsalicylic Acid Dipyridamole/i)).toBeInTheDocument();
    });

    test("should handle very long explanations", () => {
      const longExplanation = "This is a very long explanation. ".repeat(50);
      const longExplProps = {
        ...defaultProps,
        explanation: longExplanation,
      };

      renderWithProviders(<ExplanationDisplay {...longExplProps} />);

      expect(screen.getByText(/This is a very long explanation/i)).toBeInTheDocument();
    });

    test("should handle special characters in content", () => {
      const specialCharProps = {
        ...defaultProps,
        sideEffects: ["Nausea & Vomiting", "Headache (severe)", "Dizziness < 5%"],
      };

      renderWithProviders(<ExplanationDisplay {...specialCharProps} />);

      expect(screen.getByText("Nausea & Vomiting")).toBeInTheDocument();
      expect(screen.getByText("Headache (severe)")).toBeInTheDocument();
    });

    test("should handle undefined readability score", () => {
      const noScoreProps = {
        ...defaultProps,
        readabilityScore: undefined,
      };

      // Should use default values
      renderWithProviders(<ExplanationDisplay {...noScoreProps} />);

      expect(screen.getByText(/Reading Level: Grade 6/i)).toBeInTheDocument();
    });
  });
});
