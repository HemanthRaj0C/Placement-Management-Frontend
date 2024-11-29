import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return(
        <div>
            <h1 className="text-3xl">Welcome to the HomePage</h1>
            <div>
                <Link to="/user/login">Login</Link> <br />
                <Link to="/user/register">Register</Link>
            </div>
        </div>
    )
};

export default HomePage;