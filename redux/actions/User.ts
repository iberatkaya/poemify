import { User } from '../../interfaces/User';

export interface setUserAction {
    type: 'SET_USER',
    payload: User
}

export const setUser = (key: User) => ({
    type: 'SET_USER',
    payload: key,
});

