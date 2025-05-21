/**
 * File: src/components/features/ProductInformationForm/__tests__/index.test.tsx
 * 
 * Test suite for the ProductInformationForm component
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductInformationForm from '../index';
import { MarketingProvider } from '../../../../context/MarketingContext';
import { NotificationProvider } from '../../../../context/NotificationContext';

// Mock the notification context
jest.mock('../../../../context/NotificationContext', () => ({
  ...jest.requireActual('../../../../context/NotificationContext'),
  useNotification: () => ({
    showNotification: jest.fn(),
  }),
}));

// Wrapper component to provide necessary contexts
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <NotificationProvider>
    <MarketingProvider>
      {children}
    </MarketingProvider>
  </NotificationProvider>
);

describe('ProductInformationForm', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders all form fields', () => {
    render(<ProductInformationForm />, { wrapper: Wrapper });

    // Check for all main form elements
    expect(screen.getByLabelText(/product name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/product type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/value proposition/i)).toBeInTheDocument();
    expect(screen.getByText(/key benefits/i)).toBeInTheDocument();
  });

  it('allows adding and removing benefits', async () => {
    render(<ProductInformationForm />, { wrapper: Wrapper });

    // Should start with one benefit field
    expect(screen.getAllByPlaceholderText(/benefit/i)).toHaveLength(1);

    // Add a new benefit
    const addButton = screen.getByText(/add another benefit/i);
    fireEvent.click(addButton);

    // Should now have two benefit fields
    expect(screen.getAllByPlaceholderText(/benefit/i)).toHaveLength(2);

    // Remove the second benefit
    const removeButton = screen.getByText(/remove/i);
    fireEvent.click(removeButton);

    // Should be back to one benefit field
    expect(screen.getAllByPlaceholderText(/benefit/i)).toHaveLength(1);
  });

  it('handles form submission', async () => {
    render(<ProductInformationForm />, { wrapper: Wrapper });

    // Fill out the form
    await userEvent.type(screen.getByLabelText(/product name/i), 'Test Product');
    await userEvent.type(screen.getByLabelText(/product type/i), 'Software');
    await userEvent.type(screen.getByLabelText(/value proposition/i), 'Amazing value');
    await userEvent.type(screen.getByPlaceholderText(/benefit 1/i), 'First benefit');

    // Submit the form
    const submitButton = screen.getByText(/save product information/i);
    fireEvent.click(submitButton);

    // Verify the form data was saved to localStorage
    await waitFor(() => {
      const savedState = JSON.parse(localStorage.getItem('marketingProgramState') || '{}');
      expect(savedState.productInfo).toBeTruthy();
      expect(savedState.productInfo.name).toBe('Test Product');
    });
  });

  it('loads existing data', () => {
    // Set up initial state in localStorage
    const initialState = {
      productInfo: {
        name: 'Existing Product',
        type: 'Hardware',
        valueProposition: 'Existing value',
        keyBenefits: ['Existing benefit'],
      },
    };
    localStorage.setItem('marketingProgramState', JSON.stringify(initialState));

    render(<ProductInformationForm />, { wrapper: Wrapper });

    // Verify form is populated with existing data
    expect(screen.getByLabelText(/product name/i)).toHaveValue('Existing Product');
    expect(screen.getByLabelText(/product type/i)).toHaveValue('Hardware');
    expect(screen.getByLabelText(/value proposition/i)).toHaveValue('Existing value');
    expect(screen.getByPlaceholderText(/benefit 1/i)).toHaveValue('Existing benefit');
  });

  it('enforces maximum benefits limit', async () => {
    render(<ProductInformationForm />, { wrapper: Wrapper });

    // Add benefits until reaching the limit
    const addButton = screen.getByText(/add another benefit/i);
    for (let i = 0; i < 4; i++) {
      fireEvent.click(addButton);
    }

    // Should have 5 benefit fields
    expect(screen.getAllByPlaceholderText(/benefit/i)).toHaveLength(5);

    // Add button should be gone
    expect(screen.queryByText(/add another benefit/i)).not.toBeInTheDocument();
  });
});