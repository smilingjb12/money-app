import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import RefundPolicy from "./page";

describe("Refund Policy Page", () => {
  it("should render the page with non-empty content", () => {
    renderWithProviders(<RefundPolicy />);
    
    // Check for main heading
    const heading = screen.getByRole('heading', { name: 'Refund Policy' });
    expect(heading).toBeInTheDocument();
  });

  it("should display last updated date", () => {
    renderWithProviders(<RefundPolicy />);
    
    const lastUpdatedText = screen.getByText(/Last updated:/);
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it("should contain all major sections", () => {
    renderWithProviders(<RefundPolicy />);
    
    // Check for section headings
    expect(screen.getByRole('heading', { name: 'Refund Eligibility' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Refund Timeframe' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How to Request a Refund' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Partial Refunds' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact for Refunds' })).toBeInTheDocument();
  });

  it("should contain substantial text content", () => {
    renderWithProviders(<RefundPolicy />);
    
    // Check that there's actual content, not just headings
    const eligibilitySection = screen.getByText(/we want you to be completely satisfied/);
    expect(eligibilitySection).toBeInTheDocument();
    
    const timeframeSection = screen.getByText(/Refund requests must be submitted within 30 days/);
    expect(timeframeSection).toBeInTheDocument();
  });

  it("should have proper page structure with container and article", () => {
    renderWithProviders(<RefundPolicy />);
    
    // Should use proper semantic HTML
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it("should contain contact email link", () => {
    renderWithProviders(<RefundPolicy />);
    
    // Should have a mailto link in the contact section
    const emailLinks = screen.getAllByRole('link');
    const mailtoLink = emailLinks.find(link => 
      link.getAttribute('href')?.startsWith('mailto:')
    );
    expect(mailtoLink).toBeInTheDocument();
  });

  it("should use consistent styling with other legal pages", () => {
    renderWithProviders(<RefundPolicy />);
    
    const heading = screen.getByRole('heading', { name: 'Refund Policy' });
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'text-foreground', 'mb-4');
  });
});