import { Language } from './Language';
import { Poem } from './Poem';
import { Topic } from './Topic';

export interface User {
    username: string;
    docid: string;
    uid: string;
    preferredLanguages: Language[];
    poems: Poem[];
    following: SubUser[];
    followers: SubUser[];
    email: string;
    topics: Topic[];
    bookmarks: Poem[];
    blockedUsers: SubUser[];
}

export interface FirebaseUser {
    username: string;
    preferredLanguages: Language[];
    uid: string;
    following: User[];
    followers: User[];
    poems: Poem[];
    email: string;
    topics: Topic[];
    bookmarks: Poem[];
    blockedUsers: SubUser[];
}

export interface SubUser {
    username: string;
    docid: string;
    uid: string;
}
