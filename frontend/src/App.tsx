import { useEffect, useState } from "react";
import { User } from "./models/user";
import * as userApi from "./api/userApi";
import Login from "./components/Login";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import Register from "./components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Loading from "./components/Loading";
function App() {
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLoggedInUser() {
            try {
                setLoading(true);
                const user = await userApi.getLoggedInUser();
                setLoggedInUser(user);
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
                            loggedInUser={loggedInUser}
                            showRegister={showRegister}
                            showLogin={showLogin}
                            onLoginClicked={() => {
                                setShowRegister(false);
                                setShowLogin(true);
                            }}
                            onLogoutSuccessful={() => setLoggedInUser(null)}
                            onRegisterClicked={() => {
                                setShowLogin(false);
                                setShowRegister(true);
                            }}
                        />
                        <div className="md:container md:mx-auto">
                            {showRegister && (
                                <Register
                                    onRegisterSuccessful={(user) => {
                                        setLoggedInUser(user);
                                        setShowRegister(false);
                                    }}
                                />
                            )}
                            {showLogin && (
                                <Login
                                    onLoginSuccessful={(user) => {
                                        setLoggedInUser(user);
                                        setShowLogin(false);
                                    }}
                                />
                            )}
                            {!showLogin && !showRegister && (
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <Home loggedInUser={loggedInUser} />
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
