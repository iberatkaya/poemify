import { User } from '../../interfaces/User';
import { Poem } from '../../interfaces/Poem';

export interface setUserAction {
    type: 'SET_USER';
    payload: User;
}

export const setUser = (key: User) => ({
    type: 'SET_USER',
    payload: key,
});

export interface updateUserPoemAction {
    type: 'UPDATE_USER_POEM';
    payload: Poem;
}

export const updateUserPoem = (updatedPoem: Poem) => ({
    type: 'UPDATE_USER_POEM',
    payload: updatedPoem,
});

export interface addUserPoemAction {
    type: 'ADD_USER_POEM';
    payload: Poem;
}

export const addUserPoem = (poem: Poem) => ({
    type: 'ADD_USER_POEM',
    payload: poem
});


export interface deleteUserPoemAction {
    type: 'DELETE_USER_POEM';
    payload: Poem;
}

export const deleteUserPoem = (poem: Poem) => ({
    type: 'DELETE_USER_POEM',
    payload: poem
});
