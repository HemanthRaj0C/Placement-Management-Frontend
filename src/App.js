import React from "react";
import HomePage from "./pages/HomePage";
import UserLoginPage from "./pages/user/UserLoginPage";
import UserDashboard from "./components/User/UserDashboard";
import UserRegisterPage from "./pages/user/UserRegisterPage";
import RecruiterLoginPage from "./pages/recruiter/RecruiterLoginPage";
import RecruiterRegisterPage from "./pages/recruiter/RecruiterRegisterPage";
import RecruiterProfile from "./components/Recruiter/RecruiterProfile";
import RecruiterDashboard from "./components/Recruiter/RecruiterDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserProfile from "./components/User/UserProfile";

const App = () => {
    return(
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/user/login" element={<UserLoginPage />} />
                <Route path="/user/register" element={<UserRegisterPage />} />
                <Route path="/user/profile" element={<UserProfile />} />
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/recruiter/register" element={<RecruiterRegisterPage />} />
                <Route path="/recruiter/login" element={<RecruiterLoginPage />} />
                <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
            </Routes>
        </Router>
    )
};

export default App;