import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecuiterRegister = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        recruiterID: '',
        name: '',
        companyName: '',
        email: '',
        password: ''
    });

    const [ error, setError ] = useState('');
    const [ success, setSuccess ] = useState('')

    const validateForm = ()=>{
        if (!formData.recruiterID) return 'Recruiter ID is required'
        if (!formData.name) return 'Name is required'
        if(!formData.companyName) return 'Company Name is required'
        if (!formData.email) return 'Email is required'
        if (!formData.password) return 'Password is required'

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Invalid email format';

        // if (formData.password.length < 6) return 'Password must be at least 6 characters';

        return null;
    }

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
        if(validationError){
            setError(validationError);
            return;
        }

        try{
            const response = await axios.post('http://localhost:3001/api/recruiterRegister', formData);
            setSuccess(response.data.message);
            if(response.status === 201){
                navigate('/recruiter/login');
            }
        }
        catch(err){
            setError(err.response?.data?.message || "An error occurred");
        }
        finally{
            setFormData({
                recruiterID: '',
                name: '',
                companyName: '',
                email: '',
                password: ''
            });
        }
    };

    return(
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div>{error}</div>
                    )}
                    {success && (
                        <div>{success}</div>
                    )}
                    <div>
                    <label>Recruiter ID</label>
                    <input type="text" name="recruiterID" placeholder="Recruiter ID" value={formData.recruiterID} onChange={handleChange} required/>
                    </div>
                    <div>
                    <label>Name</label>
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required/>
                    </div>
                    <div>
                    <label>Company Name</label>
                    <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required/>
                    </div>
                    <div>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                    </div>
                    <div>
                    <label>Password</label>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    )
};

export default RecuiterRegister;