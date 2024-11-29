import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    studentID: '',
    name: '',
    email: '',
    password: '',
    branch: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const branches = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.studentID) return 'Student ID is required';
    if (!formData.name) return 'Name is required';
    if (!formData.email) return 'Email is required';
    if (!formData.password) return 'Password is required';
    if (!formData.branch) return 'Branch is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Invalid email format';
    
    // if (formData.password.length < 6) return 'Password must be at least 6 characters';

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/userRegister', formData);
      setSuccess(response.data.message);
      if(response.status === 201){
        navigate('/user/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    finally{
        setFormData({
            studentID: '',
            name: '',
            email: '',
            password: '',
            branch: ''
          });
    }
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div>
              {error}
            </div>
          )}

          {success && (
            <div>
              {success}
            </div>
          )}

          <div>
            <label>
              Student ID
            </label>
            <input
              type="text"
              name="studentID"
              value={formData.studentID}
              onChange={handleChange}
              placeholder="Enter Student ID"
              required
            />
          </div>

          <div>
            <label>
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Full Name"
              required
            />
          </div>

          <div>
            <label>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              required
            />
          </div>

          <div>
            <label>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>

          <div>
            <label>
              Branch
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;