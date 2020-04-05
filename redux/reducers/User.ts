import { User } from '../../interfaces/User';;

const USER_INITIAL_STATE: User = {
    username: 'Dummy41',
    preferredLanguages: ['English']
};

interface UserAction {
    type: string;
    payload: User;
}

export const userReducer = (state = USER_INITIAL_STATE, action: UserAction) => {
    switch (action.type) {
        case 'SET_USER':
            let timer = action.payload;
            return timer;
        default:
            return state;
    }
};