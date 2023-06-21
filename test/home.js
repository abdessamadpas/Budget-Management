import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../screens/HomeScreen';
import { getGroupTotalBalance, getRecentExpenses } from '../api/budget';

jest.mock('../api/budget', () => ({
  getGroupTotalBalance: jest.fn(),
  getRecentExpenses: jest.fn(),
}));

describe('HomeScreen', () => {
  test('affiche le solde total du groupe correctement', () => {
    const totalBalance = 1000; // Solde total fictif
    getGroupTotalBalance.mockReturnValueOnce(totalBalance);

    const { getByTestId } = render(<HomeScreen />);
    const balanceText = getByTestId('total-balance');

    expect(balanceText).toHaveTextContent('1000'); // Vérifier que le solde total est correctement affiché
  });

  test('affiche les dépenses récentes du groupe correctement', () => {
    const recentExpenses = [
      { id: 1, description: 'Restaurant', amount: 50 },
      { id: 2, description: 'Supermarché', amount: 80 },
    ]; // Dépenses récentes fictives
    getRecentExpenses.mockReturnValueOnce(recentExpenses);

    const { getByTestId, getByText } = render(<HomeScreen />);
    const expenseList = getByTestId('recent-expenses');
    const expense1 = getByText('Restaurant');
    const expense2 = getByText('Supermarché');

    expect(expenseList).toContainElement(expense1); // Vérifier que la dépense 1 est affichée dans la liste des dépenses récentes
    expect(expenseList).toContainElement(expense2); // Vérifier que la dépense 2 est affichée dans la liste des dépenses récentes
  });
});
