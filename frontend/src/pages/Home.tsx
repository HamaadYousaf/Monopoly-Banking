import { useEffect, useRef, useState } from "react";
import { User } from "../models/user";
import { useNavigate } from "react-router-dom";
import * as userApi from "../api/userApi";
import NavBar from "../components/NavBar";
import Loading from "../components/Loading";

const Home = () => {
    const [loading, setLoading] = useState(true);
    const loggedInUser = useRef<User | null>(
        JSON.parse(localStorage.getItem("user") || "{}")
    );
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                setLoading(true);
                const user = await userApi.getLoggedInUser(
                    loggedInUser.current
                );
                loggedInUser.current = user;
                if (user.roomId) {
                    navigate("/room");
                }
                setLoading(false);
            } catch (error) {
                navigate("/login");
                setLoading(false);
                console.error(error);
            }
        }
        fetchLoggedInUser();
    }, [navigate]);

    return (
        <>
            {loading ? (
                <>
                    <Loading />
                </>
            ) : (
                <>
                    <NavBar loggedInUser={loggedInUser.current} state="home" />
                    <div className="flex justify-center mt-20 font-bold text-4xl text-font">
                        <div className="text-center">
                            <p className="pb-4">Join Room</p>
                            <input
                                type="text"
                                placeholder="Room ID"
                                className="input w-full max-w-xs bg-white mb-4 border-solid border-2 border-[#333333] focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="flex justify-center rounded-md pb-1 bg-blue-500 text-[1.5rem] px-5 font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-2"
                            >
                                Join
                            </button>
                            <p className="mb-2 text-[1.5rem]">OR</p>
                            <button
                                type="submit"
                                className="flex justify-center pb-1 rounded-md bg-blue-500 text-[1.5rem] px-5 text-center font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-4"
                            >
                                Create Room
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;
