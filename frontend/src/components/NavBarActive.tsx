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
                    <div className="dropdown">
                        <div
                            tabIndex={0}
                            role="button"
                            className="btn btn-ghost md:hidden pl-2 pr-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16"
                                />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-[1] p-0 mb-0 shadow bg-white rounded-box w-52"
                        >
                            <li>
                                <button
                                    className="border-b-2 py-2 focus:bg-gray-300 rounded-none rounded-t-xl"
                                    onClick={() => console.log("click")}
                                >
                                    Home
                                </button>
                            </li>
                            <li>
                                <button className="border-b-2 py-2 focus:bg-gray-300 rounded-none">
                                    Bank
                                </button>
                            </li>
                            <li>
                                <button className="border-b-2 py-2 focus:bg-gray-300 rounded-none rounded-b-xl ">
                                    History
                                </button>
                            </li>
                        </ul>
                    </div>
                    <a className="btn btn-ghost md:text-xl text-base sm:text-lg md:pl-4 pl-0">
                        Monopoly Banking
                    </a>
                </div>
                <div className="navbar-center hidden md:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li>
                            <button
                                className="hover:bg-gray-300"
                                onClick={() => console.log("click")}
                            >
                                Home
                            </button>
                        </li>
                        <li>
                            <button className="hover:bg-gray-300">Bank</button>
                        </li>
                        <li>
                            <button className="hover:bg-gray-300">
                                History
                            </button>
                        </li>
                    </ul>
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
