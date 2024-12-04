import React from "react";
import { 
    Card, 
    CardHeader, 
    CardBody
} from "@nextui-org/react";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import RecruiterLogin from '../../components/Recruiter/RecruiterLogin';

const RecruiterLoginPage = () => {
    return(
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-gradient-to-t from-orange-950 via-amber-950 to-amber-900 border-none py-10">
          <CardHeader className="flex justify-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </CardHeader>
          <CardBody className="space-y-6 py-6">
            <RecruiterLogin />
            <div className="text-center text-gray-300 text-sm">
              Don't have an account? {" "} 
              <Link 
                to="/recruiter/register" 
                className="text-amber-600 hover:text-amber-400 hover:animate-pulse transition-all duration-200"
              >
                Register
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
    )
};

export default RecruiterLoginPage;