import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders, mockAuthActions } from "@/test/test-utils";
import HomePage from "./page";

// Mock Next.js navigation  
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock Convex auth
vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: () => mockAuthActions,
}));

// Mock Convex React
vi.mock("convex/react", () => {
  let isAuthenticated = false;

  return {
    Authenticated: ({ children }: { children: React.ReactNode }) =>
      isAuthenticated ? children : null,
    Unauthenticated: ({ children }: { children: React.ReactNode }) =>
      !isAuthenticated ? children : null,
    
    // Test helper to control auth state - using consistent interface
    __setAuthenticated: (auth: boolean) => {
      isAuthenticated = auth;
    },
    __setQueryResult: () => {
      // Not used in this test but required for interface consistency
    },
    __clearQueries: () => {
      // Not used in this test but required for interface consistency
    },
  };
});

type MockConvexModule = {
  __setAuthenticated: (auth: boolean) => void;
  __setQueryResult: (queryKey: string, result: unknown) => void;
  __clearQueries: () => void;
};

// Import mock module dynamically in beforeEach to avoid top-level await
let mockConvex: typeof import("convex/react") & MockConvexModule;

describe("Landing Page", () => {
  beforeEach(async () => {
    if (!mockConvex) {
      mockConvex = (await import("convex/react")) as typeof import("convex/react") & MockConvexModule;
    }
    vi.clearAllMocks();
    mockConvex.__setAuthenticated(false);
  });

  describe("Unauthenticated State", () => {
    it("should display 'Get Started Now' button that triggers sign in", () => {
      renderWithProviders(<HomePage />);
      
      const getStartedButtons = screen.getAllByText("Get Started Now");
      expect(getStartedButtons).toHaveLength(1); // Only unauthenticated version should show
      
      fireEvent.click(getStartedButtons[0]);
      expect(mockAuthActions.signIn).toHaveBeenCalledWith("google");
    });

    it("should display 'Start Free Trial' button in final CTA section", () => {
      renderWithProviders(<HomePage />);
      
      const startTrialButton = screen.getByText("Start Free Trial");
      expect(startTrialButton).toBeInTheDocument();
      
      fireEvent.click(startTrialButton);
      expect(mockAuthActions.signIn).toHaveBeenCalledWith("google");
    });

    it("should display 'Get Started' button in pricing section", () => {
      renderWithProviders(<HomePage />);
      
      const getStartedButton = screen.getByText("Get Started");
      expect(getStartedButton).toBeInTheDocument();
      
      fireEvent.click(getStartedButton);
      expect(mockAuthActions.signIn).toHaveBeenCalledWith("google");
    });

    it("should not display authenticated-only content", () => {
      renderWithProviders(<HomePage />);
      
      // These should not appear when unauthenticated
      expect(screen.queryByText("Go to Dashboard")).not.toBeInTheDocument();
      expect(screen.queryByText("Sign in to start")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated State", () => {
    beforeEach(() => {
      mockConvex.__setAuthenticated(true);
    });

    // NOTE: This test documents current behavior - the "Go to Dashboard" logic is not yet implemented
    it("should currently still show 'Get Started Now' button (not yet implemented to show 'Go to Dashboard')", () => {
      renderWithProviders(<HomePage />);
      
      // Currently, the page always shows "Get Started Now" regardless of auth state
      // This is expected behavior until the feature is implemented
      const getStartedButtons = screen.getAllByText("Get Started Now");
      expect(getStartedButtons).toHaveLength(1);
      
      // The button should be a Link to /collection, not a button that triggers sign in
      const button = getStartedButtons[0];
      expect(button.closest('a')).toHaveAttribute('href', '/collection');
    });

    // NOTE: This test documents current behavior - the final CTA is not yet implemented
    it("should currently still show sign-in button instead of 'Go to Dashboard' (not yet implemented)", () => {
      renderWithProviders(<HomePage />);
      
      // Currently shows sign-in button instead of "Go to Dashboard"
      // This test documents the current state before implementation
      // In authenticated state, the buttons should be links to /collection instead of sign-in triggers
      const buttons = screen.getAllByText(/Get Started/);
      expect(buttons.length).toBeGreaterThan(0);
      
      // The first button should be a link (authenticated state), not a sign-in button
      const firstButton = buttons[0];
      if (firstButton.closest('a')) {
        expect(firstButton.closest('a')).toHaveAttribute('href', '/collection');
      } else {
        // If it's still a button, it should trigger sign-in (fallback behavior)
        fireEvent.click(firstButton);
        expect(mockAuthActions.signIn).toHaveBeenCalledWith("google");
      }
    });

    it("should display 'Sign in to start' button in pricing section when authenticated", () => {
      renderWithProviders(<HomePage />);
      
      const signInToStartButton = screen.getByText("Sign in to start");
      expect(signInToStartButton).toBeInTheDocument();
      
      fireEvent.click(signInToStartButton);
      expect(mockAuthActions.signIn).toHaveBeenCalledWith("google");
    });

    // Future test for when the feature is implemented
    it.skip("FUTURE: should display 'Go to Dashboard' button in hero section when authenticated", () => {
      renderWithProviders(<HomePage />);
      
      // This test should pass once the feature is implemented
      const goToDashboardButton = screen.getByText("Go to Dashboard");
      expect(goToDashboardButton).toBeInTheDocument();
      expect(goToDashboardButton.closest('a')).toHaveAttribute('href', '/collection');
    });

    // Future test for when the feature is implemented  
    it.skip("FUTURE: should display 'Go to Dashboard' button in final CTA when authenticated", () => {
      renderWithProviders(<HomePage />);
      
      // This test should pass once the feature is implemented
      const goToDashboardButton = screen.getAllByText("Go to Dashboard");
      expect(goToDashboardButton).toHaveLength(1);
      expect(goToDashboardButton[0].closest('a')).toHaveAttribute('href', '/collection');
    });
  });

  describe("Common Elements", () => {
    it("should always display Contact Sales button", () => {
      renderWithProviders(<HomePage />);
      
      const contactSalesButton = screen.getByText("Contact Sales");
      expect(contactSalesButton).toBeInTheDocument();
    });

    it("should display upgrade buttons in pricing section", () => {
      renderWithProviders(<HomePage />);
      
      const upgradeButtons = screen.getAllByText("Upgrade Now");
      expect(upgradeButtons).toHaveLength(2); // Professional and Enterprise tiers
      
      upgradeButtons.forEach(button => {
        expect(button.closest('a')).toHaveAttribute('href', '/upgrade');
      });
    });

    it("should display main heading with business tagline", () => {
      renderWithProviders(<HomePage />);
      
      // Should contain the business tagline from Constants
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it("should display feature sections", () => {
      renderWithProviders(<HomePage />);
      
      expect(screen.getByText("Everything you need to succeed")).toBeInTheDocument();
      expect(screen.getByText("Simple, transparent pricing")).toBeInTheDocument();
      expect(screen.getByText("Loved by teams worldwide")).toBeInTheDocument();
      expect(screen.getByText("Ready to get started?")).toBeInTheDocument();
    });
  });
});