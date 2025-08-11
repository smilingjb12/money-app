import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import TermsOfService from "./page";

describe("Terms of Service Page", () => {
  it("should render the page with non-empty content", () => {
    renderWithProviders(<TermsOfService />);
    
    // Check for main heading
    const heading = screen.getByRole('heading', { name: 'Terms of Service' });
    expect(heading).toBeInTheDocument();
  });

  it("should display last updated date", () => {
    renderWithProviders(<TermsOfService />);
    
    const lastUpdatedText = screen.getByText(/Last updated:/);
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it("should contain all major sections", () => {
    renderWithProviders(<TermsOfService />);
    
    // Check for section headings
    expect(screen.getByRole('heading', { name: 'Acceptance of Terms' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Use License' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'User Accounts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Service Modifications' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact Information' })).toBeInTheDocument();
  });

  it("should contain substantial text content", () => {
    renderWithProviders(<TermsOfService />);
    
    // Check that there's actual content, not just headings
    const acceptanceSection = screen.getByText(/By accessing and using.*you accept and agree/);
    expect(acceptanceSection).toBeInTheDocument();
    
    const licenseSection = screen.getByText(/Permission is granted to temporarily access/);
    expect(licenseSection).toBeInTheDocument();
  });

  it("should have proper page structure with container and article", () => {
    renderWithProviders(<TermsOfService />);
    
    // Should use proper semantic HTML
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it("should contain contact email link", () => {
    renderWithProviders(<TermsOfService />);
    
    // Should have a mailto link in the contact section
    const emailLinks = screen.getAllByRole('link');
    const mailtoLink = emailLinks.find(link => 
      link.getAttribute('href')?.startsWith('mailto:')
    );
    expect(mailtoLink).toBeInTheDocument();
  });
});