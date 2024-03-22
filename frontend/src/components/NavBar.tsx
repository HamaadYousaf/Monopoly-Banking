import { useNavigate } from "react-router-dom";
import * as userApi from "../api/userApi";
import { User } from "../models/user";

interface NavBarProps {
    loggedInUser: User | null;
    state: "login" | "register" | "home";
}

const NavBar = ({ loggedInUser, state }: NavBarProps) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await userApi.logoutUser();
            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="navbar bg-white shadow-md">
                <div className="navbar-start">
                    {loggedInUser?.username ? (
                        <>
                            <p className="font-medium md:text-xl text-base sm:text-lg md:pl-4 pl-2 md:pr-4 pr-2">
                                Monopoly Banking
                            </p>
                            {loggedInUser && (
                                <p className="text-base border-l-2 border-[#444444] md:pl-4 pl-2">
                                    {loggedInUser.username}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="md:text-xl text-base font-medium sm:text-lg md:pl-4 pl-2">
                                Monopoly Banking
                            </p>
                        </>
                    )}
                </div>
                <div className="navbar-end">
                    {state === "register" && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </button>
                    )}
                    {state === "login" && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 md:mr-4 text-sm md:text-base"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>
                    )}
                    {state !== "login" &&
                        state !== "register" &&
                        loggedInUser && (
                            <>
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 md:mr-4 text-sm md:text-base"
                                    onClick={handleLogout}
                                >
                                    Sign Out
                                </button>
                            </>
                        )}
                </div>
            </div>
        </>
    );
};

export default NavBar;
