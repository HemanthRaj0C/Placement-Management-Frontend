import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        experience: 0,
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

    const renderResumeSection = () => {
        if (latestResume) {
            return (
                <div>
                    <h3>Your Latest Resume</h3>
                    <p>Filename: {latestResume.originalName}</p>
                    <p>Uploaded on: {new Date(latestResume.uploadDate).toLocaleDateString()}</p>
                    <button onClick={handleDownloadResume}>
                        Download Resume
                    </button>
                    <button onClick={viewResume}>
                        View Resume
                    </button>
                    <h3>Upload Another Resume</h3>
                    <input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                    {isUploading && <p>Uploading...</p>}
                </div>
            );
        }

        return (
            <div>
                <h3>Upload Your Resume</h3>
                <input 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                />
                {isUploading && <p>Uploading...</p>}
            </div>
        );
    };

    const renderProfileView = () => (
        <div>
            <h2>Profile Details</h2>
            <p>Name: {userProfile.firstName} {userProfile.lastName}</p>
            <p>Email: {userProfile.email}</p>
            <p>Mobile: {userProfile.mobileNumber}</p>
            <p>Degree: {userProfile.degree}</p>
            <p>Degree Status: {userProfile.degreeStatus}</p>
            <p>Highest Qualification: {userProfile.highestQualification}</p>
            <p>Experience: {userProfile.experience} years</p>
            <p>Technical Skills: {userProfile.technicalSkills.join(", ")}</p>
            <p>Other Skills: {userProfile.otherSkills.join(", ")}</p>
            
            <h3>Project Links</h3>
            {userProfile.projectLinks.map((link, index) => (
                <a 
                    key={index} 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{display: 'block', margin: '5px 0'}}
                >
                    {link}
                </a>
            ))}
        </div>
    );

    const renderProfileForm = () => (
        <>
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Last Name</label>
                <input 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />
            </div>
            <div>
                <label>Email</label>
                <input 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    type="email"
                    required
                />
            </div>
            <div>
                <label>Mobile Number</label>
                <input 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    type="tel"
                    required
                />
            </div>
            <div>
                <label>Degree</label>
                <select 
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Degree</option>
                    <option value="B.E">B.E</option>
                    <option value="B.Tech">B.Tech</option>
                    <option value="M.E">M.E</option>
                    <option value="PhD">PhD</option>
                </select>
            </div>
            <div>
                <label>Degree Status</label>
                <select 
                    name="degreeStatus"
                    value={formData.degreeStatus}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Status</option>
                    <option value="Pursuing">Pursuing</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <div>
                <label>Highest Qualification</label>
                <select 
                    name="highestQualification"
                    value={formData.highestQualification}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Qualification</option>
                    <option value="Higher Secondary">Higher Secondary</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Under Graduation">Under Graduation</option>
                    <option value="Post Graduation">Post Graduation</option>
                    <option value="PhD">PhD</option>
                </select>
            </div>
            <div>
                <label>Experience (Years)</label>
                <select 
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select Experience</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>
            <div>
                <label>Technical Skills (comma-separated)</label>
                <input 
                    value={formData.technicalSkills.join(', ')}
                    onChange={(e) => handleSkillChange('technicalSkills', e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Other Skills (comma-separated)</label>
                <input 
                    value={formData.otherSkills.join(', ')}
                    onChange={(e) => handleSkillChange('otherSkills', e.target.value)}
                />
            </div>
            <div>
                <label>Project Links</label>
                {formData.projectLinks.map((link, index) => (
                    <div key={index}>
                        <input 
                            value={link}
                            onChange={(e) => handleProjectLinkChange(index, e.target.value)}
                            placeholder="Enter project link"
                        />
                    </div>
                ))}
                <button type="button" onClick={addProjectLink}>
                    Add Project Link
                </button>
            </div>
            <div>
                <button type="submit">
                    {newUser ? "Create Profile" : "Save Profile"}
                </button>
                {!newUser && (
                    <button type="button" onClick={() => setIsEditMode(false)}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    </>
    );

    return (
        <div>
            <h1>User Profile</h1>
            {newUser ? (
                <div>
                    <p>Welcome! Please create your profile to get started.</p>
                    {renderProfileForm()}
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
                            {renderProfileView()}
                            <button onClick={() => setIsEditMode(true)}>
                                Edit Profile
                            </button>
                            <div>
                                {renderResumeSection()}
                            </div>
                        </div>
                    ) : (
                        renderProfileForm()
                    )}

                    <div>
                        <div>
                            <button onClick={() => navigate("/user/dashboard")}>
                                Go to Dashboard
                            </button>
                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;