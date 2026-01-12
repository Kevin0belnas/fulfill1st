import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// Reuse the same animations from Login
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled components (reused from Login with minor adjustments)
const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00c298 0%, #087830 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  padding: clamp(8px, 2vw, 20px);
`;

const FormWrapper = styled.div`
  animation: ${fadeIn} 0.6s ease-out;
  width: 100%;
  max-width: clamp(300px, 90vw, 440px);
  position: relative;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.96);
  padding: clamp(24px, 5vw, 40px);
  border-radius: clamp(8px, 2vw, 16px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const Title = styled.h2`
  margin-bottom: clamp(20px, 3vw, 32px);
  text-align: center;
  color: #2d3748;
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const FormGroup = styled.div`
  margin-bottom: clamp(16px, 3vw, 20px);
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: clamp(6px, 1vw, 8px);
  color: #4a5568;
  font-size: clamp(12px, 2vw, 14px);
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px);
  font-size: clamp(14px, 2vw, 15px);
  border: 1px solid #e2e8f0;
  border-radius: clamp(6px, 1.5vw, 8px);
  box-sizing: border-box;
  transition: all 0.2s;
  background-color: #f8fafc;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: clamp(12px, 3vw, 14px) clamp(14px, 3vw, 16px);
  font-size: clamp(14px, 2vw, 15px);
  border: 1px solid #e2e8f0;
  border-radius: clamp(6px, 1.5vw, 8px);
  box-sizing: border-box;
  transition: all 0.2s;
  background-color: #f8fafc;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: clamp(14px, 3vw, 16px);
  background-color: #4f46e5;
  color: #fff;
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 600;
  border: none;
  border-radius: clamp(6px, 1.5vw, 8px);
  cursor: pointer;
  transition: all 0.2s;
  margin-top: clamp(6px, 1vw, 8px);

  &:hover {
    background-color: #4338ca;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #a5b4fc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #e53e3e;
  font-size: clamp(12px, 2vw, 14px);
  margin-bottom: clamp(12px, 2vw, 16px);
  text-align: center;
  padding: clamp(8px, 2vw, 12px);
  background-color: #fff5f5;
  border-radius: clamp(6px, 1.5vw, 8px);
  border-left: 4px solid #e53e3e;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SuccessMessage = styled.div`
  color: #38a169;
  font-size: clamp(12px, 2vw, 14px);
  margin-bottom: clamp(12px, 2vw, 16px);
  text-align: center;
  padding: clamp(8px, 2vw, 12px);
  background-color: #f0fff4;
  border-radius: clamp(6px, 1.5vw, 8px);
  border-left: 4px solid #38a169;
  animation: ${fadeIn} 0.3s ease-out;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: clamp(16px, 4vw, 20px);
  height: clamp(16px, 4vw, 20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${pulse} 1.5s infinite, ${spin} 1s linear infinite;
`;

const Footer = styled.div`
  margin-top: clamp(16px, 3vw, 24px);
  text-align: center;
  color: #718096;
  font-size: clamp(12px, 2vw, 14px);

  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 600;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: -50px;
  left: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BackIcon = styled.svg`
  width: 20px;
  height: 20px;
  fill: #4a5568;
`;

const PasswordHint = styled.div`
  font-size: clamp(10px, 2vw, 12px);
  color: #718096;
  margin-top: 4px;
`;

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'agent' // Default role
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('All fields are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  // Function to create profile in the profiles table
  const createUserProfile = async (userId, email, firstName, lastName, role) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email: email,
          full_name: `${firstName} ${lastName}`,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      throw new Error(`Profile creation failed: ${error.message}`);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            role: formData.role
          }
        }
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (authData.user) {
        // Step 2: Create profile in the profiles table
        try {
          await createUserProfile(
            authData.user.id,
            formData.email,
            formData.firstName,
            formData.lastName,
            formData.role
          );

          setSuccess('Account created successfully! Please check your email to verify your account.');
          
          // Clear form
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'agent'
          });

          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login');
          }, 4000);

        } catch (profileError) {
          // If profile creation fails, we should handle it gracefully
          console.error('Profile creation error:', profileError);
          setSuccess('Account created, but there was an issue with profile setup. Please contact support.');
        }
      }

    } catch (err) {
      setError(err.message || 'Account creation failed. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Container>
      <FormWrapper>
        <BackButton onClick={handleBackClick} title="Go back to home">
          <BackIcon viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </BackIcon>
        </BackButton>
        
        <Form onSubmit={handleSubmit}>
          <Title>Create Agent Account</Title>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>{success}</SuccessMessage>}

          <FormGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
              autoFocus
            />
          </FormGroup>

          <FormGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="agent@company.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>Role</Label>
            <Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="support">Support</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
            <PasswordHint>Must be at least 6 characters long</PasswordHint>
          </FormGroup>

          <FormGroup>
            <Label>Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="••••••••"
            />
          </FormGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner /> : 'Create Account'}
          </Button>

          <Footer>
            Already have an account? <a href="/login">Sign in here</a>
          </Footer>
        </Form>
      </FormWrapper>
    </Container>
  );
};

export default CreateAccount;