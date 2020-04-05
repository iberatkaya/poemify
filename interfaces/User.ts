import { Language } from './Language';
import { Poem } from './Poem';

export interface User {
    username: string;
    preferredLanguages: Language[];
    poems: Poem[];
    following: User[];
    followers: User[];
}

export type SubUser = Pick<User, 'username'>;
