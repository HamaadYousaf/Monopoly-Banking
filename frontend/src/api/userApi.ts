import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../models/user";
import { ConflictError, UnauthorizedError } from "../utils/http_errors";

export const fetchData = async (
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
            }
            throw new Error(error.message);
        }
        throw new Error("Request failed");
    }
};

export async function getLoggedInUser(
    loggedInUser: User | null
): Promise<User> {
    const res = await fetchData(
        "http://localhost:5000/api/user",
        "GET",
        loggedInUser
    );
    return res;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<User> {
    const res = await fetchData(
        "http://localhost:5000/api/user/login",
        "POST",
        null,
        {
            data: credentials,
        }
    );
    return res;
}

export async function logoutUser(): Promise<boolean> {
    const res = await fetchData(
        "http://localhost:5000/api/user/logout",
        "POST",
        null
    );

    return res;
}
