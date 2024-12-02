import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedJobRole, setSelectedJobRole] = useState("");
    const navigate = useNavigate();

    const fetchApplications = async () => {
        try {
            const jobs = await axios.get("http://localhost:3001/api/jobs");
            setApplications(jobs.data);
            setFilteredApplications(jobs.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const applyJob = async (jobID) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("http://localhost:3001/api/applyJob", 
                { jobID: jobID },
                { headers: { token: token } }
            );
            alert(response.data.message);
            fetchAppliedJobs();
        }
        catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Failed to Apply");
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const appliedJobs = await axios.get("http://localhost:3001/api/appliedJobs", 
                { headers: { token: token } }
            );
            setAppliedJobs(appliedJobs.data);
        }
        catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch applied jobs");
        }
    };

    const handleJobRoleFilter = (role) => {
        setSelectedJobRole(role);
        
        if (!role) {
            setFilteredApplications(applications);
        } else {
            const filtered = applications.filter(job => 
                job.jobRole.toLowerCase() === role.toLowerCase()
            );
            setFilteredApplications(filtered);
        }
    };

    const getUniqueJobRoles = () => {
        return [...new Set(applications.map(job => job.jobRole))];
    };

    const isJobApplied = (jobID) => {
        return appliedJobs.some(appliedJob => appliedJob.jobID === jobID);
    };

    useEffect(() => {
        fetchApplications();
        fetchAppliedJobs();
    }, []);

    return (
        <div>
            <h1>Welcome to User Dashboard</h1>
            <div>
                <button onClick={() => navigate("/user/profile")}>Go to Profile</button>
            </div>

            <div>
                <label>Filter by Job Role: </label>
                <select 
                    value={selectedJobRole} 
                    onChange={(e) => handleJobRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    {getUniqueJobRoles().map((role, index) => (
                        <option key={index} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div>
                <h2>Available Jobs {selectedJobRole && `(${selectedJobRole})`}</h2>
                <div>
                    {filteredApplications.map((job, index) => {
                        const isApplied = isJobApplied(job.jobID);
                        return (
                            <div key={index}>
                                <h3>JobID: {job.jobID}</h3>
                                <p>Title: {job.jobTitle}</p>
                                <p>Company Name: {job.companyName}</p>
                                <p>Description: {job.jobDescription}</p>
                                <p>Location: {job.jobLocation}</p>
                                <p>Location Type: {job.jobLocationType}</p>
                                <p>Role: {job.jobRole}</p>
                                <p>Type: {job.jobType}</p>
                                <p>Eligibility Criteria: {job.eligibilityCriteria}</p>
                                <p>Cost to Company: {job.ctc}</p>
                                <p>Created At: {new Date(job.createdAt).toLocaleDateString()}</p>
                                <p>Last Date: {new Date(job.lastDateToApply).toLocaleDateString()}</p>
                                <p>{job.salary}</p>
                                <button 
                                    onClick={() => applyJob(job.jobID)}
                                    disabled={isApplied}
                                    style={{
                                        backgroundColor: isApplied ? 'gray' : '',
                                        cursor: isApplied ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>
                <h2>Applied Jobs</h2>
                <div>
                    {appliedJobs.map((job, index) => {
                        return (
                            <div key={index}>
                                <h3>Job ID: {job.jobID}</h3>
                                <p>Application ID: {job.applicationID}</p>
                                <p>Student ID: {job.studentID}</p>
                                <p>Name: {job.name}</p>
                                <p>Job Title: {job.jobTitle}</p>
                                <p>Company Name: {job.companyName}</p>
                                <p>Application Status: {job.applicationStatus}</p>
                                <p>Created At: {new Date(job.createdAt).toLocaleDateString()}</p>
                                <p>Updated At: {new  Date(job.updatedAt).toLocaleDateString()}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
};

export default UserDashboard;