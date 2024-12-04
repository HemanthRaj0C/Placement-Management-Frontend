import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button,  
  Chip 
} from "@nextui-org/react";
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';
import { FaUserGraduate } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState(null);

  const UserSection = () => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto"
    >
      <Card className="mx-auto w-full py-5 bg-gray-900">
        <CardHeader className="flex justify-center py-5">
          <Chip className='bg-blue-800 font-semibold text-white px-5 py-4 hover:scale-105 transition-all transform duration-300'>User Portal</Chip>
        </CardHeader>
        <CardBody className="space-y-4 w-1/2 mx-auto">
          <Button 
            as={Link} 
            to="/user/login" 
            fullWidth
            className="bg-gradient-to-tl from-cyan-500 via-blue-800 to-blue-800 font-semibold text-white hover:scale-95 transition-all transform duration-300"
          >
            Login
          </Button>
          <Button 
            as={Link} 
            to="/user/register" 
            color="primary" 
            variant="bordered" 
            className='hover:scale-95 transition-all transform duration-300'
            fullWidth
          >
            Register
          </Button>
          <Button 
            fullWidth 
            onClick={() => setActiveSection(null)}
            className='hover:scale-85 bg-gray-100 hover:bg-black hover:text-white transition-all transform duration-300'
          >
            Back to Home
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );

  const RecruiterSection = () => (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4 }}
      className='flex flex-col items-center justify-center min-h-screen max-w-md mx-auto'
    >
      <Card className="mx-auto w-full py-5 bg-gray-900">
        <CardHeader className="flex justify-center py-5">
          <Chip className='bg-amber-800 font-semibold text-white px-5 py-4 hover:scale-105 transition-all transform duration-300'>Recruiter Portal</Chip>
        </CardHeader>
        <CardBody className="space-y-4 w-1/2 mx-auto">
          <Button 
            as={Link} 
            to="/recruiter/login" 
            fullWidth
            className='bg-gradient-to-tl from-orange-500 via-amber-800 to-amber-800 font-semibold text-white hover:scale-95 transition-all transform duration-300'
          >
            Login
          </Button>
          <Button 
            as={Link} 
            to="/recruiter/register" 
            color="warning" 
            variant="bordered" 
            className='hover:scale-95 transition-all transform duration-300'
            fullWidth
          >
            Register
          </Button>
          <Button 
            fullWidth 
            onClick={() => setActiveSection(null)}
            className='hover:scale-85 bg-gray-100 hover:bg-black hover:text-white transition-all transform duration-300'
          >
            Back to Home
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );

  const HomeContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-screen"
    >
      <h1 className="text-5xl font-bold my-8 text-center">Placement Management</h1>
      <div className="flex space-x-10">
        <Button 
          color="" 
          className="bg-gradient-to-tl from-cyan-500 via-blue-800 to-blue-800 "
          startContent={<FaUserGraduate />}
          onClick={() => setActiveSection('user')}
        >
          User Portal
        </Button>
        <Button 
          color=""
          className="bg-gradient-to-tr from-orange-500 via-amber-800 to-amber-800"
          startContent={<FaUserTie />} 
          onClick={() => setActiveSection('recruiter')}
        >
          Recruiter Portal
        </Button>
      </div>
    </motion.div>
  );

return (
    <div className="min-h-screen bg-gray-950 text-white ">
        {/* Spline */}
        <div className="absolute inset-0 z-0">
            <Spline scene="/3d-models/scene.splinecode" />
        </div>
        
        {/* Overlay */}
        <div className="z-10 overflow-hidden mx-auto pointer-events-auto">
            <AnimatePresence mode="wait">
                {activeSection === null && <HomeContent key="home" />}
                {activeSection === 'user' && <UserSection key="user" />}
                {activeSection === 'recruiter' && <RecruiterSection key="recruiter" />}
            </AnimatePresence>
        </div>
    </div>
);
};

export default HomePage;