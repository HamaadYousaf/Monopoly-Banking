import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as userApi from "../api/userApi";
import NavBar from "../components/NavBar";
import { User } from "../models/user";
import { BadRequestError, UnauthorizedError } from "../utils/http_errors";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const loggedInUser = useRef<User | null>(
        JSON.parse(localStorage.getItem("user") || "{}")
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedInUser.current?.username) {
            if (loggedInUser.current?.roomId) {
                navigate("/room");
            } else {
                navigate("/");
            }
        }
    }, [loggedInUser, navigate]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();

        async function loginUser() {
            try {
                const user = await userApi.loginUser({ username, password });
                localStorage.setItem("user", JSON.stringify(user));
                if (user.roomId) {
                    navigate("/room");
                } else {
                    navigate("/");
                }
            } catch (error) {
                if (
                    error instanceof UnauthorizedError ||
                    error instanceof BadRequestError
                ) {
                    setError(error.message.replace(/["']/g, ""));
                } else {
                    alert(error);
                }
                console.error(error);
            }
        }
        loginUser();
    };
    return (
        <>
            <NavBar loggedInUser={loggedInUser.current} state="login" />
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-white sm:mt-20 mt-10 rounded-3xl sm:m-auto sm:w-[500px] mx-5">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="sm:mt-4 mt-0 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <div className="mt-10 mb-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    {error && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative self-center w-full mb-4"
                            role="alert"
                        >
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-md font-medium leading-6 text-gray-900"
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
                                    value={username}
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
                                    className="block text-md font-medium leading-6 text-gray-900"
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
                                    value={password}
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
                                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-md font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
