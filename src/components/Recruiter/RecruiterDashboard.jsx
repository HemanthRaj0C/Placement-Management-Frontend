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
    const [interviews, setInterviews] = useState([]);
    const [interviewForm, setInterviewForm] = useState({
        applicationID: "",
        interviewDate: "",
        interviewTime: "",
        interviewMode: "",
        interviewLink: ""
    });
    const [postedJobs, setPostedJobs] = useState([]);
    const [rejectedApplications, setRejectedApplications] = useState([]);
    const [shortListedApplications, setShortListedApplications] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [appliedResumes, setAppliedResumes] = useState([]);

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
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to post job");
        }
        finally{
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
            const activeApplications = response.data.filter(
                app => app.applicationStatus === 'Applied'
            );
            const rejectedApplications = response.data.filter(
                app => app.applicationStatus === 'Rejected'
            );
            const shortListedApplications = response.data.filter(
                app => app.applicationStatus === 'Shortlisted'
            );
            setShortListedApplications(shortListedApplications);
            setRejectedApplications(rejectedApplications);
            setJobApplications(activeApplications);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch job applications");
        }
    };

    const fetchAppliedResumes = async () => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                "http://localhost:3001/api/appliedResume", 
                { headers: { recruiterToken: token } }
            );
            setAppliedResumes(response.data.resumes);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to fetch applied resumes");
        }
    };

    const downloadResume = async (resumeId) => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                `http://localhost:3001/api/download-resume/${resumeId}`, 
                { 
                    headers: { recruiterToken: token },
                    responseType: 'blob' 
                }
            );

            const resume = appliedResumes.find(r => r._id === resumeId);

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', resume ? resume.fileName : 'resume.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to download resume");
        }
    };

    const viewResume = async (resumeId) => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                `http://localhost:3001/api/download-resume/${resumeId}`, 
                { 
                    headers: { recruiterToken: token },
                    responseType: 'blob' 
                }
            );

            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to view resume");
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

    const scheduleInterview = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.post(
                "http://localhost:3001/api/schedule-interview", 
                interviewForm,
                { headers: { recruiterToken: token } }
            );

            alert(response.data.message);
            fetchInterviews();
            
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to schedule interview");
        }
        finally {
            // Reset interview form
            setInterviewForm({
                applicationID: "",
                interviewDate: "",
                interviewTime: "",
                interviewMode: "",
                interviewLink: ""
            });
        }
    };

    const fetchInterviews = async () => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.get(
                "http://localhost:3001/api/interviews", 
                { headers: { recruiterToken: token } }
            );
            setInterviews(response.data);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch interviews");
        }
    };

    const handleInterviewFormChange = (e) => {
        const { name, value } = e.target;
        setInterviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        fetchPostedJobs();
        fetchJobApplications();
        fetchAppliedResumes();
        fetchInterviews();
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
                                <div>
                                {/* View and download resume button */}
                                {appliedResumes.find(resume => resume.studentID === application.studentID) && (
                                    <button
                                        onClick={() => {
                                            const resume = appliedResumes.find(r => r.studentID === application.studentID);
                                            viewResume(resume._id);
                                        }}
                                    >
                                        View Resume
                                    </button>
                                )}
                                {appliedResumes.find(resume => resume.studentID === application.studentID) && (
                                    <button
                                        onClick={() => {
                                            const resume = appliedResumes.find(r => r.studentID === application.studentID);
                                            downloadResume(resume._id);
                                        }}
                                    >
                                        Download Resume
                                    </button>
                                )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Interview Scheduling Section for Shortlisted Applications */}
            <div>
                <h2>Schedule Interview</h2>
                <form onSubmit={scheduleInterview}>
                    <div>
                        <label>Shortlisted Application</label>
                        <select
                            name="applicationID"
                            value={interviewForm.applicationID}
                            onChange={handleInterviewFormChange}
                            required
                        >
                            <option value="">Select Shortlisted Application</option>
                            {shortListedApplications.map((app, index) => (
                                <option key={index} value={app.applicationID}>
                                    {app.name} - {app.applicationID} - {app.jobTitle}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Interview Date</label>
                        <input
                            type="date"
                            name="interviewDate"
                            value={interviewForm.interviewDate}
                            onChange={handleInterviewFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Interview Time</label>
                        <input
                            type="time"
                            name="interviewTime"
                            value={interviewForm.interviewTime}
                            onChange={handleInterviewFormChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Interview Mode</label>
                        <select
                            name="interviewMode"
                            value={interviewForm.interviewMode}
                            onChange={handleInterviewFormChange}
                            required
                        >
                            <option value="">Select Interview Mode</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                    </div>
                    {interviewForm.interviewMode === 'Online' && (
                        <div>
                            <label>Interview Link</label>
                            <input
                                type="url"
                                name="interviewLink"
                                placeholder="Video Call Link"
                                value={interviewForm.interviewLink}
                                onChange={handleInterviewFormChange}
                                required
                            />
                        </div>
                    )}
                    <button type="submit">Schedule Interview</button>
                </form>
            </div>

            {/* Scheduled Interviews Section */}
            <div>
                <h2>Scheduled Interviews</h2>
                {interviews.length === 0 ? (
                    <p>No interviews scheduled</p>
                ) : (
                    interviews.map((interview, index) => (
                        <div key={index}>
                            <h3>Interview for {interview.jobTitle}</h3>
                            <p>Candidate: {interview.name}</p>
                            <p>Date: {new Date(interview.interviewDate).toLocaleDateString()}</p>
                            <p>Time: {interview.interviewTime}</p>
                            <p>Mode: {interview.interviewMode}</p>
                            {interview.interviewLink && (
                                <p>
                                    Interview Link: 
                                    <a href={interview.interviewLink} target="_blank" rel="noopener noreferrer">
                                        Join Interview
                                    </a>
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Shortlisted Applications Section */}
            <div>
                <h2>ShortListed Applications</h2>
                {shortListedApplications.length === 0 ? (
                    <p>No shortlisted applications</p>
                ) : (
                    shortListedApplications.map((application, index) => (
                        <div key={index}>
                            <h3>ShortListed Application for {application.jobTitle}</h3>
                            <p>Application ID: {application.applicationID}</p>
                            <p>Student Name: {application.name}</p>
                            <p>Student ID: {application.studentID}</p>
                            <p>Job ID: {application.jobID}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Rejected Applications Section */}
            <div>
                <h2>Rejected Applications</h2>
                {rejectedApplications.length === 0 ? (
                    <p>No rejected applications</p>
                ) : (
                    rejectedApplications.map((application, index) => (
                        <div key={index}>
                            <h3>Rejected Application for {application.jobTitle}</h3>
                            <p>Application ID: {application.applicationID}</p>
                            <p>Student Name: {application.name}</p>
                            <p>Student ID: {application.studentID}</p>
                            <p>Job ID: {application.jobID}</p>
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