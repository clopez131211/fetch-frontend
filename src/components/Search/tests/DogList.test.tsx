import { render, screen, fireEvent } from '@testing-library/react';
import DogList from '../DogList';
import { useDogs } from '../../../contexts/DogsContext';

jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

describe('DogList', () => {
  const mockDogs = [
    {
      id: '1',
      name: 'Max',
      breed: 'Labrador',
      age: 3,
      zip_code: '12345',
      img: 'dog1.jpg'
    },
    {
      id: '2',
      name: 'Bella',
      breed: 'Poodle',
      age: 2,
      zip_code: '67890',
      img: 'dog2.jpg'
    }
  ];

  const mockLocationsMap = {
    '12345': {
      city: 'New York',
      state: 'NY',
      county: 'Manhattan'
    },
    '67890': {
      city: 'Los Angeles',
      state: 'CA',
      county: 'Los Angeles'
    }
  };

  const mockAddToFavorites = jest.fn();
  const mockRemoveFromFavorites = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockImplementation(() => ({
      favorites: [mockDogs[0]],
      addToFavorites: mockAddToFavorites,
      removeFromFavorites: mockRemoveFromFavorites,
      locationsMap: mockLocationsMap
    }));
  });

  it('renders loading state', () => {
    render(<DogList dogs={[]} loading={true} error={null} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    const errorMessage = 'Failed to fetch dogs';
    render(<DogList dogs={[]} loading={false} error={errorMessage} />);
    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(<DogList dogs={[]} loading={false} error={null} />);
    expect(screen.getByText('No dogs found.')).toBeInTheDocument();
  });

  it('renders dog list with location information', () => {
    render(<DogList dogs={mockDogs} loading={false} error={null} />);

    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Bella')).toBeInTheDocument();

    expect(screen.getByText('City: New York')).toBeInTheDocument();
    expect(screen.getByText('State: NY')).toBeInTheDocument();
    expect(screen.getByText('City: Los Angeles')).toBeInTheDocument();
    expect(screen.getByText('State: CA')).toBeInTheDocument();
  });

  it('handles favorite toggling', () => {
    render(<DogList dogs={mockDogs} loading={false} error={null} />);

    const removeButton = screen.getByText('Remove from Favorites');
    fireEvent.click(removeButton);
    expect(mockRemoveFromFavorites).toHaveBeenCalledWith('1');

    const addButton = screen.getByText('Add to Favorites');
    fireEvent.click(addButton);
    expect(mockAddToFavorites).toHaveBeenCalledWith(mockDogs[1]);
  });

  it('displays loading state for missing location', () => {
    const dogsWithMissingLocation = [{
      ...mockDogs[0],
      zip_code: '99999'
    }];

    render(<DogList dogs={dogsWithMissingLocation} loading={false} error={null} />);
    expect(screen.getByText('Loading location...')).toBeInTheDocument();
  });
});