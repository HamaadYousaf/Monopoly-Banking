import { useState } from "react";
import { User } from "../models/user";
import * as userApi from "../api/userApi";
import Loading from "./Loading";

interface LoginProps {
    onLoginSuccessful: (user: User) => void;
}

const Login = ({ onLoginSuccessful }: LoginProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        async function loginUser() {
            try {
                setLoading(true);
                const user = await userApi.loginUser({ username, password });
                onLoginSuccessful(user);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        loginUser();
    };
    return (
        <>
            {loading ? (
                <>
                    <Loading />
                </>
            ) : (
                <>
                    {" "}
                    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white sm:mt-20 mt-10 rounded-3xl sm:m-auto sm:w-[500px] mx-5">
                        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                            <h2 className="sm:mt-4 mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                Sign in to your account
                            </h2>
                        </div>
                        <div className="mt-10 mb-5 sm:mx-auto sm:w-full sm:max-w-sm">
                            <form
                                className="space-y-6"
                                action="#"
                                method="POST"
                            >
                                <div>
                                    <label
                                        htmlFor="username"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                    >
                                        Username
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            id="username"
                                            name="username"
                                            type="username"
                                            autoComplete="username"
                                            required
                                            onChange={(e) =>
                                                setUsername(e.target.value)
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                            Password
                                        </label>
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            autoComplete="current-password"
                                            required
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        onClick={handleClick}
                                        className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Login;
