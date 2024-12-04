import React from "react";
import { 
  Card, 
  CardHeader, 
  CardBody
} from "@nextui-org/react";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import Login from "../../components/User/UserLogin";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        <Card className="bg-gradient-to-t from-gray-900 via-gray-950 to-blue-950 border-none py-10">
          <CardHeader className="flex justify-center">
            <h1 className="text-3xl font-bold text-white">Login</h1>
          </CardHeader>
          <CardBody className="space-y-6 py-6">
            <Login />
            <div className="text-center text-gray-300 text-sm">
              Don't have an account? {" "} 
              <Link 
                to="/user/register" 
                className="text-blue-600 hover:text-blue-400 hover:animate-pulse transition-all duration-200"
              >
                Register
              </Link>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;