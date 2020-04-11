import { SubUser } from './User';
import { Language } from './Language';
import { Topic } from './Topic';
import { Comment } from './Comment';

//Language is set as an array for Firestore indexing
//An array is required since Firestore indexing does not support
//the in operation, but the array-contains-any operation.
export interface Poem {
    author: SubUser;
    username: string;
    title: string;
    poemId: number;
    body: string;
    date: number;
    likes: SubUser[];
    language: Language[];
    topics: Topic[];
    comments: Comment[];
}
