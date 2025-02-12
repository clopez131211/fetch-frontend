import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import LoginPage from '../LoginPage';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../contexts/UserContext', () => ({
  useUser: jest.fn()
}));

describe('LoginPage', () => {
  const mockNavigate = jest.fn();
  const mockLogin = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useUser as jest.Mock).mockImplementation(() => ({
      login: mockLogin
    }));
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should handle successful login submission', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    render(<LoginPage />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { name: 'name', value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'john@example.com' }
    });

    // Submit form
    const form = screen.getByTestId('login-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('John Doe', 'john@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  it('should handle failed login submission', async () => {
    const mockError = new Error('Login failed');
    mockLogin.mockRejectedValueOnce(mockError);
    render(<LoginPage />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Name'), {
      target: { name: 'name', value: 'John Doe' }
    });
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { name: 'email', value: 'john@example.com' }
    });

    // Submit form
    const form = screen.getByTestId('login-form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('John Doe', 'john@example.com');
      expect(console.error).toHaveBeenCalledWith(mockError);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});