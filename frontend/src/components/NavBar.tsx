import { User } from "../models/user";
import * as userApi from "../api/userApi";

interface NavBarProps {
    loggedInUser: User | null;
    showRegister: boolean;
    showLogin: boolean;
    onLoginClicked: () => void;
    onLogoutSuccessful: () => void;
    onRegisterClicked: () => void;
}

const NavBar = ({
    loggedInUser,
    showRegister,
    showLogin,
    onLoginClicked,
    onLogoutSuccessful,
    onRegisterClicked,
}: NavBarProps) => {
    const handleLogout = async () => {
        try {
            await userApi.logoutUser();
            localStorage.clear();
            onLogoutSuccessful();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="navbar bg-white shadow-md">
                <div className="navbar-start">
                    {loggedInUser ? (
                        <>
                            <a
                                className="btn btn-ghost md:text-xl text-base sm:text-lg md:pl-4 pl-2"
                                href="/"
                            >
                                Monopoly Banking
                            </a>
                            {loggedInUser && (
                                <p className="text-base border-l-2 border-[#444444] pl-4">
                                    {loggedInUser.username}
                                </p>
                            )}
                        </>
                    ) : (
                        <>
                            <a className="btn btn-ghost md:text-xl text-base sm:text-lg md:pl-4 pl-2">
                                Monopoly Banking
                            </a>
                        </>
                    )}
                </div>
                <div className="navbar-end">
                    {showRegister && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={onLoginClicked}
                        >
                            Login
                        </button>
                    )}
                    {showLogin && (
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 md:mr-4 text-sm md:text-base"
                            onClick={onRegisterClicked}
                        >
                            Create Account
                        </button>
                    )}
                    {!showLogin && !showRegister && loggedInUser && (
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
