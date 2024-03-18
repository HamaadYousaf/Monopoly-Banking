import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { User } from "../models/user";

export const fetchData = async (
    url: string,
    method: string,
    data?: AxiosRequestConfig
) => {
    try {
        const response: AxiosResponse = await axios({
            url: url,
            method: method,
            data: data,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // if (error.response?.status === 401) {
            //     throw new UnauthorizedError(error.message);
            // } else if (error.response?.status === 409) {
            //     throw new ConflictError(error.message);
            // }
            throw new Error(error.message);
        }
        throw new Error("Request failed");
    }
};

export async function getLoggedInUser(): Promise<User> {
    const res = await fetchData("http://localhost:5000/api/users", "GET");
    return res;
}
