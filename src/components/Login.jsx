import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:3001/api/userLogin", {
                email: email,
                password: password
            });
            if(response.data.token){
                localStorage.setItem("token", response.data.token);
                navigate("/user/profile");
            }
        }
        catch(err){
            alert(err.response?.data?.message || "An error occurred");
        }
        finally{
            setEmail("");
            setPassword("");
        }
    };

    return(
        <div>
            <form method="post">
                <input type="email" name="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <input type="password" name="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                <button type="submit" onClick={handleSubmit}>Login</button>
            </form>
        </div>
    )
};

export default Login;