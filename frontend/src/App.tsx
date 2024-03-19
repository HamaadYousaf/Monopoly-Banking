import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import * as userApi from "./api/userApi";
import Loading from "./components/Loading";
import Login from "./components/Login";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import { User } from "./models/user";
import Home from "./pages/Home";

function App() {
    const loggedInUser = useRef<User | null>(
        JSON.parse(localStorage.getItem("user") || "{}")
    );
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                setLoading(true);
                const user = await userApi.getLoggedInUser(
                    loggedInUser.current
                );
                loggedInUser.current = user;
                setShowLogin(false);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        }
        fetchLoggedInUser();
    }, []);

    return (
        <div className="bg-bg-blue">
            {loading ? (
                <>
                    <Loading />
                </>
            ) : (
                <>
                    <BrowserRouter>
                        <NavBar
                            loggedInUser={loggedInUser.current}
                            showRegister={showRegister}
                            showLogin={showLogin}
                            onLoginClicked={() => {
                                setShowRegister(false);
                                setShowLogin(true);
                            }}
                            onLogoutSuccessful={() => {
                                loggedInUser.current = null;
                                setShowLogin(true);
                            }}
                            onRegisterClicked={() => {
                                setShowLogin(false);
                                setShowRegister(true);
                            }}
                        />
                        <div className="md:container md:mx-auto">
                            {showRegister && (
                                <Register
                                    onRegisterSuccessful={(user) => {
                                        loggedInUser.current = user;
                                        setShowRegister(false);
                                    }}
                                />
                            )}
                            {showLogin && (
                                <Login
                                    onLoginSuccessful={(user) => {
                                        loggedInUser.current = user;
                                        setShowLogin(false);
                                    }}
                                />
                            )}
                            {!showLogin && !showRegister && (
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Home
                                                loggedInUser={
                                                    loggedInUser.current
                                                }
                                            />
                                        }
                                    />
                                </Routes>
                            )}
                        </div>
                    </BrowserRouter>
                </>
            )}
        </div>
    );
}

export default App;
