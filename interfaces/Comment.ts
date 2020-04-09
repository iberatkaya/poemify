import { SubUser } from './User';

export interface Comment {
    commentor: SubUser;
    message: string;
    date: number;
}
