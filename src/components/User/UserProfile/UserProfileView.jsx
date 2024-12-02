import React from 'react';

const UserProfileView = ({ userProfile }) => {
    return (
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
                >
                    {link}
                </a>
            ))}
        </div>
    );
};

export default UserProfileView;