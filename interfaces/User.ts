import { Language } from "./Language";

export interface User {
    username: string,
    preferredLanguages: Language[]
}