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
    payload: poem,
});

export interface deleteUserPoemAction {
    type: 'DELETE_USER_POEM';
    payload: Poem;
}

export const deleteUserPoem = (poem: Poem) => ({
    type: 'DELETE_USER_POEM',
    payload: poem,
});

export interface addUserBookmarkAction {
    type: 'ADD_USER_BOOKMARK';
    payload: Poem;
}

export const addUserBookmark = (poem: Poem) => ({
    type: 'ADD_USER_BOOKMARK',
    payload: poem,
});

export interface incTotalPoemAction {
    type: 'INC_TOTAL_POEM';
}

export const incTotalPoem = () => ({
    type: 'INC_TOTAL_POEM',
});

export interface decTotalPoemAction {
    type: 'DEC_TOTAL_POEM';
}

export const decTotalPoem = () => ({
    type: 'DEC_TOTAL_POEM',
});
