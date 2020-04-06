import { Poem } from '../../interfaces/Poem';

export interface updatePoemAction {
    type: 'UPDATE_POEM';
    payload: Poem;
}

export const updatePoem = (updatedPoem: Poem) => ({
    type: 'UPDATE_POEM',
    payload: updatedPoem
});

export interface setPoemAction {
    type: 'SET_POEM';
    payload: Poem[];
}

export const setPoem = (key: Poem[]) => ({
    type: 'SET_POEM',
    payload: key
});

export interface addPoemAction {
    type: 'ADD_POEM';
    payload: Poem;
}

export const addPoem = (key: Poem) => ({
    type: 'ADD_POEM',
    payload: key
});

export interface deletePoemAction {
    type: 'DELETE_POEM';
    payload: Poem;
}

export const deletePoem = (key: Poem) => ({
    type: 'DELETE_POEM',
    payload: key
});

