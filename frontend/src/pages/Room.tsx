import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as userApi from "../api/userApi";
import Loading from "../components/Loading";
import NavBarActive from "../components/NavBarActive";
import { User } from "../models/user";

const Room = () => {
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState("home");

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
                } else {
                    navigate("/");
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
                    />
                    {view === "home" && <h1>Home</h1>}
                    {view === "bank" && <h1>Bank</h1>}
                    {view === "history" && <h1>History</h1>}
                </>
            )}
        </>
    );
};
export default Room;
