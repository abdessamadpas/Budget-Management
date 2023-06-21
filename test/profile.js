import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProfileScreen from '../screens/ProfileScreen';
import { updateUserProfile } from '../api/profile';

jest.mock('../api/profile', () => ({
  updateUserProfile: jest.fn(),
}));

describe('ProfileScreen', () => {
  test('permet de mettre à jour les informations de profil de l\'utilisateur', () => {
    const { getByLabelText, getByText } = render(<ProfileScreen />);
    const nameInput = getByLabelText('Nom');
    const emailInput = getByLabelText('Adresse e-mail');
    const updateButton = getByText('Mettre à jour');

    const newName = 'John Doe';
    const newEmail = 'john.doe@example.com';

    fireEvent.changeText(nameInput, newName);
    fireEvent.changeText(emailInput, newEmail);
    fireEvent.press(updateButton);

    expect(updateUserProfile).toHaveBeenCalledWith(newName, newEmail);
    // Vérifier que la fonction updateUserProfile est appelée avec les nouvelles informations de profil
  });
});
