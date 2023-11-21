import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; 
import { Input } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { Button} from 'antd';

export default function Welcome() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerinformation, setRegisterinformation] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: ''
  });
  

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate('/homepage');
      }
    });
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  }

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/homepage');
      })
      .catch((err) => alert(err.message));
  }

  const handleRegister = () => {
    if (registerinformation.email !== registerinformation.confirmEmail) {
      alert('Email is not the same');
      return;
    } else if (registerinformation.password !== registerinformation.confirmPassword) {
      alert('Passwords are not the same');
      return;
    }

    createUserWithEmailAndPassword(auth, registerinformation.email, registerinformation.password)
      .then(() => {
        navigate('/homepage');
      })
      .catch((err) => alert(err.message));
  }

  return (
    <div className="parent-container">
        <div className="left-container">
      <motion.h1
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Your next big idea starts here!
      </motion.h1>
  
      <motion.h2
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Get organized, get productive.
      </motion.h2>
      </div>
      <div className="right-container">
        {isRegistering ? (
          <div className="register-cont">
            <div className="register-cont-inside">
            <Input className="custom-input" type="email" prefix={<UserOutlined />} placeholder="Email" value={registerinformation.email} onChange={(e) => setRegisterinformation({ ...registerinformation, email: e.target.value })} />
            <Input className="custom-input" type="email" placeholder="confirm email" value={registerinformation.confirmEmail} onChange={(e) => setRegisterinformation({ ...registerinformation, confirmEmail: e.target.value })} />
            <Input.Password className="custom-input" type="password" placeholder="password" value={registerinformation.password} onChange={(e) => setRegisterinformation({ ...registerinformation, password: e.target.value })} />
            <Input.Password className="custom-input" type="password" placeholder="password confirm" value={registerinformation.confirmPassword} onChange={(e) => setRegisterinformation({ ...registerinformation, confirmPassword: e.target.value })} />
            <Button ghost onClick={handleRegister}>register</Button>
            <Button ghost onClick={() => setIsRegistering(false)}>go back</Button>
          </div>
          </div>
        ) : (
            <div className="login-cont"  >
            <div className="login-cont-insidecont" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
            <Input type="email" onChange={handleEmailChange} prefix={<UserOutlined />} value={email} className="custom-input" />
            <Input.Password type="password" onChange={handlePasswordChange} value={password} className="custom-input" />
            <Button ghost onClick={handleSignIn} className="button-login">Sign in</Button>
            <Button ghost className="button-createAnAccount" onClick={() => setIsRegistering(true)}>Create an account</Button>
          </div>
          </div>
          
          
        )}
      </div>
    </div>
  );
}
