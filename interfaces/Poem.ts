import { SubUser } from './User';
import { Language } from './Language';

export interface Poem {
    author: SubUser;
    title: string;
    poemId: number;
    body: string;
    date: Date;
    likes: SubUser[];
    language: Language;
}
