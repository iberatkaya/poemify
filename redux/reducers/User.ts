import { User } from '../../interfaces/User';
import { setUserAction, updateUserPoemAction, addUserPoemAction } from '../actions/User';

const USER_INITIAL_STATE: User = {
    username: 'Dummy41',
    preferredLanguages: ['English'],
    poems: [
        {
            author: { username: 'Dummy41' },
            title: 'My Poem',
            language: 'English',
            body: 'Hey buddy\nWhats up\nIm good too',
            date: new Date(),
            likes: [],
            poemId: 2,
        },
    ],
    following: [],
    followers: [],
};

export const userReducer = (state = USER_INITIAL_STATE, action: setUserAction | updateUserPoemAction | addUserPoemAction) => {
    switch (action.type) {
        case 'SET_USER':
            let user = action.payload;
            return user;
        case 'UPDATE_USER_POEM':
            let payload = action.payload;
            let myuser = { ...state };
            let poems = [...myuser.poems];
            let index = poems.findIndex((i) => {
                return i.poemId === payload.poemId;
            });
            poems[index] = payload;
            myuser.poems = poems;
            return myuser;
        case 'ADD_USER_POEM': 
            let usr = {...state};
            usr.poems.push(action.payload);
            return usr;
        default:
            return state;
    }
};
