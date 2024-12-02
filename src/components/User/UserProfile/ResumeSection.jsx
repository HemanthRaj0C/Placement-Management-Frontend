import React from 'react';

const ResumeSection = ({
    latestResume, 
    handleFileUpload, 
    isUploading, 
    handleDownloadResume, 
    viewResume
}) => {
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

export default ResumeSection;