import { User } from "../models/user";
import * as userApi from "../api/userApi";
import { useNavigate } from "react-router-dom";
interface NavBarActiveProps {
    loggedInUser: User | null;
}

// eslint-disable-next-line no-empty-pattern
const NavBarActive = ({}: NavBarActiveProps) => {
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
                    <p className="font-medium md:text-xl text-base sm:text-lg md:pl-4 pl-0">
                        Monopoly Banking
                    </p>
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
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                        onClick={handleLogout}
                    >
                        Leave Room
                    </button>
                </div>
            </div>
        </>
    );
};

export default NavBarActive;
