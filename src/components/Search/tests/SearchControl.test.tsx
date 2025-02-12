import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchControl from '../SearchControl';
import { useDogs } from '../../../contexts/DogsContext';

jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

describe('SearchControl', () => {
  const mockSetSearchParams = jest.fn();
  const defaultSearchParams = {
    sortDirection: 'asc'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockImplementation(() => ({
      searchParams: defaultSearchParams,
      setSearchParams: mockSetSearchParams
    }));
  });

  it('renders sort control with correct default value', () => {
    render(<SearchControl />);
    
    const select = screen.getByLabelText('Sort by Breed:');
    expect(select).toHaveValue('asc');
  });

  it('displays both sorting options', () => {
    render(<SearchControl />);
    
    expect(screen.getByText('Ascending')).toBeInTheDocument();
    expect(screen.getByText('Descending')).toBeInTheDocument();
  });

  it('updates sort direction when changed', () => {
    render(<SearchControl />);
    
    const select = screen.getByLabelText('Sort by Breed:');
    fireEvent.change(select, { target: { value: 'desc' } });
    
    expect(mockSetSearchParams).toHaveBeenCalled();
    
    const updater = mockSetSearchParams.mock.calls[0][0];
    const result = updater({ sortDirection: 'asc' });
    
    expect(result).toEqual({
      sortDirection: 'desc',
      from: 0
    });
  });

  it('resets pagination when sort direction changes', () => {
    render(<SearchControl />);
    
    const select = screen.getByLabelText('Sort by Breed:');
    fireEvent.change(select, { target: { value: 'desc' } });
    
    const updater = mockSetSearchParams.mock.calls[0][0];
    const result = updater({ 
      sortDirection: 'asc',
      from: 25
    });
    
    expect(result.from).toBe(0);
  });
});