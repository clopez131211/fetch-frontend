import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocationFilter from '../LocationFilter';
import { useDogs } from '../../../contexts/DogsContext';

jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

describe('LocationFilter', () => {
  const mockSetSearchParams = jest.fn();
  const mockDogs = [
    { id: '1', zip_code: '12345', name: 'Max', breed: 'Labrador', age: 3, img: 'max.jpg' },
    { id: '2', zip_code: '12345', name: 'Bella', breed: 'Poodle', age: 2, img: 'bella.jpg' },
    { id: '3', zip_code: '67890', name: 'Charlie', breed: 'Beagle', age: 4, img: 'charlie.jpg' }
  ];

  const defaultSearchParams = {
    locationFilter: {
      city: '',
      states: [],
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockImplementation(() => ({
      searchParams: defaultSearchParams,
      setSearchParams: mockSetSearchParams,
      dogs: mockDogs
    }));
  });

  it('renders the location filter input', () => {
    render(<LocationFilter />);
    expect(screen.getByLabelText('City:')).toBeInTheDocument();
  });

  it('displays unique zip codes from dogs', () => {
    render(<LocationFilter />);
    expect(screen.getByText('12345')).toBeInTheDocument();
    expect(screen.getByText('67890')).toBeInTheDocument();
    expect(screen.getAllByText('12345')).toHaveLength(1);
  });

  it('updates search params when city input changes', () => {
    render(<LocationFilter />);
    const cityInput = screen.getByLabelText('City:');
    
    fireEvent.change(cityInput, { target: { value: 'New York' } });
    
    const updater = mockSetSearchParams.mock.calls[0][0];
    
    const prevState = {
      locationFilter: { city: '', states: [] }
    };
    
    const newState = updater(prevState);
    
    // Verify the new state
    expect(newState).toEqual({
      locationFilter: {
        city: 'New York',
        states: []
      }
    });
  });

  it('maintains existing search params when updating city', () => {
    const existingParams = {
      locationFilter: {
        city: 'Old City',
        states: ['NY']
      }
    };

    (useDogs as jest.Mock).mockImplementation(() => ({
      searchParams: existingParams,
      setSearchParams: mockSetSearchParams,
      dogs: mockDogs
    }));

    render(<LocationFilter />);
    const cityInput = screen.getByLabelText('City:');
    
    fireEvent.change(cityInput, { target: { value: 'New York' } });
    
    const updater = mockSetSearchParams.mock.calls[0][0];
    
    const newState = updater(existingParams);
    
    expect(newState).toEqual({
      locationFilter: {
        city: 'New York',
        states: ['NY']
      }
    });
  });

  it('handles empty dogs array', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      searchParams: defaultSearchParams,
      setSearchParams: mockSetSearchParams,
      dogs: []
    }));

    render(<LocationFilter />);
    expect(screen.getByLabelText('City:')).toBeInTheDocument();
    expect(screen.queryByText('12345')).not.toBeInTheDocument();
  });
});