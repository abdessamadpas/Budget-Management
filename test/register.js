import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import RegisterScreen from '../screens/RegisterScreen';
import { createUser } from '../api/auth';

jest.mock('../api/auth', () => ({
  createUser: jest.fn(),
}));

describe('RegisterScreen', () => {
  test('affiche l\'écran d\'inscription correctement', () => {
    const { getByTestId } = render(<RegisterScreen />);
    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByTestId('register-button');

    expect(nameInput).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(registerButton).toBeDefined();
  });

  test('appelle createUser avec les informations d\'inscription correctes lors de l\'appui sur le bouton d\'inscription', async () => {
    const { getByTestId } = render(<RegisterScreen />);
    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByTestId('register-button');

    // Simuler la saisie des informations d'inscription par l'utilisateur
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    fireEvent.changeText(passwordInput, 'password');

    // Simuler le résultat de la fonction createUser
    createUser.mockResolvedValueOnce({ success: true });

    // Simuler l'appui sur le bouton d'inscription
    fireEvent.press(registerButton);

    // Vérifier que createUser a été appelée avec les informations d'inscription correctes
    expect(createUser).toHaveBeenCalledWith('John Doe', 'john.doe@example.com', 'password');
  });

  test('affiche un message d\'erreur en cas d\'échec de la création du compte', async () => {
    const { getByTestId, getByText } = render(<RegisterScreen />);
    const nameInput = getByTestId('name-input');
    const emailInput = getByTestId('email-input');
    const passwordInput = getByTestId('password-input');
    const registerButton = getByTestId('register-button');

    // Simuler la saisie des informations d'inscription par l'utilisateur
    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john.doe@example.com');
    fireEvent.changeText(passwordInput, 'password');

    // Simuler le résultat de la fonction createUser
    createUser.mockResolvedValueOnce({ success: false, error: 'Une erreur s\'est produite' });

    // Simuler l'appui sur le bouton d'inscription
    fireEvent.press(registerButton);

    // Vérifier que le message d'erreur est affiché
    const errorMessage = getByText('Une erreur s\'est produite');
    expect(errorMessage).toBeDefined();
  });
});
