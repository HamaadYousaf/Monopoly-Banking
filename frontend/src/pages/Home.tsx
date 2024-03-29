import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as roomApi from "../api/roomApi";
import * as userApi from "../api/userApi";
import Loading from "../components/Loading";
import NavBar from "../components/NavBar";
import { User } from "../models/user";
import { BadRequestError, ConflictError } from "../utils/http_errors";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

    const handleJoin = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            const user = await roomApi.joinRoom(loggedInUser.current, roomId);
            localStorage.setItem("user", JSON.stringify(user));
            if (user.roomId) {
                navigate("/room");
            }
            setLoading(false);
        } catch (error) {
            if (
                error instanceof ConflictError ||
                error instanceof BadRequestError
            ) {
                setError(error.message.replace(/["']/g, ""));
            } else {
                alert(error);
            }
            setRoomId("");
            setLoading(false);
            console.error(error);
        }
    };

    const handleCreate = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        try {
            setLoading(true);
            const user = await roomApi.createRoom(loggedInUser.current);
            localStorage.setItem("user", JSON.stringify(user));
            if (user.roomId) {
                navigate("/room");
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };

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
                            {error && (
                                <p className="text-base text-red-500 text-left ">
                                    *{error}
                                </p>
                            )}
                            <input
                                type="text"
                                placeholder="Room ID"
                                className="input w-full max-w-xs bg-white mb-4 border-solid border-2 border-[#333333] focus:outline-none"
                                onChange={(e) => setRoomId(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="flex justify-center rounded-md pb-1 bg-blue-500 text-[1.5rem] px-5 font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-2"
                                onClick={handleJoin}
                            >
                                Join
                            </button>
                            <p className="mb-2 text-[1.5rem]">OR</p>
                            <button
                                type="submit"
                                className="flex justify-center pb-1 rounded-md bg-blue-500 text-[1.5rem] px-5 text-center font-semibold  text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mx-auto mb-4"
                                onClick={handleCreate}
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
