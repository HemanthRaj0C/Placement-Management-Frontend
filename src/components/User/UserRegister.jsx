import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserGraduate,
  FaEnvelope,
  FaLock,
  FaGraduationCap,
  FaEye,
  FaEyeSlash,
  FaUnlock
} from "react-icons/fa";

const UserRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentID: "",
    name: "",
    email: "",
    password: "",
    branch: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState("");
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const branches = ["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"];

  const togglePasswordVisibility = () =>
    setIsPasswordVisible(!isPasswordVisible);

  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleConfirmPassword = (e) => {
    setIsConfirmPassword(e.target.value);
  };

  const validateForm = () => {
    if (!formData.studentID) return "Student ID is required";
    if (!formData.name) return "Name is required";
    if (!formData.email) return "Email is required";
    if (!formData.password) return "Password is required";
    if (!isConfirmPassword) return "Confirm Password is required";
    if (!formData.branch) return "Branch is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return "Invalid email format";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (formData.password !== isConfirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/userRegister",
        formData
      );
      setSuccess(response.data.message);
      if (response.status === 201) {
        navigate("/user/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setFormData({
        studentID: "",
        name: "",
        email: "",
        password: "",
        branch: "",
      });
      setIsConfirmPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 mx-12 py-5">
      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="text-green-500 text-sm text-center">{success}</div>
      )}

      {/* Student ID */}
      <div className="flex items-center space-x-5">
        <FaUserGraduate className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
          <input
            type="text"
            id="studentID"
            name="studentID"
            value={formData.studentID}
            onChange={handleChange}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
          />
          <label
            htmlFor="studentID"
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
          >
            Student ID
          </label>
        </div>
      </div>

      {/* Name */}
      <div className="flex items-center space-x-5">
        <FaUser className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
          />
          <label
            htmlFor="name"
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
          >
            Full Name
          </label>
        </div>
      </div>

      {/* Email */}
      <div className="flex items-center space-x-5">
        <FaEnvelope className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
          >
            Email
          </label>
        </div>
      </div>

      {/* Password */}
      <div className="flex items-center space-x-5">
        <FaLock className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
          />
          <label
            htmlFor="password"
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
          >
            Password
          </label>
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {isPasswordVisible ? <FaEyeSlash className="text-gray-300"/> : <FaEye className="text-gray-300"/>}
          </div>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="flex items-center space-x-5">
        <FaUnlock className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <div className="relative w-full">
          <input
            type={isConfirmPasswordVisible ? "text" : "password"}
            id="confirmPassword"
            value={isConfirmPassword}
            onChange={handleConfirmPassword}
            className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
            placeholder=" "
            required
          />
          <label
            htmlFor="confirmPassword"
            className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-blue-950 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
          >
            Confirm Password
          </label>
          <div
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {isConfirmPasswordVisible ? <FaEyeSlash className="text-gray-300"/> : <FaEye className="text-gray-300"/>}
          </div>
        </div>
      </div>

      {/* Branch */}
      <div className="flex items-center space-x-5">
        <FaGraduationCap className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300" />
        <select
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-blue-950 border border-blue-500/20 text-white focus:outline-none focus:ring-1 focus:ring-white"
        >
          <option value="">Select Branch</option>
          {branches.map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center mt-5">
        <Button
          type="submit"
          className="bg-gradient-to-tl from-cyan-600 via-blue-950 to-blue-950 hover:bg-gradient-to-br hover:from-cyan-500 hover:via-blue-800 hover:to-blue-800 transition-all hover:scale-95 duration-300 text-white font-semibold my-4 w-28"
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default UserRegister;