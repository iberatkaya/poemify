import { Poem } from '../../interfaces/Poem';;
import {setPoemAction, updatePoemAction} from '../actions/Poem';
import { User } from '../../interfaces/User';

let user: User = { username: 'Dummy41', preferredLanguages: ['English'] };
const poems: Poem[] =([{ poemId: 0, author: user, body: 'Dear a\nhow are you', title: 'Test Poem', date: new Date(), likes: [user], language: 'English' }]);

const POEM_INITIAL_STATE: Poem[] = [poems[0]];


export const poemReducer = (state = POEM_INITIAL_STATE, action: setPoemAction | updatePoemAction) => {
    switch (action.type) {
        case 'SET_POEM':
            let setData = action.payload;
            return setData;
        case 'UPDATE_POEM':
            let payload = action.payload;
            let poems = [...state];
            let index = poems.findIndex((i) => { return i.poemId === payload.poemId; });
            poems[index] = payload;            
            return poems;
        default:
            return state;
    }
};