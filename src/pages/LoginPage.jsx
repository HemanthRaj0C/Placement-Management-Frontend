import React from "react";
import Login from "../components/Login";

const LoginPage = () => {

    return(
        <div>
            <h1>Welcome to Login Page</h1>
            <Login />
            <div>
                Don't have an account? <a href="/user/register">Register</a>
            </div>
        </div>
    )
};

export default LoginPage;