import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardBody, Spinner } from '@nextui-org/react';
import { FaChartBar } from 'react-icons/fa';
import  { Button, Avatar, Divider } from "@nextui-org/react";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaBuilding } from "react-icons/fa";

const RecruiterGraph = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
        localStorage.removeItem("recruiterToken");
        navigate("/");
    };

  const [jobStatistics, setJobStatistics] = useState({
    appliedJobs: [],
    shortlistedJobs: [],
    acceptedJobs: [],
    rejectedJobs: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobStatistics = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('recruiterToken');

        const appliedJobsResponse = await axios.get(
          'http://backend:3001/api/jobApplications',
          { headers: { recruiterToken: token } }
        );

        const jobData = appliedJobsResponse.data;

        const statistics = {
          appliedJobs: jobData.filter(job => job.applicationStatus === 'Applied'),
          shortlistedJobs: jobData.filter(job => job.applicationStatus === 'Shortlisted'),
          acceptedJobs: jobData.filter(job => job.applicationStatus === 'Hired'),
          rejectedJobs: jobData.filter(job => job.applicationStatus === 'Rejected')
        };

        setJobStatistics(statistics);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching job statistics:', err.message);
        setError('Failed to fetch job statistics. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchJobStatistics();
  }, []);

  // Prepare data for the stacked bar chart
  const jobStatusData = [
    {
      status: 'Applied',
      applied: jobStatistics.appliedJobs.length,
      shortlisted: jobStatistics.shortlistedJobs.filter(job => job.applicationStatus === 'Applied').length,
      hired: jobStatistics.acceptedJobs.filter(job => job.applicationStatus === 'Applied').length,
      rejected: jobStatistics.rejectedJobs.filter(job => job.applicationStatus === 'Applied').length
    },
    {
      status: 'Shortlisted',
      applied: jobStatistics.appliedJobs.filter(job => job.applicationStatus === 'Shortlisted').length,
      shortlisted: jobStatistics.shortlistedJobs.length,
      hired: jobStatistics.acceptedJobs.filter(job => job.applicationStatus === 'Shortlisted').length,
      rejected: jobStatistics.rejectedJobs.filter(job => job.applicationStatus === 'Shortlisted').length
    },
    {
      status: 'Hired',
      applied: jobStatistics.appliedJobs.filter(job => job.applicationStatus === 'Hired').length,
      shortlisted: jobStatistics.shortlistedJobs.filter(job => job.applicationStatus === 'Hired').length,
      hired: jobStatistics.acceptedJobs.length,
      rejected: jobStatistics.rejectedJobs.filter(job => job.applicationStatus === 'Hired').length
    },
    {
      status: 'Rejected',
      applied: jobStatistics.appliedJobs.filter(job => job.applicationStatus === 'Rejected').length,
      shortlisted: jobStatistics.shortlistedJobs.filter(job => job.applicationStatus === 'Rejected').length,
      hired: jobStatistics.acceptedJobs.filter(job => job.applicationStatus === 'Rejected').length,
      rejected: jobStatistics.rejectedJobs.length
    }
  ];

  if (isLoading) {
    return (
    <Card className="max-w-7xl mx-auto bg-amber-900/70 border border-amber-500/20 text-white">
    <CardHeader className="flex justify-between items-center bg-amber-800/70 py-4 px-6">
        <div className="flex items-center gap-3">
            <FaBuilding className="text-2xl text-orange-400" />
            <h1 className="text-2xl font-semibold">Recruiter Statistics</h1>
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
                color="warning"
                variant="solid"
                onClick={() => navigate("/recruiter/dashboard")}
                startContent={<MdDashboard />}
            >
                Dashboard
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
      <Card className="bg-amber-900 border border-amber-500/20 flex items-center justify-center">
        <CardBody className="flex flex-col items-center justify-center">
          <Spinner color="primary" />
          <p className="text-white mt-4">Loading job statistics...</p>
        </CardBody>
      </Card>
    </Card>

    );
  }

  if (error) {
    return (
    <Card className="max-w-7xl mx-auto bg-amber-900/70 border border-amber-500/20 text-white">
    <CardHeader className="flex justify-between items-center bg-amber-800/70 py-4 px-6">
        <div className="flex items-center gap-3">
            <FaBuilding className="text-2xl text-orange-400" />
            <h1 className="text-2xl font-semibold">Recruiter Statistics</h1>
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
                color="warning"
                variant="solid"
                onClick={() => navigate("/recruiter/dashboard")}
                startContent={<MdDashboard />}
            >
                Dashboard
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
      <Card className="bg-amber-900 border border-amber-500/20">
        <CardBody>
          <p className="text-red-500">{error}</p>
        </CardBody>
      </Card>
    </Card>
    );
  }


  return (
    <Card className="max-w-7xl mx-auto bg-amber-900/70 border border-amber-500/20 text-white">
    <CardHeader className="flex justify-between items-center bg-amber-800/70 py-4 px-6">
        <div className="flex items-center gap-3">
            <FaBuilding className="text-2xl text-orange-400" />
            <h1 className="text-2xl font-semibold">Recruiter Statistics</h1>
        </div>
        <div className="flex gap-4">
            <Button 
                color="success" 
                onClick={() => navigate("/recruiter/profile")}
                startContent={<Avatar className="w-6 h-6"/>}
            >
                Profile
            </Button>
            <Button
                color="warning"
                onClick={() => navigate("/recruiter/dashboard")}
                startContent={<MdDashboard />}
            >
                Dashboard
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
    <Card className="bg-amber-900 border border-amber-500/20">
      <CardHeader className="flex items-center gap-2">
        <FaChartBar className="text-orange-400" />
        <h2 className="font-semibold text-white">Job Application Statistics</h2>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobStatusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
            <XAxis dataKey="status" tick={{ fill: 'white' }} axisLine={{ stroke: 'white' }} />
            <YAxis tick={{ fill: 'white' }} axisLine={{ stroke: 'white' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e3a8a',
                color: 'white',
                borderRadius: '8px'
              }}
              itemStyle={{ color: 'white' }}
            />
            <Legend
              wrapperStyle={{ color: 'white' }}
              formatter={(value) => <span className="text-white">{value}</span>}
            />
            <Bar dataKey="applied" name="Applied" fill="#3b82f6" stackId="a" barSize={65}/>
            <Bar dataKey="shortlisted" name="Shortlisted" fill="#f59e0b" stackId="a" barSize={65}/>
            <Bar dataKey="hired" name="Hired" fill="#10b981" stackId="a" barSize={65}/>
            <Bar dataKey="rejected" name="Rejected" fill="#ef4444" stackId="a" barSize={65}/>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#3b82f6' }}>
            <span className="text-white">Applied</span>
            <span className="font-bold text-white">{jobStatistics.appliedJobs.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#f59e0b' }}>
            <span className="text-white">Shortlisted</span>
            <span className="font-bold text-white">{jobStatistics.shortlistedJobs.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#10b981' }}>
            <span className="text-white">Hired</span>
            <span className="font-bold text-white">{jobStatistics.acceptedJobs.length}</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded" style={{ backgroundColor: '#ef4444' }}>
            <span className="text-white">Rejected</span>
            <span className="font-bold text-white">{jobStatistics.rejectedJobs.length}</span>
          </div>
        </div>
      </CardBody>
    </Card>
    </CardBody>
    </Card>
  );
};

export default RecruiterGraph;