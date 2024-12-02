import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import RecruiterProfileForm from './RecruiterProfile/RecruiterProfileForm';
import RecruiterProfileView from './RecruiterProfile/RecruiterProfileView';

const RecruiterProfile = () => {
    const navigate = useNavigate();
    const [newRecruiter, setNewRecruiter] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [recruiterProfile, setRecruiterProfile] = useState({
        companyName: "",
        companyEmail: "",
        companyAbout: "",
        companyHeadquarters: "",
        companyIndustry: "",
        companyType: "",
        companyLinkedIn: "",
        companyWebsite: ""
    });
    const [formData, setFormData] = useState({...recruiterProfile});

    useEffect(() => {
        fetchRecruiterProfile();
    }, []);

    const fetchRecruiterProfile = async () => {
        try {
            const token = localStorage.getItem('recruiterToken');
            const response = await axios.get('http://localhost:3001/api/recruiterProfile', {
                headers: { recruiterToken: token }
            });
            
            if(response.data.length === 0){
                setNewRecruiter(true);
                setIsEditMode(true);  // Automatically open edit mode for new recruiters
            }
            
            if (response.data.length > 0) {
                const profile = response.data[0];
                setRecruiterProfile(profile);
                setFormData({...profile});
                setNewRecruiter(false);
            }
        } catch (error) {
            if(newRecruiter){
                alert("Please create your company profile");
            }
            else{
                alert("Failed to fetch recruiter profile");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('recruiterToken');
            await axios.post('http://localhost:3001/api/recruiterProfile', formData, {
                headers: { recruiterToken: token }
            });

            alert(newRecruiter ? "Company profile created successfully" : "Company profile updated successfully");
            setRecruiterProfile({...formData});
            setIsEditMode(false);
            setNewRecruiter(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("recruiterToken");
        navigate("/");
    };

    return (
        <div>
            <h1>Recruiter Company Profile</h1>
            {newRecruiter ? (
                <div>
                    <p>Welcome! Please create your company profile to get started.</p>
                    <RecruiterProfileForm 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        newRecruiter={newRecruiter}
                        setIsEditMode={setIsEditMode}
                    />
                    <div>
                        <button onClick={() => navigate("/recruiter/dashboard")}>
                            Go to Dashboard
                        </button>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    {!isEditMode ? (
                        <div>
                            <RecruiterProfileView recruiterProfile={recruiterProfile} />
                            <button onClick={() => setIsEditMode(true)}>
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <RecruiterProfileForm 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSubmit={handleSubmit}
                            newRecruiter={newRecruiter}
                            setIsEditMode={setIsEditMode}
                        />
                    )}

                    <div>
                        <button onClick={() => navigate("/recruiter/dashboard")}>
                            Go to Dashboard
                        </button>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecruiterProfile;