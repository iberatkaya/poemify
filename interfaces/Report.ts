import { Poem } from "./Poem";
import { SubUser } from "./User";

export interface Report {
    poem: Poem;
    poemId: number;
    date: number;
    author: string;
    amount: number;
    reportedBy: SubUser[];
}