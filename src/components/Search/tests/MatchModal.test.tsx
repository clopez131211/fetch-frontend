import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchModal from '../MatchModal';
import { useDogs } from '../../../contexts/DogsContext';

jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

describe('MatchModal', () => {
  const mockSetMatch = jest.fn();
  const mockMatch = {
    id: '123',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    zip_code: '12345',
    img: 'buddy.jpg'
  };

  const mockLocationsMap = {
    '12345': {
      city: 'New York',
      state: 'NY',
      county: 'Manhattan'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when there is no match', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      match: null,
      setMatch: mockSetMatch,
      locationsMap: mockLocationsMap
    }));

    const { container } = render(<MatchModal />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders match information when there is a match', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      match: mockMatch,
      setMatch: mockSetMatch,
      locationsMap: mockLocationsMap
    }));

    render(<MatchModal />);

    expect(screen.getByText('Your Perfect Match!')).toBeInTheDocument();
    expect(screen.getByText(mockMatch.name)).toBeInTheDocument();
    expect(screen.getByText(`Breed: ${mockMatch.breed}`)).toBeInTheDocument();
    expect(screen.getByText(`Age: ${mockMatch.age}`)).toBeInTheDocument();
    expect(screen.getByAltText(mockMatch.name)).toHaveAttribute('src', mockMatch.img);
  });

  it('renders location information correctly', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      match: mockMatch,
      setMatch: mockSetMatch,
      locationsMap: mockLocationsMap
    }));

    render(<MatchModal />);

    expect(screen.getByText('City: New York')).toBeInTheDocument();
    expect(screen.getByText('State: NY')).toBeInTheDocument();
    expect(screen.getByText('County: Manhattan')).toBeInTheDocument();
  });

  it('shows N/A for missing location information', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      match: mockMatch,
      setMatch: mockSetMatch,
      locationsMap: {}
    }));

    render(<MatchModal />);

    expect(screen.getByText('City: N/A')).toBeInTheDocument();
    expect(screen.getByText('State: N/A')).toBeInTheDocument();
    expect(screen.getByText('County: N/A')).toBeInTheDocument();
  });

  it('calls setMatch with null when close button is clicked', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      match: mockMatch,
      setMatch: mockSetMatch,
      locationsMap: mockLocationsMap
    }));

    render(<MatchModal />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockSetMatch).toHaveBeenCalledWith(null);
  });
});