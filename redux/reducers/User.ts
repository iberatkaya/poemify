import { User } from '../../interfaces/User';
import { setUserAction, updateUserPoemAction, addUserPoemAction, deleteUserPoemAction } from '../actions/User';

const USER_INITIAL_STATE: User = {
    email: '',
    id: '',
    topics: [],
    username: '',
    preferredLanguages: [],
    poems: [],
    following: [],
    followers: [],
};

export const userReducer = (
    state = USER_INITIAL_STATE,
    action: setUserAction | updateUserPoemAction | addUserPoemAction | deleteUserPoemAction
) => {
    switch (action.type) {
        case 'SET_USER':
            let user = action.payload;
            return user;
        case 'UPDATE_USER_POEM':
            let payload = action.payload;
            let myuser = { ...state };
            let poems = [...myuser.poems];
            let index = poems.findIndex((i) => i.poemId === payload.poemId && i.author.username === action.payload.author.username);
            if (index === -1) throw 'An error occurred';
            poems[index] = payload;
            myuser.poems = poems;
            return myuser;
        case 'ADD_USER_POEM':
            let usr = { ...state };
            usr.poems.push(action.payload);
            return usr;
        case 'DELETE_USER_POEM':
            let myusr = { ...state };
            let myindex = myusr.poems.findIndex(
                (i) => i.poemId === action.payload.poemId && i.author.username === action.payload.author.username
            );
            if (myindex === -1) throw 'USER REDUCER: An error occurred!';
            myusr.poems.splice(myindex, 1);
            return myusr;
        default:
            return state;
    }
};
