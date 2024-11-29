import React from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./components/UserDashboard";
import RegisterPage from "./pages/RegisterPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserProfile from "./components/UserProfile";

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/user/login" element={<LoginPage />} />
                <Route path="/user/register" element={<RegisterPage />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
            </Routes>
        </Router>
    )
};

export default App;