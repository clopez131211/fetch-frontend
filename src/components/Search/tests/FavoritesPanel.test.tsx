import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FavoritesPanel from '../FavoritesPanel';
import { useDogs } from '../../../contexts/DogsContext';
import { fetchDogsByIds } from '../../../services/api';

// Mock the dependencies
jest.mock('../../../contexts/DogsContext', () => ({
  useDogs: jest.fn()
}));

jest.mock('../../../services/api', () => ({
  fetchDogsByIds: jest.fn()
}));

describe('FavoritesPanel', () => {
  const mockFavorites = [
    { id: '1', name: 'Max' },
    { id: '2', name: 'Bella' }
  ];

  const mockDogs = [
    { id: '1', name: 'Max', breed: 'Labrador', age: 3, zip_code: '12345', img: 'max.jpg' },
    { id: '2', name: 'Bella', breed: 'Poodle', age: 2, zip_code: '67890', img: 'bella.jpg' }
  ];

  const mockRemoveFromFavorites = jest.fn();
  const mockGenerateMatchFromFavorites = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDogs as jest.Mock).mockImplementation(() => ({
      favorites: mockFavorites,
      removeFromFavorites: mockRemoveFromFavorites,
      generateMatchFromFavorites: mockGenerateMatchFromFavorites
    }));
    (fetchDogsByIds as jest.Mock).mockResolvedValue(mockDogs);
  });

  it('renders favorites count correctly', async () => {
    render(<FavoritesPanel />);
    expect(screen.getByText('Favorites (2)')).toBeInTheDocument();
  });

  it('loads and displays favorite dogs', async () => {
    render(<FavoritesPanel />);
    
    await waitFor(() => {
      expect(screen.getByText('Max')).toBeInTheDocument();
      expect(screen.getByText('Bella')).toBeInTheDocument();
    });
    
    expect(fetchDogsByIds).toHaveBeenCalledWith(['1', '2']);
  });

  it('handles removing a favorite dog', async () => {
    render(<FavoritesPanel />);
    
    await waitFor(() => {
      const removeButtons = screen.getAllByText('×');
      fireEvent.click(removeButtons[0]);
    });

    expect(mockRemoveFromFavorites).toHaveBeenCalledWith('1');
  });

  it('handles generate match button click', async () => {
    render(<FavoritesPanel />);
    
    const generateButton = screen.getByText('Generate Match!');
    fireEvent.click(generateButton);
    
    expect(mockGenerateMatchFromFavorites).toHaveBeenCalled();
  });

  it('disables generate match button when no favorites', () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      favorites: [],
      removeFromFavorites: mockRemoveFromFavorites,
      generateMatchFromFavorites: mockGenerateMatchFromFavorites
    }));

    render(<FavoritesPanel />);
    
    const generateButton = screen.getByText('Generate Match!');
    expect(generateButton).toBeDisabled();
  });

  it('handles error when loading favorites fails', async () => {
    const errorMessage = 'Failed to load favorites.';
    (fetchDogsByIds as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(<FavoritesPanel />);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears favorites when favorites array is empty', async () => {
    (useDogs as jest.Mock).mockImplementation(() => ({
      favorites: [],
      removeFromFavorites: mockRemoveFromFavorites,
      generateMatchFromFavorites: mockGenerateMatchFromFavorites
    }));

    render(<FavoritesPanel />);
    
    await waitFor(() => {
      expect(screen.queryByText('Max')).not.toBeInTheDocument();
      expect(screen.queryByText('Bella')).not.toBeInTheDocument();
    });
  });
});