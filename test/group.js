import React from 'react';
import { render } from '@testing-library/react-native';
import GroupsListScreen from '../screens/GroupsListScreen';
import { getGroups, joinGroup, leaveGroup } from '../api/groups';

jest.mock('../api/groups', () => ({
  getGroups: jest.fn(),
  joinGroup: jest.fn(),
  leaveGroup: jest.fn(),
}));

describe('GroupsListScreen', () => {
  test('affiche la liste des groupes correctement', () => {
    const groups = [
      { id: 1, name: 'Groupe 1', image: 'group1.jpg' },
      { id: 2, name: 'Groupe 2', image: 'group2.jpg' },
    ]; // Groupes fictifs
    getGroups.mockReturnValueOnce(groups);

    const { getByText } = render(<GroupsListScreen />);
    const group1 = getByText('Groupe 1');
    const group2 = getByText('Groupe 2');

    expect(group1).toBeTruthy(); // Vérifier que le groupe 1 est affiché dans la liste des groupes
    expect(group2).toBeTruthy(); // Vérifier que le groupe 2 est affiché dans la liste des groupes
  });

  test('permet de rejoindre un groupe existant', () => {
    const groupId = 1; // ID fictif du groupe
    joinGroup.mockReturnValueOnce(true);

    const { getByText } = render(<GroupsListScreen />);
    const joinButton = getByText('Rejoindre');
    joinButton.onclick();

    expect(joinGroup).toHaveBeenCalledWith(groupId); // Vérifier que la fonction joinGroup a été appelée avec l'ID du groupe
  });

  test('permet de quitter un groupe existant', () => {
    const groupId = 1; // ID fictif du groupe
    leaveGroup.mockReturnValueOnce(true);

    const { getByText } = render(<GroupsListScreen />);
    const leaveButton = getByText('Quitter');
    leaveButton.onclick();

    expect(leaveGroup).toHaveBeenCalledWith(groupId); // Vérifier que la fonction leaveGroup a été appelée avec l'ID du groupe
  });
});
