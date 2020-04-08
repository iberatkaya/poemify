import { Language } from './Language';
import { Poem } from './Poem';
import { Topic } from './Topic';

export interface User {
    username: string;
    id: string;
    preferredLanguages: Language[];
    poems: Poem[];
    following: SubUser[];
    followers: SubUser[];
    email: string;
    topics: Topic[];
    bookmarks: Poem[];
}

export interface FirebaseUser {
    username: string;
    preferredLanguages: Language[];
    following: User[];
    followers: User[];
    poems: Poem[];
    email: string;
    topics: Topic[];
    bookmarks: Poem[];
}

export interface SubUser {
    username: string;
    id: string;
}
