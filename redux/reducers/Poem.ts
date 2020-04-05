import { Poem } from '../../interfaces/Poem';
import { setPoemAction, updatePoemAction, addPoemAction } from '../actions/Poem';
import { SubUser } from '../../interfaces/User';

let user: SubUser = { username: 'Dummy41' };
const poems: Poem[] = [
    { poemId: 0, author: user, body: 'Dear a\nhow are you', title: 'Test Poem', date: new Date(), likes: [user], language: 'English' },
    { poemId: 1, author: user, body: "Dear b\nI'm fine, you?", title: 'Test Poem 2', date: new Date(), likes: [], language: 'English' },
    {
        author: { username: 'Dummy41' },
        title: 'My Poem',
        language: 'English',
        body: 'Hey buddy\nWhats up\nIm good too',
        date: new Date(),
        likes: [],
        poemId: 2,
    },
];

const POEM_INITIAL_STATE: Poem[] = [...poems];

export const poemReducer = (state = POEM_INITIAL_STATE, action: setPoemAction | updatePoemAction | addPoemAction) => {
    switch (action.type) {
        case 'SET_POEM':
            let setData = action.payload;
            return setData;
        case 'UPDATE_POEM':
            let payload = action.payload;
            let poems = [...state];
            let index = poems.findIndex((i) => {
                return i.poemId === payload.poemId;
            });
            poems[index] = payload;
            return poems;
        case 'ADD_POEM':
            let mypoems = [...state];
            mypoems.push(action.payload);
            return mypoems;
        default:
            return state;
    }
};
