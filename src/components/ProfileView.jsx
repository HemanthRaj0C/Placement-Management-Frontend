import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileView = () => {

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

    useEffect(()=>{
        
    })

    return(
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
    )
};

export default ProfileView;