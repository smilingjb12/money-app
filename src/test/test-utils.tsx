import { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { vi } from "vitest";

// Mock Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

// Custom render function
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: TestWrapper, ...options });

// Re-export everything from RTL
export * from "@testing-library/react";

// Re-export Convex test utilities for convenience
export * from "./convex-mocks";

