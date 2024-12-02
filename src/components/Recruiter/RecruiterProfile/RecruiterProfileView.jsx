import React from 'react';

const RecruiterProfileView = ({ recruiterProfile }) => {
    return (
        <div>
            <h2>Company Profile</h2>
            <p>Company Name: {recruiterProfile.companyName}</p>
            <p>Company Email: {recruiterProfile.companyEmail}</p>
            <p>About: {recruiterProfile.companyAbout}</p>
            <p>Headquarters: {recruiterProfile.companyHeadquarters}</p>
            <p>Industry: {recruiterProfile.companyIndustry}</p>
            <p>Company Type: {recruiterProfile.companyType}</p>
            <div>
                <h3>Company Links</h3>
                <a 
                    href={recruiterProfile.companyLinkedIn} 
                    target="_blank" 
                    rel="noopener noreferrer"
                >
                    LinkedIn Profile
                </a>
                <a 
                    href={recruiterProfile.companyWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{marginLeft: '10px'}}
                >
                    Company Website
                </a>
            </div>
        </div>
    );
};

export default RecruiterProfileView;