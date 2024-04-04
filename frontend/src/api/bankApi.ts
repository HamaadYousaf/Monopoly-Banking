import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../models/user";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
} from "../utils/http_errors";

const fetchData = async (
    url: string,
    method: string,
    user: User | null,
    data?: AxiosRequestConfig
) => {
    try {
        const response: AxiosResponse = await axios({
            url: url,
            method: method,
            data: data,
            headers: {
                Authorization: "Bearer " + user?.token,
            },
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new UnauthorizedError(
                    JSON.stringify(error.response.data.error)
                );
            } else if (error.response?.status === 409) {
                throw new ConflictError(
                    JSON.stringify(error.response.data.error)
                );
            } else if (error.response?.status === 400) {
                throw new BadRequestError(
                    JSON.stringify(error.response.data.error)
                );
            }
            throw new Error(error.message);
        }
        throw new Error("Request failed");
    }
};

interface DepositBody {
    loggedInUser: User;
    username: string;
    roomId: string;
    amount: number;
}

export const deposit = async (body: DepositBody): Promise<string> => {
    const res = await fetchData(
        `http://localhost:5000/api/bank/deposit`,
        "POST",
        body.loggedInUser,
        { data: body }
    );

    return res;
};

interface TransferBody {
    loggedInUser: User;
    usernameReceive: string;
    roomId: string;
    amount: number;
}

export const transfer = async (body: TransferBody): Promise<string> => {
    const res = await fetchData(
        `http://localhost:5000/api/bank/transfer`,
        "POST",
        body.loggedInUser,
        { data: body }
    );

    return res;
};

interface sendFreeParkingBody {
    loggedInUser: User;
    roomId: string;
    amount: number;
}

export const sendFreeParking = async (
    body: sendFreeParkingBody
): Promise<string> => {
    const res = await fetchData(
        `http://localhost:5000/api/bank/sendParking`,
        "POST",
        body.loggedInUser,
        { data: body }
    );

    return res;
};
