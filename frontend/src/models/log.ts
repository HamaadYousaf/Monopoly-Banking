export interface Log {
    id: string;
    time: string;
    message: string;
    createdAt: string;
    roomId: string;
}
export interface Logs extends Array<Log> {}
