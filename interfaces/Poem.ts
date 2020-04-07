import { SubUser, User } from './User';
import { Language } from './Language';
import { Topic } from './Topic';

export interface Poem {
    author: SubUser;
    title: string;
    poemId: number;
    body: string;
    date: number;
    likes: SubUser[];
    language: Language;
    topics: Topic[];
}
