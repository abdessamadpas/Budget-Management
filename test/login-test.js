import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { authenticateUser } from '../api/auth';

jest.mock('../api/auth', () => ({
  authenticateUser: jest.fn(),
}));

describe('LoginScreen', () => {
  test('renders login screen correctly', () => {
    const { getByTestId } = render(<LoginScreen />);
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    expect(usernameInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(loginButton).toBeDefined();
  });

  test('calls authenticateUser with correct credentials on login button press', async () => {
    const { getByTestId } = render(<LoginScreen />);
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    // Simulate user entering credentials
    fireEvent.changeText(usernameInput, 'example@example.com');
    fireEvent.changeText(passwordInput, 'password');

    // Mock the authenticateUser function
    authenticateUser.mockResolvedValueOnce({ success: true });

    // Simulate user pressing the login button
    fireEvent.press(loginButton);

    // Ensure authenticateUser was called with the correct credentials
    expect(authenticateUser).toHaveBeenCalledWith('example@example.com', 'password');
  });

  test('displays error message on authentication failure', async () => {
    const { getByTestId, getByText } = render(<LoginScreen />);
    const usernameInput = getByTestId('username-input');
    const passwordInput = getByTestId('password-input');
    const loginButton = getByTestId('login-button');

    // Simulate user entering incorrect credentials
    fireEvent.changeText(usernameInput, 'example@example.com');
    fireEvent.changeText(passwordInput, 'wrongpassword');

    // Mock the authenticateUser function
    authenticateUser.mockResolvedValueOnce({ success: false, error: 'Incorrect credentials' });

    // Simulate user pressing the login button
    fireEvent.press(loginButton);

    // Ensure error message is displayed
    const errorMessage = getByText('Incorrect credentials');
    expect(errorMessage).toBeDefined();
  });
});
