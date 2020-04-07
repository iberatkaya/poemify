import { Poem } from '../../interfaces/Poem';
import { setPoemAction, updatePoemAction, addPoemAction, deletePoemAction } from '../actions/Poem';
import { SubUser } from '../../interfaces/User';

const poems: Poem[] = [
];

const POEM_INITIAL_STATE: Poem[] = [...poems];

export const poemReducer = (state = POEM_INITIAL_STATE, action: setPoemAction | updatePoemAction | addPoemAction | deletePoemAction) => {
    switch (action.type) {
        case 'SET_POEM':
            let setData = action.payload;
            return setData;
        case 'UPDATE_POEM':
            let payload = action.payload;
            let poems = [...state];
            let index = poems.findIndex((i) => i.poemId === payload.poemId && i.author.username === action.payload.author.username);
            if (index === -1)
                throw "An error occurred";
            poems[index] = payload;
            return poems;
        case 'ADD_POEM':
            let mypoems = [...state];
            mypoems.push(action.payload);
            return mypoems;
        case 'DELETE_POEM':
            let all = [...state];
            let myindex = all.findIndex((i) => i.poemId === action.payload.poemId && i.author.username === action.payload.author.username)
            if (myindex === -1)
                throw "POEMS REDUCER: An error occurred!";
            all.splice(myindex, 1);
            return all;
        default:
            return state;
    }
};
