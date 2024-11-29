import React from 'react';
import Register from '../components/Register';

const RegisterPage = () => {

  return (
    <div>
      <div>
        <h1>Welcome to Register Page</h1>
      </div>
      <Register />
      <div>
        Already have an account? <a href="/user/login">Login</a>
      </div>
    </div>
  );
};

export default RegisterPage;