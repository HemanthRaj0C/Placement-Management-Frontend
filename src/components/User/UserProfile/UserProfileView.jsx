import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Chip, 
  Link 
} from "@nextui-org/react";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaGraduationCap, 
  FaBook, 
  FaBriefcase, 
  FaCode, 
  FaLink,
  FaAddressCard
} from "react-icons/fa"; 

const ProfileDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <div className="text-sm text-gray-400">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const UserProfileView = ({ userProfile, onEditProfile }) => {
  return (
    <Card className="bg-blue-950 text-white border border-blue-500/20 max-w-4xl mx-auto">
      <CardHeader className="flex justify-between items-center bg-blue-900/50 py-4 px-6">
        <div className="flex gap-3 items-center">
          <FaAddressCard className="text-2xl text-cyan-400" />
          <h2 className="text-xl font-semibold">Profile Details</h2>
        </div>
        <button 
          onClick={onEditProfile}
          className="bg-cyan-600/50 hover:bg-cyan-600/70 text-white px-4 py-2 rounded-md transition-all"
        >
          Edit Profile
        </button>
      </CardHeader>
      <Divider className="bg-blue-500/20" />
      <CardBody className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <ProfileDetail 
            icon={<FaUser className="text-cyan-400" />} 
            label="Name" 
            value={`${userProfile.firstName} ${userProfile.lastName}`} 
          />
          <ProfileDetail 
            icon={<FaEnvelope className="text-cyan-400" />} 
            label="Email" 
            value={userProfile.email} 
          />
          <ProfileDetail 
            icon={<FaPhoneAlt className="text-cyan-400" />} 
            label="Mobile" 
            value={userProfile.mobileNumber} 
          />
          <ProfileDetail 
            icon={<FaGraduationCap className="text-cyan-400" />} 
            label="Degree" 
            value={`${userProfile.degree} (${userProfile.degreeStatus})`} 
          />
        </div>
        
        <Divider className="bg-blue-500/20" />
        
        <div className="grid md:grid-cols-2 gap-4">
          <ProfileDetail 
            icon={<FaBook className="text-cyan-400" />} 
            label="Highest Qualification" 
            value={userProfile.highestQualification} 
          />
          <ProfileDetail 
            icon={<FaBriefcase className="text-cyan-400" />} 
            label="Experience" 
            value={`${userProfile.experience} years`} 
          />
        </div>
        
        <Divider className="bg-blue-500/20" />
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaCode className="text-cyan-400" />
            <h3 className="font-semibold">Technical Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.technicalSkills.map((skill, index) => (
              <Chip 
                key={index} 
                variant="solid" 
                color="primary" 
                size="sm" 
                className="bg-cyan-600/50"
              >
                {skill}
              </Chip>
            ))}
          </div>
        </div>
        
        {userProfile.otherSkills && userProfile.otherSkills.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FaCode className="text-cyan-400" />
              <h3 className="font-semibold">Other Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {userProfile.otherSkills.map((skill, index) => (
                <Chip 
                  key={index} 
                  variant="solid" 
                  color="secondary" 
                  size="sm" 
                  className="bg-blue-600/50"
                >
                  {skill}
                </Chip>
              ))}
            </div>
          </div>
        )}
        
        {userProfile.projectLinks && userProfile.projectLinks.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <FaLink className="text-cyan-400" />
              <h3 className="font-semibold">Project Links</h3>
            </div>
            <div className="space-y-2">
              {userProfile.projectLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={link} 
                  target="_blank" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default UserProfileView;