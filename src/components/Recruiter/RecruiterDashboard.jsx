import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Card,
    Chip,
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
  import { FaBuilding, FaSignOutAlt } from "react-icons/fa";
  import { Avatar } from "@nextui-org/react";
  import { MdWorkHistory } from "react-icons/md";
import RecruiterQuiz from "./RecruiterProfile/RecruiterQuiz";
import RecruiterQuizResult from "./RecruiterProfile/RecruiterQuizResult";


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
    const [acceptedApplications, setAcceptedApplications] = useState([]);
    const [shortListedApplications, setShortListedApplications] = useState([]);
    const [jobApplications, setJobApplications] = useState([]);
    const [appliedResumes, setAppliedResumes] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingQuiz, setIsAddingQuiz] = useState(false);

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
            const acceptedApplications = response.data.filter(
                app => app.applicationStatus === 'Hired'
            );
            setAcceptedApplications(acceptedApplications);
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
        <div className="bg-gray-900 min-h-screen py-20 p-6 text-white">
            <Card className="max-w-7xl mx-auto bg-amber-900/70 border border-amber-500/20 text-white">
                <CardHeader className="flex justify-between items-center bg-amber-800/70 py-4 px-6">
                    <div className="flex items-center gap-3">
                        <FaBuilding className="text-2xl text-orange-400" />
                        <h1 className="text-2xl font-semibold">Recruiter Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            color="success" 
                            onClick={() => navigate("/recruiter/profile")}
                            startContent={<Avatar className="w-6 h-6" />}
                        >
                            Profile
                        </Button>
                        <Button 
                            color="danger" 
                            variant="solid" 
                            onClick={handleLogout}
                            startContent={<FaSignOutAlt />}
                        >
                            Logout
                        </Button>
                    </div>
                </CardHeader>

                <Divider className="bg-amber-500/20" />
                <CardBody className="space-y-6 p-6">
                {/* Post a New Job Section */}
                {isEditMode ? (
                <Card className="max-w-3xl ml-[20%] bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex justify-between items-center bg-amber-950/50 py-4 px-6">
                <MdWorkHistory className="text-2xl text-orange-400" />
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
                </CardBody>
            </Card>
        ) : (

            <Card className="max-w-xl bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center bg-amber-950/50">
                <h2 className="font-semibold text-white">New Job</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="">
                <h2 className="text-sm font-semibold mb-3 text-white">Post a New Job</h2>
                <Button onClick={() => setIsEditMode(true)} color="warning" className="w-1/6">
                    Job
                </Button>
                </CardBody>
            </Card>
        )}
        
            {/*Add Quiz Section */}
            <Card className="max-w-2xl bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center bg-amber-950/50">
                    <h2 className="font-semibold text-white">Add Quiz</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="">
                {isAddingQuiz ? (   
                    <RecruiterQuiz
                        jobs={postedJobs}
                        token={localStorage.getItem("recruiterToken")}
                        setIsAddingQuiz={setIsAddingQuiz}
                    />
                ) : (
                    <>
                    <h2 className="text-sm font-semibold mb-3 text-white">Add a New Quiz</h2>
                    <Button onClick={() => setIsAddingQuiz(true)} color="warning" className="w-1/6">
                        Quiz
                    </Button>
                    </>
                )}
                </CardBody>
            </Card>

            {/* Posted Jobs Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Your Posted Jobs</h2>
                </CardHeader>
                <CardBody>
                    {postedJobs.length === 0 ? (
                        <p className="text-white">No jobs posted yet</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                        {postedJobs.map((job) => (
                            <Card 
                                key={job.jobTitle} 
                                className="bg-amber-950/50 border border-amber-500/20"
                            >
                            <CardBody className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold text-orange-400">{job.jobTitle} at {job.companyName}</h3>
                                <Chip 
                                    color="primary" 
                                    size="sm" 
                                    variant="solid"
                                    className="bg-orange-600/50"
                                >
                                    {job.jobRole}
                                </Chip>
                            </div>
                                <p className="text-white"><strong>Job ID:</strong> {job.jobID}</p>
                                <p className="text-white"><strong>Location:</strong> {job.jobLocation} ({job.jobLocationType})</p>
                                <p className="text-white"><strong>Job Type:</strong> {job.jobType}</p>
                                <p className="text-white"><strong>CTC:</strong> {job.ctc}</p>
                                <p className="text-white"><strong>Last Date to Apply:</strong> {new Date(job.lastDateToApply).toLocaleDateString()}</p>
                            </CardBody>
                            </Card>
                        ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Quiz Results Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Quiz Results</h2>
                </CardHeader>
                <CardBody>
                    {postedJobs.length === 0 ? (
                        <p className="text-white">No quiz results yet</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {postedJobs.map((job) => (
                                <Card
                                    key={job.jobID}
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400">{job.jobTitle} at {job.companyName}</h3>
                                            <Chip color="primary" size="sm" variant="solid" className="bg-orange-600/50">
                                                {job.jobRole}
                                            </Chip>
                                        </div>
                                        <RecruiterQuizResult 
                                            job={job} 
                                        />
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Job Applications Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Job Applications</h2>
                </CardHeader>
                <CardBody className="">
                    {jobApplications.length === 0 ? (
                        <p className="text-white">No applications received</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {jobApplications.map((application) => (
                                <Card 
                                    key={application.applicationID} 
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400">{application.name}</h3>
                                            <Chip 
                                                color={
                                                    application.applicationStatus === 'Applied' ? 'primary' : 
                                                    application.applicationStatus === 'Shortlisted' ? 'success' : 
                                                    application.applicationStatus === 'Rejected' ? 'danger' : 'default'
                                                }
                                                variant="solid"
                                            >
                                                {application.applicationStatus}
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Job Title:</strong> {application.jobTitle}</p>
                                        <p className="text-white"><strong>Application ID:</strong> {application.applicationID}</p>
                                        <p className="text-white"><strong>Student ID:</strong> {application.studentID}</p>
                                        <p className="text-white"><strong>Job ID:</strong> {application.jobID}</p>
                                        <div className="flex space-x-4 mt-4">
                                            <Button
                                                onClick={() => updateApplicationStatus(application.applicationID, 'Shortlisted')}
                                                disabled={application.applicationStatus === 'Shortlisted'}
                                                color="secondary"
                                            >
                                                Shortlist
                                            </Button>
                                            <Button
                                                onClick={() => updateApplicationStatus(application.applicationID, 'Rejected')}
                                                disabled={application.applicationStatus === 'Rejected'}
                                                color="danger"
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
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Shortlisted Applications Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Shortlisted Applications</h2>
                </CardHeader>
                <CardBody className="">
                    {shortListedApplications.length === 0 ? (
                        <p className="text-white">No applications shortlisted</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {shortListedApplications.map((application) => (
                                <Card
                                    key={application.applicationID}
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400">{application.name}</h3>
                                            <Chip color="success" variant="solid">
                                                Shortlisted
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Job Title:</strong> {application.jobTitle}</p>
                                        <p className="text-white"><strong>Application ID:</strong> {application.applicationID}</p>
                                        <p className="text-white"><strong>Student ID:</strong> {application.studentID}</p>
                                        <p className="text-white"><strong>Job ID:</strong> {application.jobID}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Scheduled Interviews Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Scheduled Interviews</h2>
                </CardHeader>
                <CardBody className="">
                    {interviews.length === 0 ? (
                        <p className="text-white">No interviews scheduled</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {interviews.map((interview) => (
                                <Card 
                                    key={interview.applicationID} 
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400 text-lg">{interview.name}</h3>
                                            <Chip 
                                                color={
                                                    interview.applicationStatus === 'Interview' ? 'warning' : 
                                                    interview.applicationStatus === 'Accepted' ? 'success' : 
                                                    interview.applicationStatus === 'Rejected' ? 'danger' :
                                                    interview.applicationStatus === 'Shortlisted' ? 'primary' :
                                                    'default'
                                                }
                                                variant="solid"
                                            >
                                                {interview.applicationStatus}
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Job Title:</strong> {interview.jobTitle}</p>
                                        <p className="text-white"><strong>Application ID:</strong> {interview.applicationID}</p>
                                        <p className="text-white"><strong>Interview Date:</strong> {new Date(interview.interviewDate).toLocaleDateString()}</p>
                                        <p className="text-white"><strong>Interview Time:</strong> {interview.interviewTime}</p>
                                        <p className="text-white"><strong>Interview Mode:</strong> {interview.interviewMode}</p>
                                        {interview.interviewMode === 'Online' && (
                                            <p className="text-white"><strong>Interview Link:</strong> <a href={interview.interviewLink} target="_blank" rel="noreferrer">Join Interview</a></p>
                                        )}
                                        
                                        <div className="flex space-x-4 mt-4">
                                        {interview.applicationStatus === 'Shortlisted' && (
                                            <div className="flex space-x-4 mt-4">
                                            <Button
                                                onClick={() => updateInterviewStatus(interview.applicationID, 'Interview')}
                                                color="primary"
                                                className="mr-2"
                                            >
                                                Schedule Interview
                                            </Button>
                                            </div>
                                        )}

                                        {interview.applicationStatus === 'Interview' && (
                                            <div className="flex space-x-4 mt-4">
                                            <Button
                                                onClick={() => updateInterviewStatus(interview.applicationID, 'Accepted')}
                                                color="success"
                                                className="mr-2"
                                            >
                                                Hire Candidate
                                            </Button>
                                            <Button
                                                onClick={() => updateInterviewStatus(interview.applicationID, 'Rejected')}
                                                color="danger"
                                            >
                                                Reject Candidate
                                            </Button>
                                            </div>
                                        )}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Interview Scheduling Section */}
            <Card className="max-w-xl bg-amber-900 border border-amber-500/20 mt-8">
                <CardHeader className="flex items-center bg-amber-950/50 gap-2">
                    <h2 className="font-semibold text-white">Schedule Interview</h2>
                </CardHeader>
                <Divider className="bg-amber-500/20" />
                <CardBody className="">
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
                                    <>
                                    <option key={index} value={app.applicationID}>
                                        {app.name} - {app.applicationID} - {app.jobTitle}
                                    </option>
                                    </>
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
                        <Button type="submit" color="default" variant="solid" className="w-1/4">Schedule Interview</Button>
                    </form>
                </CardBody>
            </Card>

            {/* Accepted Applications Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Accepted Applications</h2>
                </CardHeader>
                <CardBody className="">
                    {acceptedApplications.length === 0 ? (
                        <p className="text-white">No applications accepted</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {acceptedApplications.map((application) => (
                                <Card
                                    key={application.applicationID}
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400">{application.name}</h3>
                                            <Chip color="success" variant="solid">
                                                Hired
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Job Title:</strong> {application.jobTitle}</p>
                                        <p className="text-white"><strong>Application ID:</strong> {application.applicationID}</p>
                                        <p className="text-white"><strong>Student ID:</strong> {application.studentID}</p>
                                        <p className="text-white"><strong>Job ID:</strong> {application.jobID}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Rejected Applications Section */}
            <Card className="bg-amber-900 border border-amber-500/20">
                <CardHeader className="flex items-center gap-2">
                    <h2 className="font-semibold text-white">Rejected Applications</h2>
                </CardHeader>
                <CardBody className="">
                    {rejectedApplications.length === 0 ? (
                        <p className="text-white">No applications rejected</p>
                    ) : (
                        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                            {rejectedApplications.map((application) => (
                                <Card 
                                    key={application.applicationID} 
                                    className="bg-amber-950/50 border border-amber-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-orange-400 text-lg">{application.name}</h3>
                                            <Chip color="danger" variant="solid">
                                                Rejected
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Job Title:</strong> {application.jobTitle}</p>
                                        <p className="text-white"><strong>Application ID:</strong> {application.applicationID}</p>
                                        <p className="text-white"><strong>Student ID:</strong> {application.studentID}</p>
                                        <p className="text-white"><strong>Job ID:</strong> {application.jobID}</p>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>
            
            </CardBody>
        </Card>
        </div>
    );
};

export default RecruiterDashboard;