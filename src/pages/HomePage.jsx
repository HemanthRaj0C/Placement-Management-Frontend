import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return(
        <div>
            <h1 className="text-3xl">Welcome to the HomePage</h1>
            <div>
                <div>
                    <h2>User</h2>
                    <Link to="/user/login">Login</Link> <br />
                    <Link to="/user/register">Register</Link>
                </div>
                <div>
                    <h2>Recruiter</h2>
                    <Link to="/recruiter/login">Login</Link> <br />
                    <Link to="/recruiter/register">Register</Link>
                </div>
            </div>
        </div>
    )
};

export default HomePage;