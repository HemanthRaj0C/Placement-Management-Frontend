import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RecruiterDashboard = () => {
    const [jobData, setJobData] = useState({
        jobID: "",
        companyName: "",
        jobTitle: "",
        jobDescription: "",
        jobLocation: "",
        jobLocationType: "",
        jobRole: "",
        jobType: "",
        eligibilityCriteria: "",
        ctc: "",
        lastDateToApply: ""
    });

    const [postedJobs, setPostedJobs] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);

    const navigate = useNavigate();

    const handleJobDataChange = (e) => {
        const { name, value } = e.target;
        setJobData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("recruiterToken");

            const response = await axios.post(
                "http://localhost:3001/api/jobs", 
                jobData,
                { headers: { recruiterToken: token } }
            );

            alert(response.data.message);
            fetchPostedJobs();
            
            // Reset form
            setJobData({
                jobID: "",
                companyName: "",
                jobTitle: "",
                jobDescription: "",
                jobLocation: "",
                jobLocationType: "",
                jobRole: "",
                jobType: "",
                eligibilityCriteria: "",
                ctc: "",
                lastDateToApply: ""
            });
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to post job");
        }
    };

    const fetchPostedJobs = async () => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                "http://localhost:3001/api/postedJobs", 
                { headers: { recruiterToken: token } }
            );
            setPostedJobs(response.data);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch jobs");
        }
    };

    const fetchJobApplications = async () => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                "http://localhost:3001/api/jobApplications", 
                { headers: { recruiterToken: token } }
            );
            setJobApplications(response.data);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch job applications");
        }
    };

    const updateApplicationStatus = async (applicationID, status) => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.patch(
                "http://localhost:3001/api/updateApplicationStatus", 
                { applicationID, applicationStatus: status },
                { headers: { recruiterToken: token } }
            );

            alert(response.data.message);
            fetchJobApplications();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update application status");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    useEffect(() => {
        fetchPostedJobs();
        fetchJobApplications();
    }, []);

    return (
        <div>
            <h1>Recruiter Dashboard</h1>

            {/* Job Posting Section */}
            <div>
                <h2>Post a New Job</h2>
                <form onSubmit={handlePostJob}>
                    <div>
                        <label>Job ID</label>
                        <input 
                            type="text"
                            name="jobID"
                            placeholder="Unique Job ID"
                            value={jobData.jobID}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Company Name</label>
                        <input 
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            value={jobData.companyName}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Job Title</label>
                        <input 
                            type="text"
                            name="jobTitle"
                            placeholder="Job Title"
                            value={jobData.jobTitle}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Job Description</label>
                        <textarea 
                            name="jobDescription"
                            placeholder="Job Description"
                            value={jobData.jobDescription}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Job Location</label>
                        <input 
                            type="text"
                            name="jobLocation"
                            placeholder="Job Location"
                            value={jobData.jobLocation}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Location Type</label>
                        <select 
                            name="jobLocationType"
                            value={jobData.jobLocationType}
                            onChange={handleJobDataChange}
                        >
                            <option value="" disabled>Select Job Location</option>
                            <option value="On-Site">On-Site</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div>
                        <label>Job Role</label>
                        <input 
                            type="text"
                            name="jobRole"
                            placeholder="Job Role"
                            value={jobData.jobRole}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Job Type</label>
                        <select 
                            name="jobType"
                            value={jobData.jobType}
                            onChange={handleJobDataChange}
                        >
                            <option value="" disabled>Select Job Type</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div>
                        <label>Eligibility Criteria</label>
                        <input 
                            type="text"
                            name="eligibilityCriteria"
                            placeholder="Eligibility Criteria"
                            value={jobData.eligibilityCriteria}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Cost to Company (CTC)</label>
                        <input 
                            type="text"
                            name="ctc"
                            placeholder="Cost to Company"
                            value={jobData.ctc}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Last Date to Apply</label>
                        <input 
                            type="date"
                            name="lastDateToApply"
                            value={jobData.lastDateToApply}
                            onChange={handleJobDataChange}
                            required
                        />
                    </div>
                    <button type="submit">Post Job</button>
                </form>
            </div>

            {/* Posted Jobs Section */}
            <div>
                <h2>Your Posted Jobs</h2>
                {postedJobs.length === 0 ? (
                    <p>No jobs posted yet</p>
                ) : (
                    postedJobs.map((job, index) => (
                        <div key={index}>
                            <h3>{job.jobTitle} at {job.companyName}</h3>
                            <p>Job ID: {job.jobID}</p>
                            <p>Job Role: {job.jobRole}</p>
                            <p>Location: {job.jobLocation} ({job.jobLocationType})</p>
                            <p>Job Type: {job.jobType}</p>
                            <p>CTC: {job.ctc}</p>
                            <p>Last Date to Apply: {new Date(job.lastDateToApply).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Job Applications Section */}
            <div>
                <h2>Job Applications</h2>
                {jobApplications.length === 0 ? (
                    <p>No applications received</p>
                ) : (
                    jobApplications.map((application, index) => (
                        <div key={index}>
                            <h3>Application for {application.jobTitle}</h3>
                            <p>Application ID: {application.applicationID}</p>
                            <p>Student Name: {application.name}</p>
                            <p>Student ID: {application.studentID}</p>
                            <p>Job ID: {application.jobID}</p>
                            <p>Current Status: {application.applicationStatus}</p>
                            <div>
                                <button 
                                    onClick={() => updateApplicationStatus(application.applicationID, 'Shortlisted')}
                                    disabled={application.applicationStatus === 'Shortlisted'}
                                >
                                    Shortlist
                                </button>
                                <button 
                                    onClick={() => updateApplicationStatus(application.applicationID, 'Rejected')}
                                    disabled={application.applicationStatus === 'Rejected'}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default RecruiterDashboard;