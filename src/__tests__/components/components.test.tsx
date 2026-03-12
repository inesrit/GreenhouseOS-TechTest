/**
 * Unit tests for React components
 * Tests rendering, user interactions, and edge cases
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PropertyCard from '@/app/components/PropertyCard';
import PropertyFilters from '@/app/components/PropertyFilters';
import StatusFilter from '@/app/components/StatusFilter';
import SortSelect from '@/app/components/SortSelect';
import OfferForm from '@/app/components/OfferForm';
import { PROPERTY_STATUS, SORT_OPTIONS, UI_TEXT } from '@/constants';
import type { EnrichedProperty, Offer } from '@/types';

describe('PropertyCard', () => {
  const mockProperty: EnrichedProperty = {
    id: 'prop-1',
    address: '123 Test Street, London',
    price: 500000,
    status: PROPERTY_STATUS.AVAILABLE,
    listedDate: '2024-01-15T10:00:00Z',
    imageUrl: '/test-image.jpg',
    _metadata: {
      offerCount: 3,
      contactCount: 2,
    },
  };

  it('renders property address', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('123 Test Street, London')).toBeInTheDocument();
  });

  it('renders formatted price with pound sign', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('£500,000')).toBeInTheDocument();
  });

  it('renders property status badge', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(PROPERTY_STATUS.AVAILABLE)).toBeInTheDocument();
  });

  it('renders offer count', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('3 offers')).toBeInTheDocument();
  });

  it('renders singular "offer" when count is 1', () => {
    const singleOfferProperty = {
      ...mockProperty,
      _metadata: { offerCount: 1, contactCount: 1 },
    };
    render(<PropertyCard property={singleOfferProperty} />);
    expect(screen.getByText('1 offer')).toBeInTheDocument();
  });

  it('renders link to property detail page', () => {
    render(<PropertyCard property={mockProperty} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/property/prop-1');
  });

  it('renders days listed', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText(/Listed/)).toBeInTheDocument();
  });

  it('handles property with zero offers', () => {
    const noOfferProperty = {
      ...mockProperty,
      _metadata: { offerCount: 0, contactCount: 0 },
    };
    render(<PropertyCard property={noOfferProperty} />);
    expect(screen.getByText('0 offers')).toBeInTheDocument();
  });

  it('handles missing metadata gracefully', () => {
    const propertyWithoutMetadata = {
      ...mockProperty,
      _metadata: undefined as unknown as EnrichedProperty['_metadata'],
    };
    render(<PropertyCard property={propertyWithoutMetadata} />);
    expect(screen.getByText('0 offers')).toBeInTheDocument();
  });
});

describe('StatusFilter', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default "All Statuses" selected when value is null', () => {
    render(<StatusFilter value={null} onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('');
  });

  it('renders with selected status', () => {
    render(<StatusFilter value={PROPERTY_STATUS.AVAILABLE} onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue(PROPERTY_STATUS.AVAILABLE);
  });

  it('renders all status options', () => {
    render(<StatusFilter value={null} onChange={mockOnChange} />);
    
    expect(screen.getByText(UI_TEXT.FILTER_ALL_STATUSES)).toBeInTheDocument();
    expect(screen.getByText(PROPERTY_STATUS.AVAILABLE)).toBeInTheDocument();
    expect(screen.getByText(PROPERTY_STATUS.SALE_AGREED)).toBeInTheDocument();
    expect(screen.getByText(PROPERTY_STATUS.SOLD)).toBeInTheDocument();
  });

  it('calls onChange with status when option selected', () => {
    render(<StatusFilter value={null} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: PROPERTY_STATUS.AVAILABLE } });
    
    expect(mockOnChange).toHaveBeenCalledWith(PROPERTY_STATUS.AVAILABLE);
  });

  it('calls onChange with null when "All Statuses" selected', () => {
    render(<StatusFilter value={PROPERTY_STATUS.AVAILABLE} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(null);
  });

  it('renders filter label', () => {
    render(<StatusFilter value={null} onChange={mockOnChange} />);
    expect(screen.getByText(`${UI_TEXT.FILTER_BY_STATUS}:`)).toBeInTheDocument();
  });
});

describe('SortSelect', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with selected sort option', () => {
    render(<SortSelect value={SORT_OPTIONS.NEWEST} onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue(SORT_OPTIONS.NEWEST);
  });

  it('renders all sort options', () => {
    render(<SortSelect value={SORT_OPTIONS.NEWEST} onChange={mockOnChange} />);
    
    expect(screen.getByText(UI_TEXT.SORT_NEWEST)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.SORT_OLDEST)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.SORT_PRICE_HIGH)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.SORT_PRICE_LOW)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.SORT_ADDRESS_AZ)).toBeInTheDocument();
    expect(screen.getByText(UI_TEXT.SORT_ADDRESS_ZA)).toBeInTheDocument();
  });

  it('calls onChange when option selected', () => {
    render(<SortSelect value={SORT_OPTIONS.NEWEST} onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: SORT_OPTIONS.PRICE_HIGH } });
    
    expect(mockOnChange).toHaveBeenCalledWith(SORT_OPTIONS.PRICE_HIGH);
  });

  it('renders sort label', () => {
    render(<SortSelect value={SORT_OPTIONS.NEWEST} onChange={mockOnChange} />);
    expect(screen.getByText(`${UI_TEXT.SORT_BY}:`)).toBeInTheDocument();
  });
});

describe('PropertyFilters', () => {
  const mockOnStatusFilterChange = jest.fn();
  const mockOnSortChange = jest.fn();

  const defaultProps = {
    statusFilter: null,
    onStatusFilterChange: mockOnStatusFilterChange,
    sortBy: SORT_OPTIONS.NEWEST,
    onSortChange: mockOnSortChange,
    filteredCount: 5,
    totalCount: 10,
  };

  beforeEach(() => {
    mockOnStatusFilterChange.mockClear();
    mockOnSortChange.mockClear();
  });

  it('renders filter and sort controls', () => {
    render(<PropertyFilters {...defaultProps} />);
    
    expect(screen.getByText(`${UI_TEXT.FILTER_BY_STATUS}:`)).toBeInTheDocument();
    expect(screen.getByText(`${UI_TEXT.SORT_BY}:`)).toBeInTheDocument();
  });

  it('displays property count', () => {
    render(<PropertyFilters {...defaultProps} />);
    expect(screen.getByText('Showing 5 of 10 properties')).toBeInTheDocument();
  });

  it('displays correct count when all properties shown', () => {
    render(<PropertyFilters {...defaultProps} filteredCount={10} totalCount={10} />);
    expect(screen.getByText('Showing 10 of 10 properties')).toBeInTheDocument();
  });

  it('displays zero count', () => {
    render(<PropertyFilters {...defaultProps} filteredCount={0} totalCount={10} />);
    expect(screen.getByText('Showing 0 of 10 properties')).toBeInTheDocument();
  });
});

describe('OfferForm', () => {
  const mockOnOfferSubmitted = jest.fn();

  const defaultProps = {
    propertyId: 'prop-1',
    askingPrice: 500000,
    isAvailable: true,
    onOfferSubmitted: mockOnOfferSubmitted,
  };

  beforeEach(() => {
    mockOnOfferSubmitted.mockClear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders form when property is available', () => {
      render(<OfferForm {...defaultProps} />);
      expect(screen.getByText(UI_TEXT.MAKE_AN_OFFER)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER })).toBeInTheDocument();
    });

    it('renders unavailable message when property not available', () => {
      render(<OfferForm {...defaultProps} isAvailable={false} />);
      expect(screen.getByText(UI_TEXT.PROPERTY_NOT_AVAILABLE)).toBeInTheDocument();
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('displays asking price', () => {
      render(<OfferForm {...defaultProps} />);
      expect(screen.getByText(/Asking price:/)).toBeInTheDocument();
      expect(screen.getByText(/£500,000/)).toBeInTheDocument();
    });
  });

  describe('input validation', () => {
    it('shows required error on empty submission', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(UI_TEXT.OFFER_VALIDATION_REQUIRED)).toBeInTheDocument();
      });
    });

    it('shows minimum error for amount below 1000', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '999');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(UI_TEXT.OFFER_VALIDATION_MIN)).toBeInTheDocument();
      });
    });

    it('shows max error for amount above limit', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '999999999999');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(UI_TEXT.OFFER_VALIDATION_MAX)).toBeInTheDocument();
      });
    });

    it('shows validation error for empty amount on blur', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.focus(input);
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByText(UI_TEXT.OFFER_VALIDATION_REQUIRED)).toBeInTheDocument();
      });
    });

    it('accepts valid numeric input with commas', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500,000');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('offer comparison hints', () => {
    it('shows above asking price hint', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '550000');

      await waitFor(() => {
        expect(screen.getByText(/above asking price/)).toBeInTheDocument();
      });
    });

    it('shows below asking price hint', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '450000');

      await waitFor(() => {
        expect(screen.getByText(/below asking price/)).toBeInTheDocument();
      });
    });
  });

  describe('form submission', () => {
    it('submits offer successfully', async () => {
      const mockOffer: Offer = {
        id: 'offer-1',
        propertyId: 'prop-1',
        contactId: 'contact-guest',
        amount: 500000,
        status: 'Pending',
        dateAdded: '2024-03-12T10:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: UI_TEXT.API_OFFER_SUBMITTED,
          offer: mockOffer,
        }),
      });

      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(/submitted successfully/)).toBeInTheDocument();
      });

      expect(mockOnOfferSubmitted).toHaveBeenCalledWith(mockOffer);
    });

    it('shows submitting state during request', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText(UI_TEXT.SUBMITTING_OFFER)).toBeInTheDocument();
      });
    });

    it('handles API error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Server error' }),
      });

      const { container } = render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const form = container.querySelector('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/offers', expect.any(Object));
      });
    });

    it('calls fetch with correct data on submit', async () => {
      const mockOffer: Offer = {
        id: 'offer-1',
        propertyId: 'prop-1',
        contactId: 'contact-guest',
        amount: 500000,
        status: 'Pending',
        dateAdded: '2024-03-12T10:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          offer: mockOffer,
        }),
      });

      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            propertyId: 'prop-1',
            amount: 500000,
          }),
        });
      });
    });

    it('clears input after successful submission', async () => {
      const mockOffer: Offer = {
        id: 'offer-1',
        propertyId: 'prop-1',
        contactId: 'contact-guest',
        amount: 500000,
        status: 'Pending',
        dateAdded: '2024-03-12T10:00:00Z',
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          offer: mockOffer,
        }),
      });

      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input).toHaveValue('');
      });
    });

    it('disables button while submitting', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, '500000');
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeDisabled();
      });
    });
  });

  describe('accessibility', () => {
    it('has accessible input with label', () => {
      render(<OfferForm {...defaultProps} />);
      expect(screen.getByLabelText(/Offer Amount/)).toBeInTheDocument();
    });

    it('has aria-invalid on error', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      await userEvent.type(input, 'invalid');
      fireEvent.blur(input);

      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
      });
    });

    it('error message has alert role', async () => {
      render(<OfferForm {...defaultProps} />);
      
      const button = screen.getByRole('button', { name: UI_TEXT.SUBMIT_OFFER });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });
});
