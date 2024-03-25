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
                    />
                    <div className="flex justify-center mt-14 font-bold text-4xl text-font">
                        <div className="text-center">
                            <p className="pb-0 text-[1.5rem]">
                                Room ID: {room?.id}
                            </p>
                            <p className=" text-[1.5rem]">
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
