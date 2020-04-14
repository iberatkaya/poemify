import { User } from '../../interfaces/User';
import {
    setUserAction,
    updateUserPoemAction,
    addUserBookmarkAction,
    addUserPoemAction,
    deleteUserPoemAction,
    incTotalPoemAction,
    decTotalPoemAction,
} from '../actions/User';

const USER_INITIAL_STATE: User = {
    email: '',
    blockedUsers: [],
    docid: '',
    uid: '',
    topics: [],
    bookmarks: [],
    totalPoems: 0,
    username: '',
    preferredLanguages: [],
    poems: [],
    following: [],
    followers: [],
};

export const userReducer = (
    state = USER_INITIAL_STATE,
    action:
        | setUserAction
        | updateUserPoemAction
        | addUserPoemAction
        | deleteUserPoemAction
        | incTotalPoemAction
        | decTotalPoemAction
        | addUserBookmarkAction
) => {
    switch (action.type) {
        case 'SET_USER':
            let user = action.payload;
            return user;
        case 'UPDATE_USER_POEM':
            let payload = action.payload;
            let myuser = { ...state };
            let poems = [...myuser.poems];
            let index = poems.findIndex((i) => i.date === payload.date);
            if (index === -1) return myuser;
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
            if (myindex === -1) return myusr;
            myusr.poems.splice(myindex, 1);
            let myindex2 = myusr.bookmarks.findIndex(
                (i) => i.poemId === action.payload.poemId && i.author.username === action.payload.author.username
            );
            if (myindex2 !== -1) myusr.bookmarks.splice(myindex2, 1);
            return myusr;
        case 'INC_TOTAL_POEM':
            let tmpusr = { ...state };
            tmpusr.totalPoems += 1;
            return tmpusr;
        case 'DEC_TOTAL_POEM':
            let tmpusr2 = { ...state };
            tmpusr2.totalPoems -= 1;
            return tmpusr2;
        case 'ADD_USER_BOOKMARK':
            let tmpusr3 = { ...state };
            tmpusr3.bookmarks.push(action.payload);
            return tmpusr3;
        default:
            return state;
    }
};
