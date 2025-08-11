import { vi } from "vitest";

// Type-safe mock for Convex auth actions
export const mockAuthActions = {
  signIn: vi.fn<(provider?: string) => Promise<void>>(),
  signOut: vi.fn<() => Promise<void>>(),
};

// Mock user data for testing
export const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  image: "https://example.com/avatar.jpg",
};

// Type-safe interface for mock Convex module
interface MockConvexModule {
  __setAuthenticated: (auth: boolean) => void;
  __setQueryResult: (queryKey: string, result: unknown) => void;
  __clearQueries: () => void;
}

/**
 * Type-safe helper to reset Convex mocks
 */
export function resetConvexMocks(mockConvex: MockConvexModule) {
  vi.clearAllMocks();
  mockConvex.__setAuthenticated(false);
  mockConvex.__clearQueries();
}

/**
 * Type-safe helper to set up authenticated state with mock data
 */
export function setupAuthenticatedState(
  mockConvex: MockConvexModule, 
  creditsCount = 50
) {
  mockConvex.__setAuthenticated(true);
  // Set up common query results
  mockConvex.__setQueryResult('"users.getCurrentUser"', mockUser);
  mockConvex.__setQueryResult('"users.getAvailableCredits"', creditsCount);
}