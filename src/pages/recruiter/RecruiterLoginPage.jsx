import React from "react";
import RecruiterLogin from '../../components/Recruiter/RecruiterLogin';

const RecruiterLoginPage = () => {
    return(
        <>
            <h1>Welcome to Recruiter Login Page</h1>
            <RecruiterLogin />
            <div>
                Don't have an account? <a href="/">Register</a>
            </div>
        </>
    )
};

export default RecruiterLoginPage;