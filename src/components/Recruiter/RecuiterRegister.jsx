import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEnvelope, FaLock, FaUserAlt, FaBuilding, FaUserTie, FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@nextui-org/react";

const RecruiterRegister = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        recruiterID: '',
        name: '',
        companyName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);
    const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(!isConfirmPasswordVisible);

    const validateForm = () => {
        if (!formData.recruiterID) return 'Recruiter ID is required';
        if (!formData.name) return 'Name is required';
        if (!formData.companyName) return 'Company Name is required';
        if (!formData.email) return 'Email is required';
        if (!formData.password) return 'Password is required';
        if (!formData.confirmPassword) return 'Confirm Password is required';

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Invalid email format';
        if (formData.password !== formData.confirmPassword) return 'Passwords do not match';

        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/api/recruiterRegister', formData);
            setSuccess(response.data.message);
            if (response.status === 201) {
                navigate('/recruiter/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        } finally {
            setFormData({
                recruiterID: '',
                name: '',
                companyName: '',
                email: '',
                password: '',
                confirmPassword: ''
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 mx-12 py-5">
            {/* Recruiter ID Field */}
            <div className="flex items-center space-x-5">
                <FaUserTie className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type="text"
                        name="recruiterID"
                        id="recruiterID"
                        value={formData.recruiterID}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="recruiterID"
                    >
                        Recruiter ID
                    </label>
                </div>
            </div>

            {/* Name Field */}
            <div className="flex items-center space-x-5">
                <FaUserAlt className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="name"
                    >
                        Name
                    </label>
                </div>
            </div>

            {/* Company Name Field */}
            <div className="flex items-center space-x-5">
                <FaBuilding className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="companyName"
                    >
                        Company Name
                    </label>
                </div>
            </div>

            {/* Email Field */}
            <div className="flex items-center space-x-5">
                <FaEnvelope className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="email"
                    >
                        Email
                    </label>
                </div>
            </div>

            {/* Password Field */}
            <div className="flex items-center space-x-5">
                <FaLock className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="password"
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

            {/* Confirm Password Field */}
            <div className="flex items-center space-x-5">
                <FaLock className="text-gray-200 text-xl hover:scale-125 transition-all transform duration-300"/>
                <div className="relative w-full">
                    <input
                        type={isConfirmPasswordVisible ? "text" : "password"}
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-md bg-amber-900 border border-amber-500/20 text-white placeholder-transparent focus:outline-none focus:ring-1 focus:ring-white peer text-sm md:text-base"
                        placeholder=" "
                        required
                    />
                    <label
                        className="absolute text-gray-300 duration-200 transform -translate-x-1 -translate-y-6 scale-75 top-1 z-10 origin-[0] bg-amber-900 px-2 my-2 left-3 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:bg-white peer-focus:text-black peer-focus:-translate-y-6 rounded-3xl cursor-text text-sm md:text-base"
                        htmlFor="confirmPassword"
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

            {/* Error and Success Messages */}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {success && <p className="text-green-500 text-center">{success}</p>}

            {/* Submit Button */}
            <div className="flex justify-center mt-5">
                <Button
                type="submit"
                className="bg-gradient-to-tl from-orange-600 via-amber-900 to-amber-900 hover:bg-gradient-to-br hover:from-orange-500 hover:via-amber-800 hover:to-amber-800 transition-all hover:scale-95 duration-300 text-white font-semibold my-4 w-28"
                >
                Register
                </Button>
            </div>
        </form>
    );
};

export default RecruiterRegister;
