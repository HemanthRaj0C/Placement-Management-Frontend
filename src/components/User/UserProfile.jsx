import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileForm from "./UserProfile/UserProfileForm";
import UserProfileView from "./UserProfile/UserProfileView";
import ResumeSection from "./UserProfile/ResumeSection";

const UserProfile = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [latestResume, setLatestResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [userProfile, setUserProfile] = useState({
        firstName: "", lastName: "", email: "", mobileNumber: "",
        degree: "", degreeStatus: "", highestQualification: "",
        technicalSkills: [], otherSkills: [], experience: 0,
        projectLinks: []
    });
    const [formData, setFormData] = useState({...userProfile});

    useEffect(() => {
        fetchUserProfile();
        fetchLatestResume();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/userProfile', {
                headers: { token: token }
            });
            if(response.data.length === 0){
                setNewUser(true);
                setIsEditMode(true);  // Automatically open edit mode for new users
            }
            if (response.data.length > 0) {
                const profile = response.data[0];
                setUserProfile(profile);
                setFormData({...profile});
                setNewUser(false);
            }
        } catch (error) {
            if(newUser){
                alert("Please create your profile");
            }
            else{
                alert("Failed to fetch user profile");
            }
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            alert("Only PDF and Word documents are allowed");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("File size should not exceed 5MB");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setIsUploading(true);
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/upload-resume', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    token: token
                }
            });

            await fetchLatestResume();
            alert("Resume uploaded successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to upload resume");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadResume = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to download resume");
            return;
        }
    
        try {
            // Create a temporary anchor element to trigger download
            const response = await axios.get('http://localhost:3001/api/download-resume', {
                headers: { token: token },
                responseType: 'blob' // Important for file download
            });
    
            // Create a blob URL
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            
            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            
            // Use the original filename from the server
            const filename = response.headers['content-disposition']
                ?.split('filename=')[1]
                ?.replace(/['"]/g, '') || 'resume.pdf';
            
            link.setAttribute('download', filename);
            
            // Append to body, click, and remove
            document.body.appendChild(link);
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            alert(error.response?.data?.message || "Failed to download resume");
        }
    };

    const viewResume = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please login to view resume");
            return;
        }
        try {
            // Create a temporary anchor element to trigger download
            const response = await axios.get('http://localhost:3001/api/download-resume', {
                headers: { token: token },
                responseType: 'blob' // Important for file download
            });
    
            // Create a blob URL
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            
            window.open(url);

        } catch (error) {
            alert(error.response?.data?.message || "Failed to View resume");
        }
        
    };

    const fetchLatestResume = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:3001/api/latest-resume', {
                headers: { token: token }
            });
            
            if (response.data) {
                setLatestResume(response.data);
            }
        } catch (error) {
            console.log('No resume found');
            setLatestResume(null);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSkillChange = (type, value) => {
        const skillArray = value.split(',').map(skill => skill.trim()).filter(skill => skill);
        setFormData(prev => ({
            ...prev,
            [type]: skillArray
        }));
    };

    const handleProjectLinkChange = (index, value) => {
        const updatedLinks = [...formData.projectLinks];
        updatedLinks[index] = value;
        setFormData(prev => ({
            ...prev,
            projectLinks: updatedLinks
        }));
    };

    const addProjectLink = () => {
        setFormData(prev => ({
            ...prev,
            projectLinks: [...prev.projectLinks, '']
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/userProfile', formData, {
                headers: { token: token }
            });

            alert(newUser ? "Profile created successfully" : "Profile updated successfully");
            setUserProfile({...formData});
            setIsEditMode(false);
            setNewUser(false);
        } catch (error) {
            if(newUser){
                alert("Please create your profile");
            }
            else{
                alert(error.response?.data?.message || "Failed to update profile");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div>
            <h1>User Profile</h1>
            {newUser ? (
                <div>
                    <p>Welcome! Please create your profile to get started.</p>
                    <UserProfileForm 
                        formData={formData}
                        handleInputChange={handleInputChange}
                        handleSkillChange={handleSkillChange}
                        handleProjectLinkChange={handleProjectLinkChange}
                        addProjectLink={addProjectLink}
                        handleSubmit={handleSubmit}
                        newUser={newUser}
                        setIsEditMode={setIsEditMode}
                    />
                    <div>
                        <button onClick={() => navigate("/user/dashboard")}>
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
                            <UserProfileView userProfile={userProfile} />
                            <button onClick={() => setIsEditMode(true)}>
                                Edit Profile
                            </button>
                            <ResumeSection 
                                latestResume={latestResume}
                                handleFileUpload={handleFileUpload}
                                isUploading={isUploading}
                                handleDownloadResume={handleDownloadResume}
                                viewResume={viewResume}
                            />
                        </div>
                    ) : (
                        <UserProfileForm 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSkillChange={handleSkillChange}
                            handleProjectLinkChange={handleProjectLinkChange}
                            addProjectLink={addProjectLink}
                            handleSubmit={handleSubmit}
                            newUser={newUser}
                            setIsEditMode={setIsEditMode}
                        />
                    )}

                    <div>
                        <button onClick={() => navigate("/user/dashboard")}>
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

export default UserProfile;