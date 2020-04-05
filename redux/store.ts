import { createStore, combineReducers } from 'redux';
import { userReducer } from './reducers/User';
import { poemReducer } from './reducers/Poem';
import { Poem } from '../interfaces/Poem';
import { User } from '../interfaces/User';

export const store = createStore(
    combineReducers({
        user: userReducer,
        poems: poemReducer
    }),
);

export interface RootState {
    user: User,
    poems: Poem[]
}