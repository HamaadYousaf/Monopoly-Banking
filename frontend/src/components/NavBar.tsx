import { User } from "../models/user";

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
    console.log(loggedInUser);
    console.log(onLoginClicked);
    console.log(onLogoutSuccessful);
    console.log(onRegisterClicked);

    return (
        <>
            <div className="navbar bg-white shadow-md">
                <div className="navbar-start">
                    <a className="btn btn-ghost md:text-xl text-base sm:text-lg md:pl-4 pl-2">
                        Monopoly Banking
                    </a>
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
                </div>
            </div>
        </>
    );
};

export default NavBar;
