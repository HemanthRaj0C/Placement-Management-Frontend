import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardBody, Divider, Button, Spacer } from "@nextui-org/react";
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
    const [formData, setFormData] = useState({ ...recruiterProfile });

    useEffect(() => {
        fetchRecruiterProfile();
    }, []);

    const fetchRecruiterProfile = async () => {
        try {
            const token = localStorage.getItem('recruiterToken');
            const response = await axios.get('http://localhost:3001/api/recruiterProfile', {
                headers: { recruiterToken: token }
            });

            if (response.data.length === 0) {
                setNewRecruiter(true);
                setIsEditMode(true); // Automatically open edit mode for new recruiters
            }

            if (response.data.length > 0) {
                const profile = response.data[0];
                setRecruiterProfile(profile);
                setFormData({ ...profile });
                setNewRecruiter(false);
            }
        } catch (error) {
            alert(newRecruiter ? "Please create your company profile" : "Failed to fetch recruiter profile");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
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
            setRecruiterProfile({ ...formData });
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
        <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
            <Card className="max-w-5xl w-full bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white">Recruiter Company Profile</h1>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    {newRecruiter ? (
                        <>
                            <p className="text-lg mb-4">Welcome! Please create your company profile to get started.</p>
                            <RecruiterProfileForm
                                formData={formData}
                                handleInputChange={handleInputChange}
                                handleSubmit={handleSubmit}
                                newRecruiter={newRecruiter}
                                setIsEditMode={setIsEditMode}
                            />
                            <Spacer y={1} />
                            <div className="flex justify-end gap-4">
                                <Button onClick={() => navigate("/recruiter/dashboard")} color="warning" auto>
                                    Go to Dashboard
                                </Button>
                                <Button onClick={handleLogout} color="error" auto>
                                    Logout
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {isEditMode ? (
                                <RecruiterProfileForm
                                    formData={formData}
                                    handleInputChange={handleInputChange}
                                    handleSubmit={handleSubmit}
                                    newRecruiter={newRecruiter}
                                    setIsEditMode={setIsEditMode}
                                />
                            ) : (
                                <RecruiterProfileView recruiterProfile={recruiterProfile} />
                            )}
                            <Spacer y={1} />
                            <div className="flex justify-end gap-4">
                                {!isEditMode && (
                                    <Button onClick={() => setIsEditMode(true)} color="primary" auto>
                                        Edit Profile
                                    </Button>
                                )}
                                <Button onClick={() => navigate("/recruiter/dashboard")} color="warning" auto>
                                    Go to Dashboard
                                </Button>
                                <Button onClick={handleLogout} color="error" auto>
                                    Logout
                                </Button>
                            </div>
                        </>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default RecruiterProfile;
