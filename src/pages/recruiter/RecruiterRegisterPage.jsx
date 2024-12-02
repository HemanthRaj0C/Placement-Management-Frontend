import React from "react";
import RecuiterRegister from "../../components/Recruiter/RecuiterRegister";

const RecuiterRegisterPage =()=>{
    return(
        <>
            <h1>Welcome to Register Page</h1>
            <RecuiterRegister />
            <div>
                Have an account? <a href="/">Login</a>
            </div>
        </>
    )
}
export default RecuiterRegisterPage;