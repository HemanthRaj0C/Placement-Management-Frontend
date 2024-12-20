import React, { useState } from "react";
import { 
  Button 
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => 
    setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/api/userLogin", {
        email: email,
        password: password
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/user/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  return (
        <form onSubmit={handleSubmit} className="space-y-10 mx-12 py-5">
        {/* Email Field */}
        <div className="flex items-center space-x-5">
        <FaEnvelope className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
        <div className="relative w-full">
            <input
            type="email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
            />
            <label
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
            htmlFor="email"
            >
            Email
            </label>
        </div>
        </div>

        {/* Password Field */}
        <div className="flex items-center space-x-5">
        <FaLock className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
            <input
            type={isPasswordVisible ? "text" : "password"}
            value={password}
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
            />
            <label
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
            htmlFor="password"
            >
            Password
            </label>
            <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 focus:outline-none"
            >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
        </div>

        {/* Error Message */}
        {error && (
            <div className="text-red-500 text-sm text-center">
            {error}
            </div>
        )}

        {/* Submit Button */}
        <Button
            type="submit"
            fullWidth
            className="bg-gradient-to-tl from-cyan-600 via-blue-950 to-blue-950 hover:bg-gradient-to-br hover:from-cyan-500 hover:via-blue-800 hover:to-blue-800 transition-all hover:scale-95 duration-300 text-white font-semibold my-4 w-28 left-[35%]"
        >
            Login
        </Button>
        </form>
  );
};

export default UserLogin;