import { Language } from './Language';
import { Poem } from './Poem';

export interface User {
    username: string;
    id: string;
    preferredLanguages: Language[];
    poems: Poem[];
    following: User[];
    followers: User[];
    email: string;
}

export interface FirebaseUser {
    username: string;
    preferredLanguages: Language[];
    following: User[];
    followers: User[];
    poems: Poem[];
    email: string;
};

export interface SubUser {
    username: string;
    id: string;
};
