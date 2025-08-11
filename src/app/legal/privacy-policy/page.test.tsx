import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/test-utils";
import PrivacyPolicy from "./page";

describe("Privacy Policy Page", () => {
  it("should render the page with non-empty content", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    // Check for main heading
    const heading = screen.getByRole('heading', { name: 'Privacy Policy' });
    expect(heading).toBeInTheDocument();
  });

  it("should display last updated date", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    const lastUpdatedText = screen.getByText(/Last updated:/);
    expect(lastUpdatedText).toBeInTheDocument();
  });

  it("should contain all major sections", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    // Check for section headings
    expect(screen.getByRole('heading', { name: 'Information We Collect' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'How We Use Your Information' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Information Sharing' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
  });

  it("should contain substantial text content", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    // Check that there's actual content, not just headings
    const privacySection = screen.getByText(/we take your privacy seriously/);
    expect(privacySection).toBeInTheDocument();
    
    const informationSection = screen.getByText(/We use the information we collect to provide/);
    expect(informationSection).toBeInTheDocument();
  });

  it("should have proper page structure with container and article", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    // Should use proper semantic HTML
    const article = screen.getByRole('article');
    expect(article).toBeInTheDocument();
    
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it("should contain contact email link", () => {
    renderWithProviders(<PrivacyPolicy />);
    
    // Should have a mailto link in the contact section
    const emailLinks = screen.getAllByRole('link');
    const mailtoLink = emailLinks.find(link => 
      link.getAttribute('href')?.startsWith('mailto:')
    );
    expect(mailtoLink).toBeInTheDocument();
  });
});