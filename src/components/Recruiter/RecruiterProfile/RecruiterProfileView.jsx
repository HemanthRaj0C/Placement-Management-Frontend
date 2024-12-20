import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Link 
} from "@nextui-org/react";
import { 
  FaBuilding, 
  FaEnvelope, 
  FaInfoCircle, 
  FaMapMarkerAlt, 
  FaIndustry, 
  FaUserTie, 
  FaLinkedin, 
  FaLink,
  FaGlobe 
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

const RecruiterProfileView = ({ recruiterProfile, onEditProfile }) => {
  return (
    <Card className="bg-amber-950/70 text-white border border-amber-500/20 w-3/4 mx-auto">
      <CardHeader className="flex justify-between items-center bg-amber-900/50 py-4 px-6">
        <div className="flex gap-3 items-center">
          <FaBuilding className="text-2xl text-orange-400" />
          <h2 className="text-xl font-semibold">Company Profile</h2>
        </div>
          <button 
            onClick={onEditProfile}
            className="bg-orange-600/50 hover:bg-orange-600/70 text-white px-4 py-2 rounded-md transition-all"
          >
            Edit Profile
          </button>
      </CardHeader>
      <Divider className="bg-amber-500/20" />
      <CardBody className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <ProfileDetail 
            icon={<FaBuilding className="text-orange-400" />} 
            label="Company Name" 
            value={recruiterProfile.companyName} 
          />
          <ProfileDetail 
            icon={<FaEnvelope className="text-orange-400" />} 
            label="Company Email" 
            value={recruiterProfile.companyEmail} 
          />
          <ProfileDetail 
            icon={<FaInfoCircle className="text-orange-400" />} 
            label="About" 
            value={recruiterProfile.companyAbout} 
          />
          <ProfileDetail 
            icon={<FaMapMarkerAlt className="text-orange-400" />} 
            label="Headquarters" 
            value={recruiterProfile.companyHeadquarters} 
          />
          <ProfileDetail 
            icon={<FaIndustry className="text-orange-400" />} 
            label="Industry" 
            value={recruiterProfile.companyIndustry} 
          />
          <ProfileDetail 
            icon={<FaUserTie className="text-orange-400" />} 
            label="Company Type" 
            value={recruiterProfile.companyType} 
          />
        </div>

        <Divider className="bg-amber-500/20" />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <FaLink className="text-orange-400" />
            <h3 className="font-semibold">Company Links</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            {recruiterProfile.companyLinkedIn && (
              <Link 
                href={recruiterProfile.companyLinkedIn} 
                target="_blank" 
                className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
              >
                <FaLinkedin className="text-lg" /> LinkedIn
              </Link>
            )}
            {recruiterProfile.companyWebsite && (
              <Link 
                href={recruiterProfile.companyWebsite} 
                target="_blank" 
                className="text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2"
              >
                <FaGlobe className="text-lg" /> Website
              </Link>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RecruiterProfileView;
