import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import { Footer } from "./footer";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("Footer Component", () => {
  it("should display all legal navigation links", () => {
    renderWithProviders(<Footer />);
    
    // Check that all three legal links are present
    const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
    const refundLink = screen.getByRole('link', { name: 'Refund Policy' });
    
    expect(termsLink).toBeInTheDocument();
    expect(privacyLink).toBeInTheDocument();
    expect(refundLink).toBeInTheDocument();
  });

  it("should have correct href attributes for legal links", () => {
    renderWithProviders(<Footer />);
    
    const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
    const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
    const refundLink = screen.getByRole('link', { name: 'Refund Policy' });
    
    expect(termsLink).toHaveAttribute('href', '/legal/terms-of-service');
    expect(privacyLink).toHaveAttribute('href', '/legal/privacy-policy');
    expect(refundLink).toHaveAttribute('href', '/legal/refund-policy');
  });

  it("should display app logo and name", () => {
    renderWithProviders(<Footer />);
    
    // Should have a link to home page with logo (first link should be the logo link)
    const logoLink = screen.getAllByRole('link')[0];
    expect(logoLink).toHaveAttribute('href', '/');
    
    // Should display app name (FlowSpace based on Constants)
    expect(screen.getByText('FlowSpace')).toBeInTheDocument();
  });

  it("should display Legal section heading", () => {
    renderWithProviders(<Footer />);
    
    const legalHeading = screen.getByText('Legal');
    expect(legalHeading).toBeInTheDocument();
  });

  it("should display Support section with contact email", () => {
    renderWithProviders(<Footer />);
    
    const supportHeading = screen.getByText('Support');
    expect(supportHeading).toBeInTheDocument();
    
    const contactLink = screen.getByText('Contact Support');
    expect(contactLink).toBeInTheDocument();
    
    // Should be a mailto link
    expect(contactLink).toHaveAttribute('href');
    expect(contactLink.getAttribute('href')).toMatch(/^mailto:/);
  });

  it("should display copyright text with current year", () => {
    renderWithProviders(<Footer />);
    
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(new RegExp(`© ${currentYear}.*All rights reserved`));
    expect(copyrightText).toBeInTheDocument();
  });

  it("should apply correct CSS classes for styling", () => {
    renderWithProviders(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('bg-background', 'py-12', 'border-t', 'border-border');
  });

  it("should have proper link hover styles", () => {
    renderWithProviders(<Footer />);
    
    const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
    expect(termsLink).toHaveClass('text-muted-foreground', 'hover:text-foreground', 'transition-colors');
  });

  describe("Accessibility", () => {
    it("should have semantic footer element", () => {
      renderWithProviders(<Footer />);
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toBeInTheDocument();
    });

    it("should have proper heading hierarchy", () => {
      renderWithProviders(<Footer />);
      
      const legalHeading = screen.getByRole('heading', { name: 'Legal' });
      const supportHeading = screen.getByRole('heading', { name: 'Support' });
      
      expect(legalHeading).toBeInTheDocument();
      expect(supportHeading).toBeInTheDocument();
      
      // Both should be h3 elements based on the component
      expect(legalHeading.tagName).toBe('H3');
      expect(supportHeading.tagName).toBe('H3');
    });

    it("should have accessible navigation for legal links", () => {
      renderWithProviders(<Footer />);
      
      // All legal links should be within a nav element
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      // Check that all legal links are within the nav
      const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
      const refundLink = screen.getByRole('link', { name: 'Refund Policy' });
      
      expect(nav).toContainElement(termsLink);
      expect(nav).toContainElement(privacyLink);
      expect(nav).toContainElement(refundLink);
    });
  });
});