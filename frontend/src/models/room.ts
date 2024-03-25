import { User } from "./user";

export interface Room {
    FreeParking: Array<FreeParking>;
    banker: string;
    id: string;
    users: Array<User>;
}

interface FreeParking {
    balance: number;
}
