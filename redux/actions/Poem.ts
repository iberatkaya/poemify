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
    type: 'SET_POEM',
    payload: Poem[]
}

export const setPoem = (key: Poem[]) => ({
    type: 'SET_POEM',
    payload: key,
});
