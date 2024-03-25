import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../models/user";
import {
    BadRequestError,
    ConflictError,
    UnauthorizedError,
} from "../utils/http_errors";
import { Room } from "../models/room";

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

export async function getRoom(loggedInUser: User | null): Promise<Room> {
    const res = await fetchData(
        `http://localhost:5000/api/room/${loggedInUser?.roomId}`,
        "GET",
        loggedInUser
    );

    return res.room;
}
