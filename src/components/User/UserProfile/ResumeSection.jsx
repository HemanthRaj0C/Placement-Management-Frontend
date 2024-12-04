import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Divider, 
  Button 
} from "@nextui-org/react";
import { 
  FaCloudUploadAlt, 
  FaBook, 
  FaCalendar, 
  FaFileDownload, 
  FaEye 
} from "react-icons/fa";

const ResumeSection = ({
    latestResume, 
    handleFileUpload, 
    isUploading, 
    handleDownloadResume, 
    viewResume
}) => {
  return (
    <Card className="bg-blue-950 text-white border border-blue-500/20 max-w-4xl mx-auto mt-6">
      <CardHeader className="flex gap-3 bg-blue-900/50 py-4 px-6">
        <FaCloudUploadAlt className="text-2xl text-cyan-400" />
        <h2 className="text-xl font-semibold">
          {latestResume ? 'Your Latest Resume' : 'Upload Your Resume'}
        </h2>
      </CardHeader>
      <Divider className="bg-blue-500/20" />
      <CardBody className="p-6 space-y-4">
        {latestResume ? (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FaBook className="text-cyan-400" />
                <span>Filename: {latestResume.originalName}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar className="text-cyan-400" />
                <span>
                  Uploaded on: {new Date(latestResume.uploadDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                color="primary" 
                variant="solid" 
                onClick={handleDownloadResume}
                startContent={<FaFileDownload />}
                className="bg-cyan-600/50 hover:bg-cyan-600/70"
              >
                Download Resume
              </Button>
              <Button 
                color="secondary" 
                variant="solid" 
                onClick={viewResume}
                startContent={<FaEye />}
                className="bg-blue-600/50 hover:bg-blue-600/70"
              >
                View Resume
              </Button>
            </div>
          </>
        ) : null}
        
        <div className="mt-4">
          <input 
            type="file" 
            accept=".pdf,.doc,.docx" 
            onChange={handleFileUpload}
            disabled={isUploading}
            className="file:mr-4 file:rounded-md file:border-0 file:bg-cyan-600/50 file:text-white file:px-4 file:py-2 hover:file:bg-cyan-600/70"
          />
          {isUploading && (
            <div className="text-sm text-cyan-400 mt-2">Uploading...</div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ResumeSection;