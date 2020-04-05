import { User } from './User';
import { Language } from './Language';

export interface Poem {
    author: User,
    title: string,
    poemId: number,
    body: string,
    date: Date,
    likes: User[],
    language: Language
}