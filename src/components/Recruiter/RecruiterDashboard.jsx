import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardBody,
    Divider,
    Button,
    Spacer,
    Input,
    Textarea,
    Select,
    SelectItem,
  } from "@nextui-org/react";

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
    const [isEditMode, setIsEditMode] = useState(false);

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
            console.log(jobData)
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

    const updateInterviewStatus = async (applicationID, status) => {
        try {
            const token = localStorage.getItem("recruiterToken");
            const response = await axios.post(
                "http://localhost:3001/api/update-interview", 
                { applicationID, applicationStatus: status },
                { headers: { recruiterToken: token } }
            );
    
            alert(response.data.message);
            fetchInterviews();
            fetchJobApplications();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update interview status");
        }
    };


    useEffect(() => {
        fetchPostedJobs();
        fetchJobApplications();
        fetchAppliedResumes();
        fetchInterviews();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen flex-col space-y-10 py-20 bg-gray-900 text-white">
        {isEditMode ? (
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Post a New Job</h2>
                <form onSubmit={handlePostJob} className="space-y-4">
                    <Input
                    label="Job ID"
                    name="jobID"
                    placeholder="Unique Job ID"
                    value={jobData.jobID}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Input
                    label="Company Name"
                    name="companyName"
                    placeholder="Company Name"
                    value={jobData.companyName}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Input
                    label="Job Title"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={jobData.jobTitle}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Textarea
                    label="Job Description"
                    name="jobDescription"
                    placeholder="Job Description"
                    value={jobData.jobDescription}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Input
                    label="Job Location"
                    name="jobLocation"
                    placeholder="Job Location"
                    value={jobData.jobLocation}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Select
                    label="Location Type"
                    name="jobLocationType"
                    selectedKeys={jobData.jobLocationType ? [jobData.jobLocationType] : []}
                    onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        setJobData(prev => ({
                            ...prev,
                            jobLocationType: selectedValue
                        }));
                    }}
                    >
                    {['Remote', 'On-Site'].map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                    </Select>
                    <Input
                    label="Job Role"
                    name="jobRole"
                    placeholder="Job Role"
                    value={jobData.jobRole}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Select
                    label="Job Type"
                    name="jobType"
                    selectedKeys={jobData.jobType ? [jobData.jobType] : []}
                    onSelectionChange={(keys) => {
                        const selectedValue = Array.from(keys)[0];
                        setJobData(prev => ({
                            ...prev,
                            jobType: selectedValue
                        }));
                    }}
                    >
                    {['Full Time', 'Part Time', 'Internship'].map((type) => (
                        <SelectItem key={type} value={type}>
                            {type}
                        </SelectItem>
                    ))}
                    </Select>
                    <Input
                    label="Eligibility Criteria"
                    name="eligibilityCriteria"
                    placeholder="Eligibility Criteria"
                    value={jobData.eligibilityCriteria}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Input
                    label="Cost to Company (CTC)"
                    name="ctc"
                    placeholder="Cost to Company"
                    value={jobData.ctc}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Input
                    label="Last Date to Apply"
                    name="lastDateToApply"
                    type="date"
                    value={jobData.lastDateToApply}
                    onChange={handleJobDataChange}
                    required
                    fullWidth
                    />
                    <Button type="submit" color="primary" className="w-full">
                    Post Job
                    </Button>
                </form>
                <Spacer y={2} />
                <Button onClick={() => setIsEditMode(false)} color="danger" auto>
                    Cancel
                </Button>
                <Spacer y={2} />
                <Button onClick={() => navigate("/")} color="warning" auto>
                    Logout
                </Button>
                </CardBody>
            </Card>
        ) : (

            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                <h1 className="text-2xl font-bold text-white">Recruiter Dashboard</h1>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Post a New Job</h2>
                <Button onClick={() => setIsEditMode(true)} color="success" className="w-full">
                    Post a New Job
                </Button>
                <Spacer y={2} />
                <Button onClick={() => navigate("/")} color="warning" auto>
                    Logout
                </Button>
                </CardBody>
            </Card>
        )}
            {/* Posted Jobs Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Your Posted Jobs</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    {postedJobs.length === 0 ? (
                        <p className="text-white">No jobs posted yet</p>
                    ) : (
                        postedJobs.map((job, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl text-white">{job.jobTitle} at {job.companyName}</h3>
                                <p className="text-white">Job ID: {job.jobID}</p>
                                <p className="text-white">Job Role: {job.jobRole}</p>
                                <p className="text-white">Location: {job.jobLocation} ({job.jobLocationType})</p>
                                <p className="text-white">Job Type: {job.jobType}</p>
                                <p className="text-white">CTC: {job.ctc}</p>
                                <p className="text-white">Last Date to Apply: {new Date(job.lastDateToApply).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </CardBody>
            </Card>

            {/* Job Applications Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Job Applications</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    {jobApplications.length === 0 ? (
                        <p className="text-white">No applications received</p>
                    ) : (
                        jobApplications.map((application, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl text-white">Application for {application.jobTitle}</h3>
                                <p className="text-white">Application ID: {application.applicationID}</p>
                                <p className="text-white">Student Name: {application.name}</p>
                                <p className="text-white">Student ID: {application.studentID}</p>
                                <p className="text-white">Job ID: {application.jobID}</p>
                                <p className="text-white">Current Status: {application.applicationStatus}</p>
                                <div className="flex space-x-4 mt-4">
                                    <Button
                                        onClick={() => updateApplicationStatus(application.applicationID, 'Shortlisted')}
                                        disabled={application.applicationStatus === 'Shortlisted'}
                                        color="warning"
                                    >
                                        Shortlist
                                    </Button>
                                    <Button
                                        onClick={() => updateApplicationStatus(application.applicationID, 'Rejected')}
                                        disabled={application.applicationStatus === 'Rejected'}
                                        color="error"
                                    >
                                        Reject
                                    </Button>
                                    {appliedResumes.find(resume => resume.studentID === application.studentID) && (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    const resume = appliedResumes.find(r => r.studentID === application.studentID);
                                                    viewResume(resume._id);
                                                }}
                                                color="primary"
                                            >
                                                View Resume
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    const resume = appliedResumes.find(r => r.studentID === application.studentID);
                                                    downloadResume(resume._id);
                                                }}
                                                color="secondary"
                                            >
                                                Download Resume
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </CardBody>
            </Card>

            {/* Rejected Applications Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Rejected Applications</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    {rejectedApplications.length === 0 ? (
                        <p className="text-white">No applications rejected</p>
                    ) : (
                        rejectedApplications.map((application, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl text-white">Application for {application.jobTitle}</h3>
                                <p className="text-white">Application ID: {application.applicationID}</p>
                                <p className="text-white">Student Name: {application.name}</p>
                                <p className="text-white">Student ID: {application.studentID}</p>
                                <p className="text-white">Job ID: {application.jobID}</p>
                                <p className="text-white">Current Status: {application.applicationStatus}</p>
                            </div>
                        ))
                    )}
                </CardBody>
            </Card>

            {/* Interview Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Scheduled Interview</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    {interviews.length === 0 ? (
                        <p className="text-white">No interviews scheduled</p>
                    ) : (
                        interviews.map((interview, index) => (
                            <div key={index} className="mb-6">
                                <h3 className="text-xl text-white">Interview for {interview.jobTitle}</h3>
                                <p className="text-white">Application ID: {interview.applicationID}</p>
                                <p className="text-white">Interview Date: {new Date(interview.interviewDate).toLocaleDateString()}</p>
                                <p className="text-white">Interview Time: {interview.interviewTime}</p>
                                <p className="text-white">Interview Mode: {interview.interviewMode}</p>
                                {interview.interviewMode === 'Online' && (
                                    <p className="text-white">Interview Link: <a href={interview.interviewLink} target="_blank" rel="noreferrer">Join Interview</a></p>
                                )}
                            </div>
                        ))
                    )}
                </CardBody>
            </Card>

            {/* Interview Modifying Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Scheduled Interview</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                
                {interviews.map((interview, index) => (
                    <CardBody className="p-6">
                    <div key={index} className="mb-6">
                        <h3 className="text-xl text-white">Interview for {interview.jobTitle}</h3>
                        <p className="text-white">Application ID: {interview.applicationID}</p>
                        <p className="text-white">Student Name: {interview.name}</p>
                        <p className="text-white">Interview Date: {new Date(interview.interviewDate).toLocaleDateString()}</p>
                        <p className="text-white">Interview Time: {interview.interviewTime}</p>
                        <p className="text-white">Interview Mode: {interview.interviewMode}</p>
                        <p className="text-white">Current Status: {interview.applicationStatus}</p>
                        {interview.interviewMode === 'Online' && (
                            <p className="text-white">Interview Link: <a href={interview.interviewLink} target="_blank" rel="noreferrer">Join Interview</a></p>
                        )}
                        
                        {/* Add status update buttons */}
                        {interview.applicationStatus !== 'Accepted' && (
                            <Button
                                onClick={() => updateInterviewStatus(interview.applicationID, 'Accepted')}
                                color="success"
                                className="mr-2 mt-2"
                            >
                                Accept Candidate
                            </Button>
                        )}
                        {interview.applicationStatus !== 'Rejected' && (
                            <Button
                                onClick={() => updateInterviewStatus(interview.applicationID, 'Rejected')}
                                color="error"
                                className="mt-2"
                            >
                                Reject Candidate
                            </Button>
                        )}
                    </div>
                    </CardBody>
                ))}
            </Card>

            {/* Interview Scheduling Section */}
            <Card className="max-w-4xl w-full bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                    <h2 className="text-2xl font-bold text-white">Schedule Interview</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="p-6">
                    <form onSubmit={scheduleInterview} className="space-y-4">
                        <div>
                            <label className="text-white">Shortlisted Application</label>
                            <select
                                name="applicationID"
                                value={interviewForm.applicationID}
                                onChange={handleInterviewFormChange}
                                className="bg-amber-900 text-white p-2 rounded w-full"
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
                            <label className="text-white">Interview Date</label>
                            <input
                                type="date"
                                name="interviewDate"
                                value={interviewForm.interviewDate}
                                onChange={handleInterviewFormChange}
                                className="bg-amber-900 text-white p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-white">Interview Time</label>
                            <input
                                type="time"
                                name="interviewTime"
                                value={interviewForm.interviewTime}
                                onChange={handleInterviewFormChange}
                                className="bg-amber-900 text-white p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-white">Interview Mode</label>
                            <select
                                name="interviewMode"
                                value={interviewForm.interviewMode}
                                onChange={handleInterviewFormChange}
                                className="bg-amber-900 text-white p-2 rounded w-full"
                                required
                            >
                                <option value="">Select Interview Mode</option>
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                        {interviewForm.interviewMode === 'Online' && (
                            <div>
                                <label className="text-white">Interview Link</label>
                                <input
                                    type="url"
                                    name="interviewLink"
                                    placeholder="Video Call Link"
                                    value={interviewForm.interviewLink}
                                    onChange={handleInterviewFormChange}
                                    className="bg-amber-900 text-white p-2 rounded w-full"
                                    required
                                />
                            </div>
                        )}
                        <Button type="submit" color="success" className="w-full">Schedule Interview</Button>
                    </form>
                </CardBody>
            </Card>

            {/* Logout Button */}
            <Button onClick={()=>navigate('/recruiter/profile')} color="primary" >
                Profile
            </Button>
            <Button onClick={handleLogout} color="warning" >
                Logout
            </Button>
        </div>
    );
};

export default RecruiterDashboard;