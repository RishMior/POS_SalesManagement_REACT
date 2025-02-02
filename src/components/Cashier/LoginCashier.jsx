import React, { useState, useEffect } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import './CSS FIles/LoginCashier.css';  
import { TextField, IconButton, InputAdornment, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import visibility icons
import axios from 'axios';
import { useAuth } from '../AccountLoginValid/AuthContext';
import Navbar from '../Global Configuration/NavBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LoginCashier  = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [business_name] = useState('');
  const [fname] = useState('');
  const { setIsCashierLoggedIn } = useAuth(); // Get the context
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    // Check if the user is already logged in
    const isLoggedIn = localStorage.getItem('cashierLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/cashier-main');
    }}, [navigate]);

  const handleLogin = () => {
    if (!username || !password) {
      toast.error('Please enter both your username and password', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      // Send a POST request to the server
      axios.post('http://localhost:8080/user/logincash', {
        username: username,
        password: password,
        business_name: business_name,
        fname: fname
      })
        .then((response) => {
          if (response.status === 200) {
            const token = response.data.token;
            console.log('Username from API response:');
            localStorage.setItem('cashierToken', token);
            localStorage.setItem('cashierLoggedIn', 'true');
            localStorage.setItem('cashierUsername', username);
            localStorage.setItem('cashierBusinessName', response.data.business_name);
            localStorage.setItem('cashierFirstName', response.data.fname);
            setIsCashierLoggedIn(true);
            navigate('/cashier-main');
          } else {
            toast.error('Please enter your username and password', {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              });
          }
        })
        .catch((error) => {
          console.error('Login failed:', error);
          toast.error('The username or password you’ve entered is incorrect. Please try again.', {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        });
    }};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <Navbar/>
      <div className="starting-screen">
        <Typography style={{color: "#213458", fontSize: 60, fontWeight: 'bolder', fontFamily: 'Poppins', marginBottom: 20}}>Login as Cashier</Typography>
          <div className="centered-content">
            <div className="input-container">
            <TextField
              type="text"
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              inputProps={{style: {fontSize: 24, fontFamily: 'Poppins'}}}
              InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
          />
          </div>

          <div className="input-container">
            <TextField
              type={showPassword ? 'text' : 'password'} // Toggle password visibility
              fullWidth
              label="Password"
              value={password}
              variant='outlined'
              onChange={(e) => setPassword(e.target.value)}
              inputProps={{style: {fontSize: 24, fontFamily: 'Poppins'}}}
              InputLabelProps={{ style: { fontSize: 24, fontFamily: 'Poppins' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </div>
          
          <button className='btn-login-salesmanager' onClick={handleLogin}> Login </button>
          <br />
        <Link to="/createaccountusers">
          <button className='btn-register'>
          Don't Have An Account? </button > 
        </Link>
        <Link to="/forgotpassword">
            <div className="forgot-password">
              <span className='forgot-password-text'>Forgot Password?</span>
            </div>
          </Link>
      </div>

      <ToastContainer className="foo" style={{ width: "600px", fontSize: 15 }} />
    </div>
  </div>
  );
};

export default LoginCashier;
