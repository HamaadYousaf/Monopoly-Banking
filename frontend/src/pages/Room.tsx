import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as roomApi from "../api/roomApi";
import * as userApi from "../api/userApi";
import Bank from "../components/Bank";
import GameHome from "../components/GameHome";
import History from "../components/History";
import Loading from "../components/Loading";
import NavBarActive from "../components/NavBarActive";
import { Logs } from "../models/log";
import { Room } from "../models/room";
import { User } from "../models/user";

const RoomView = () => {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("home");
    const [room, setRoom] = useState<Room | null>(null);
    const [logs, setLogs] = useState<Logs | null>(null);
    const [banker, setBanker] = useState(false);

    const loggedInUser = useRef<User | null>(
        JSON.parse(localStorage.getItem("user") || "{}")
    );
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
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
                if (!fetchRoom) {
                    navigate("/");
                }
                setRoom(fetchRoom);

                if (fetchRoom.banker === loggedInUser.current.username) {
                    setBanker(true);
                }

                const fetchLogs = await roomApi.getLogs(loggedInUser.current);
                setLogs(fetchLogs);

                setLoading(false);
            } catch (error) {
                navigate("/login");
                setLoading(false);
                console.error(error);
            }
        }
        fetchData();
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
                    <div className="flex justify-center md:mt-14 mt-8 font-bold md:text-4xl text-2xl text-font ">
                        <div className="text-center">
                            {view === "home" && (
                                <GameHome
                                    room={room}
                                    loggedInUser={loggedInUser.current}
                                />
                            )}
                            {view === "bank" && <Bank />}
                            {view === "history" && <History logs={logs} />}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};
export default RoomView;
