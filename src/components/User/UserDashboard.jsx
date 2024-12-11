import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Select, 
  SelectItem,
  Divider,
  Chip,
  Avatar
} from "@nextui-org/react";
import {  
  FaSignOutAlt, 
  FaBriefcase, 
  FaFilter,
  FaAddressCard
} from "react-icons/fa";
import UserQuiz from "../User/UserProfile/UserQuiz";
import { FcStatistics } from "react-icons/fc";
import { MdAddBusiness } from "react-icons/md";
import { FaBusinessTime } from "react-icons/fa6";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { HiCheckCircle } from "react-icons/hi";
import { HiBan } from "react-icons/hi";

const UserDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [shortlistedJobs, setShortlistedJobs] = useState([]);
    const [acceptedJobs, setAcceptedJobs] = useState([]);
    const [rejectedJobs, setRejectedJobs] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedJobRole, setSelectedJobRole] = useState("");
    const [scheduledInterviews, setScheduledInterviews] = useState([]);
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const [selectedJobForQuiz, setSelectedJobForQuiz] = useState(null);

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

    const applyJob = async (jobID, quizPassed = false) => {
        try {
            const token = localStorage.getItem("token");
            if (!quizPassed) {
                try {
                    const quizResponse = await axios.get(
                        `http://localhost:3001/api/getQuiz/${jobID}`,
                        { headers: { token } }
                    );

                    if (quizResponse.data) {
                        setSelectedJobForQuiz(jobID);
                        setIsQuizModalOpen(true);
                        return;
                    }
                } catch (quizErr) {
                    if (quizErr.response?.status !== 404) {
                        alert("Error checking job quiz");
                        return;
                    }
                }
            }

            const response = await axios.post(
                "http://localhost:3001/api/applyJob", 
                { jobID: jobID },
                { headers: { token: token } }
            );
            
            alert(response.data.message);
            fetchAppliedJobs();
        }
        catch (err) {
            console.error("Job Application Error:", err);
            alert(err.response?.data?.message || "Failed to Apply");
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const token = localStorage.getItem("token");
            const appliedJobs = await axios.get("http://localhost:3001/api/appliedJobs", 
                { headers: { token: token } }
            );
            const shortlistedJobs = appliedJobs.data.filter(job => job.applicationStatus === "Shortlisted");
            const acceptedJobs = appliedJobs.data.filter(job => job.applicationStatus === "Hired");
            const rejectedJobs = appliedJobs.data.filter(job => job.applicationStatus === "Rejected");
            setShortlistedJobs(shortlistedJobs);
            setAcceptedJobs(acceptedJobs);
            setRejectedJobs(rejectedJobs);
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

    const fetchScheduledInterviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3001/api/user-interviews", 
                { headers: { token: token } }
            );
            
            setScheduledInterviews(response.data);
        }
        catch (err) {
            console.log(err.response?.data?.message || "Failed to fetch scheduled interviews");
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchAppliedJobs();
        fetchScheduledInterviews();
    }, []);

    return (
        <div className="bg-gray-900 py-20 min-h-screen p-6 text-white">
            <Card className="max-w-7xl mx-auto bg-blue-950 border border-blue-500/20 text-white">
                <CardHeader className="flex justify-between items-center bg-blue-900/50 py-4 px-6">
                    <div className="flex items-center gap-3">
                        <FaAddressCard className="text-2xl text-cyan-400" />
                        <h1 className="text-2xl font-semibold">User Dashboard</h1>
                    </div>
                    <div className="flex gap-4">
                        <Button 
                            color="success" 
                            onClick={() => navigate("/user/profile")}
                            startContent={<Avatar className="w-6 h-6"/>}
                        >
                            Profile
                        </Button>
                        <Button
                            auto
                            color="warning"
                            onClick={() => navigate("/user/statistics")}
                            startContent={<FcStatistics />}
                        >
                            Statistics
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

                <Divider className="bg-blue-500/20" />
                <CardBody className="space-y-6 p-6">
                    {/* Job Filtering Section */}
                    <Card className="max-w-xl bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <FaFilter className="text-cyan-400" />
                            <h2 className="font-semibold text-white">Filter Jobs</h2>
                        </CardHeader>
                        <CardBody>
                            <Select
                                label="Filter by Job Role"
                                variant="flat"
                                color="default"
                                selectedKeys={new Set([selectedJobRole])}
                                onSelectionChange={(keys) => handleJobRoleFilter(Array.from(keys)[0])}
                                className="max-w-xs"
                            >
                                <SelectItem key="" textValue="All Roles">
                                    All Roles
                                </SelectItem>
                                {getUniqueJobRoles().map((role) => (
                                    <SelectItem key={role} textValue={role}>
                                        {role}
                                    </SelectItem>
                                ))}
                            </Select>
                        </CardBody>
                    </Card>

                    {/* Available Jobs Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <MdAddBusiness className="text-xl text-cyan-400" />
                            <h2 className="font-semibold text-white">
                                Available Jobs {selectedJobRole && `(${selectedJobRole})`}
                            </h2>
                        </CardHeader>
                        <CardBody className="">
                            {filteredApplications.length === 0 ? (
                                <p className="text-gray-400">No jobs available</p>
                            ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredApplications.map((job) => (
                                <Card 
                                    key={job.jobID} 
                                    className="bg-blue-950 border border-blue-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <h3 className="font-bold text-cyan-400">{job.jobTitle}</h3>
                                            <Chip 
                                                color="primary" 
                                                size="sm" 
                                                variant="solid" 
                                                className="bg-cyan-600/50"
                                            >
                                                {job.jobRole}
                                            </Chip>
                                        </div>
                                        <p className="text-white"><strong>Company:</strong> {job.companyName}</p>
                                        <p className="text-white"><strong>Location:</strong> {job.jobLocation}</p>
                                        <p className="text-white"><strong>CTC:</strong> {job.ctc}</p>
                                        <Button
                                            color="primary"
                                            variant="solid"
                                            fullWidth
                                            onClick={() => applyJob(job.jobID)}
                                            isDisabled={isJobApplied(job.jobID)}
                                        >
                                            {isJobApplied(job.jobID) ? 'Applied' : 'Apply'}
                                        </Button>
                                    </CardBody>
                                </Card>
                                ))}
                            </div>
                            )}
                        </CardBody>
                    </Card>

                    <UserQuiz 
                        isOpen={isQuizModalOpen}
                        onOpenChange={setIsQuizModalOpen}
                        jobID={selectedJobForQuiz}
                        token={localStorage.getItem("token")}
                        onQuizComplete={(result) => {                            
                            if (result.passed === true) {
                                applyJob(selectedJobForQuiz, true);
                            } else {
                                alert(`Quiz Failed. Your score: ${result.score}/${result.totalMarks} (${result.percentage}%)`);
                            }
                            setIsQuizModalOpen(false);
                        }}
                    />

                    {/* Applied Jobs Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <FaBriefcase className="text-cyan-400" />
                            <h2 className="font-semibold text-cyan-400">Applied Jobs</h2>
                        </CardHeader>
                        <CardBody className="">
                            {appliedJobs
                            .filter(job => job.applicationStatus === "Applied")
                            .length === 0 ? (
                                <p className="text-gray-400">No jobs applied</p>
                            ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {appliedJobs
                            .filter(job => job.applicationStatus === "Applied")
                            .map((job) => (
                                <Card 
                                    key={job.applicationID} 
                                    className="bg-blue-950 border border-blue-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <h3 className="font-bold text-cyan-400">{job.jobTitle}</h3>
                                        <p className="text-white"><strong>Company:</strong> {job.companyName}</p>
                                        <Chip 
                                            color="primary" 
                                            size="sm" 
                                            variant="solid"
                                        >
                                            {job.applicationStatus}
                                        </Chip>
                                        <p className="text-white">Applied on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </CardBody>
                                </Card>
                                ))}
                            </div>
                        )}
                        </CardBody>
                    </Card>

                    {/* Shortlisted Jobs Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <FaBusinessTime className="text-xl text-cyan-400" />
                            <h2 className="font-semibold text-cyan-400">Shortlisted Jobs</h2>
                        </CardHeader>
                        <CardBody className="">
                            {shortlistedJobs.length === 0 ? (
                                <p className="text-gray-400">No jobs shortlisted</p>
                            ):(
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {shortlistedJobs.map((job) => (
                                <Card
                                    key={job.applicationID}
                                    className="bg-blue-950 border border-blue-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <h3 className="font-bold text-cyan-400">{job.jobTitle}</h3>
                                        <p className="text-white"><strong>Company:</strong> {job.companyName}</p>
                                        <Chip
                                            color="warning"
                                            size="sm"
                                            variant="solid"
                                        >
                                            {job.applicationStatus}
                                        </Chip>
                                        <p className="text-white">Applied on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                    </CardBody>
                                </Card>
                            ))}
                            </div>
                        )}
                        </CardBody>
                    </Card>

                    {/* Scheduled Interviews Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <RiCalendarScheduleFill className="text-xl text-cyan-400" />
                            <h2 className="font-semibold text-cyan-400">Scheduled Interviews</h2>
                        </CardHeader>
                        <CardBody>
                            {scheduledInterviews
                            .filter(job=>job.applicationStatus === "Shortlisted")
                            .length === 0 ? (
                                <p className="text-gray-400">No interviews scheduled</p>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {scheduledInterviews
                                    .filter(job=> job.applicationStatus === "Shortlisted")
                                    .map((interview) => (
                                        <Card 
                                            key={interview.jobTitle} 
                                            className="bg-blue-950 border border-blue-500/20"
                                        >
                                            <CardBody className="space-y-2">
                                                <h3 className="font-bold text-cyan-400">{interview.jobTitle}</h3>
                                                <p className="text-white"><strong>Company:</strong> {interview.companyName}</p>
                                                <p className="text-white"><strong>Date:</strong> {new Date(interview.interviewDate).toLocaleDateString()}</p>
                                                <p className="text-white"><strong>Time:</strong> {interview.interviewTime}</p>
                                                <p className="text-white"><strong>Application Status:</strong> {interview.applicationStatus}</p>
                                                <Chip 
                                                    color="warning" 
                                                    size="sm" 
                                                    variant="solid"
                                                >
                                                    {interview.interviewMode}
                                                </Chip>
                                                {interview.interviewLink && (
                                                    <Button
                                                        as="a"
                                                        href={interview.interviewLink}
                                                        target="_blank"
                                                        color="primary"
                                                        variant="solid"
                                                        className="w-1/4 mx-auto"
                                                    >
                                                        Join Interview
                                                    </Button>
                                                )}
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Accepted Jobs Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <HiCheckCircle className="text-xl text-cyan-400" />
                            <h2 className="font-semibold text-cyan-400">Accepted Jobs</h2>
                        </CardHeader>
                        <CardBody className="">
                            {acceptedJobs.length === 0 ? (
                                <p className="text-gray-400">No jobs accepted</p>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {acceptedJobs.map((job) => (
                                        <Card
                                            key={job.applicationID}
                                            className="bg-blue-950 border border-blue-500/20"
                                        >
                                            <CardBody className="space-y-2">
                                                <h3 className="font-bold text-cyan-400">{job.jobTitle}</h3>
                                                <p className="text-white"><strong>Company:</strong> {job.companyName}</p>
                                                <Chip
                                                    color="success"
                                                    size="sm"
                                                    variant="solid"
                                                >
                                                    {job.applicationStatus}
                                                </Chip>
                                                <p className="text-white">Applied on: {new Date(job.createdAt).toLocaleDateString()}</p>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardBody>
                    </Card>

                    {/* Rejected Jobs Section */}
                    <Card className="bg-blue-900/50 border border-blue-500/20">
                        <CardHeader className="flex items-center gap-2">
                            <HiBan className="text-xl text-cyan-400" />
                            <h2 className="font-semibold text-cyan-400">Rejected Jobs</h2>
                        </CardHeader>
                        <CardBody className="">
                            {rejectedJobs.length === 0 ? (
                                <p className="text-gray-400">No jobs rejected</p>
                            ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rejectedJobs.map((job) => (
                                <Card
                                    key={job.applicationID}
                                    className="bg-blue-950 border border-blue-500/20"
                                >
                                    <CardBody className="space-y-2">
                                        <h3 className="font-bold text-cyan-400">{job.jobTitle}</h3>
                                        <p className="text-white"><strong>Company:</strong> {job.companyName}</p>
                                        <Chip
                                            color="danger"
                                            size="sm"
                                            variant="solid"
                                        >
                                            {job.applicationStatus}
                                        </Chip>
                                        <p className="text-white">Applied on: {new Date(job.createdAt).toLocaleDateString()}</p>
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
    )
};

export default UserDashboard;