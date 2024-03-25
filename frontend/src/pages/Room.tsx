import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as roomApi from "../api/roomApi";
import * as userApi from "../api/userApi";
import Bank from "../components/Bank";
import GameHome from "../components/GameHome";
import History from "../components/History";
import Loading from "../components/Loading";
import NavBarActive from "../components/NavBarActive";
import { Room } from "../models/room";
import { User } from "../models/user";

const RoomView = () => {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("home");
    const [room, setRoom] = useState<Room | null>(null);
    const [banker, setBanker] = useState(false);

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

                if (!user.roomId) {
                    navigate("/");
                }

                const fetchRoom = await roomApi.getRoom(loggedInUser.current);
                setRoom(fetchRoom);

                if (fetchRoom.banker === loggedInUser.current.username) {
                    setBanker(true);
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
                    <NavBarActive
                        loggedInUser={loggedInUser.current}
                        setView={setView}
                        banker={banker}
                    />
                    <div className="flex justify-center md:mt-14 mt-8 font-bold md:text-4xl text-2xl text-font">
                        <div className="text-center">
                            <p className="md:text-[1.5rem] text-[1.4rem]">
                                Room ID: {room?.id}
                            </p>
                            <p className="md:text-[1.5rem] text-[1.4rem]">
                                Banker: {room?.banker}
                            </p>
                            {view === "home" && <GameHome />}
                            {view === "bank" && <Bank />}
                            {view === "history" && <History />}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default RoomView;
