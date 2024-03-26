export interface User {
    email: string;
    id: string;
    roomId: string;
    token?: string;
    username: string;
    Bank?: Array<Bank>;
}

export interface Bank {
    id: string;
    roomId: string;
    userId: string;
    balance: number;
}
