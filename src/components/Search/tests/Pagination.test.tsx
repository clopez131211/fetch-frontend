import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';
import { useDogs } from '../../../contexts/DogsContext';

jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

describe('Pagination', () => {
  const mockSetSearchParams = jest.fn();

  const defaultProps = {
    pagination: {
      total: 100,
      prev: '?from=0&size=25',
      next: '?from=25&size=25'
    },
    searchParams: {
      from: 25,
      size: 25
    },
    setSearchParams: mockSetSearchParams
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockImplementation(() => defaultProps);
  });

  it('renders pagination controls correctly', () => {
    render(<Pagination />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 4')).toBeInTheDocument();
  });

  it('handles previous page click', () => {
    render(<Pagination />);
    
    fireEvent.click(screen.getByText('Previous'));
    
    expect(mockSetSearchParams).toHaveBeenCalled();
    const updater = mockSetSearchParams.mock.calls[0][0];
    const result = updater({ from: 25 });
    expect(result).toEqual({ from: 0 });
  });

  it('handles next page click', () => {
    render(<Pagination />);
    
    fireEvent.click(screen.getByText('Next'));
    
    expect(mockSetSearchParams).toHaveBeenCalled();
    const updater = mockSetSearchParams.mock.calls[0][0];
    const result = updater({ from: 0 });
    expect(result).toEqual({ from: 25 });
  });

  it('disables previous button on first page', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      ...defaultProps,
      pagination: {
        ...defaultProps.pagination,
        prev: null
      },
      searchParams: {
        from: 0,
        size: 25
      }
    }));

    render(<Pagination />);
    
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Page 1 of 4')).toBeInTheDocument();
  });

  it('disables next button on last page', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      ...defaultProps,
      pagination: {
        ...defaultProps.pagination,
        next: null
      },
      searchParams: {
        from: 75,
        size: 25
      }
    }));

    render(<Pagination />);
    
    expect(screen.getByText('Next')).toBeDisabled();
    expect(screen.getByText('Page 4 of 4')).toBeInTheDocument();
  });

  it('handles missing pagination data gracefully', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      pagination: null,
      searchParams: {},
      setSearchParams: mockSetSearchParams
    }));

    render(<Pagination />);
    
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });
});