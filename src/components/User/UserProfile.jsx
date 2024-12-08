import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserProfileForm from "./UserProfile/UserProfileForm";
import UserProfileView from "./UserProfile/UserProfileView";
import ResumeSection from "./UserProfile/ResumeSection";
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Divider, 
    Button, 
    Avatar 
  } from "@nextui-org/react";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { FcStatistics } from "react-icons/fc";

const UserProfile = () => {
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [latestResume, setLatestResume] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [userProfile, setUserProfile] = useState({
        firstName: "", 
        lastName: "", 
        email: "", 
        mobileNumber: "",
        degree: "", 
        degreeStatus: "", 
        highestQualification: "",
        technicalSkills: [], 
        otherSkills: [], 
        experience: "",
        projectLinks: ['']
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
                setIsEditMode(true);
            }
            
            if (response.data.length > 0) {
                const profile = response.data[0];
                setUserProfile(profile);
                setFormData({...profile});
                setNewUser(false);
            }
        } catch (error) {
            alert(newUser ? "Please create your company profile" : "Failed to fetch recruiter profile");
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

    const handleSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/api/userProfile', data, {
                headers: { token: token }
            });

            alert(newUser ? "Profile created successfully" : "Profile updated successfully");
            setUserProfile({...data});
            setIsEditMode(false);
            setNewUser(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update profile");
        }
    };

    const handleCancel = () => {
        setFormData({...userProfile});
        setIsEditMode(false);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-full mx-28 px-6 py-20">
            <Card className="bg-blue-900 text-white">
            <CardHeader className="flex justify-between items-center bg-blue-950/90 py-4 px-6">
                <div className="flex items-center gap-3">
                <Avatar text="UP" color="gradient" size="lg" />
                <h1 className="text-2xl font-bold">User Profile</h1>
                </div>
                <div className="flex gap-4">
                <Button
                    auto
                    color="success"
                    onClick={() => navigate("/user/dashboard")}
                    startContent={<MdDashboard />}
                >
                    Dashboard
                </Button>
                <Button
                    auto
                    color="warning"
                    onClick={() => navigate("/user/statistics")}
                    startContent={<FcStatistics />}
                >
                    Statistics
                </Button>
                <Button
                    auto
                    color="danger"
                    onClick={handleLogout}
                    startContent={<FaSignOutAlt />}
                >
                    Logout
                </Button>
                </div>
            </CardHeader>
            <Divider />
            <CardBody>
                {newUser || isEditMode ? (
                <div className="w-3/4 mx-auto my-4">
                <UserProfileForm 
                    initialFormData={userProfile}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSkillChange={handleSkillChange}
                    handleProjectLinkChange={handleProjectLinkChange}
                    addProjectLink={addProjectLink}
                    handleSubmit={(e) => {
                        e.preventDefault(); // Prevent default form submission
                        handleSubmit(formData);
                    }}
                    onCancel={handleCancel}
                    newUser={newUser}
                    isEditMode={isEditMode}
                />
                </div>
                ) : (
                <div className="m-4">
                    <UserProfileView
                    userProfile={userProfile}
                    onEditProfile={() => setIsEditMode(true)}
                    />
                    <ResumeSection 
                        latestResume={latestResume}
                        handleFileUpload={handleFileUpload}
                        isUploading={isUploading}
                        handleDownloadResume={handleDownloadResume}
                        viewResume={viewResume}
                    />
                </div>
                )}
            </CardBody>
            </Card>
        </div>
    </div>
  );
};

export default UserProfile;