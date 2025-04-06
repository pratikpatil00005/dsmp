import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, Title, Text, Button, Container, TextInput, PasswordInput } from '@mantine/core';
import axios from 'axios';
import { useAuth } from '../../lib/auth';
import './styles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Check for token in URL when redirected from Google OAuth
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      // Get user data from the token or make an API call to get user data
      const userData = {
        email: username,
        name: username
      };
      login(token, userData);
      navigate('/canvas');
    }
  }, [location, navigate, login, username]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username,
        password
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/canvas');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.detail || 
        err.message || 
        'An error occurred during login'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/login`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5eb] to-[#ffe8d6] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title order={1} className="text-5x1 font-bold mb-4 excalifont-text bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
            Welcome to DrawCal
          </Title>
          <Text className="text-2xl excalifont-text text-gray-600"> 
            Where Math Meets Creativity
          </Text>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Card */}
          <Paper 
            shadow="xl" 
            p="xl" 
            radius="lg" 
            className="w-full bg-white/90 backdrop-blur-sm"
          >
            <Title order={2} className="mb-8 excalifont-text text-3xl text-center">
              Get Started
            </Title>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Text color="red" size="sm" ta="center" className="excalifont-text">
                  {error}
                </Text>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                size="lg"
                radius="md"
                className="w-full excalifont-text"
                classNames={{ label: 'excalifont-text' }}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                size="lg"
                radius="md"
                className="w-full excalifont-text"
                classNames={{ label: 'excalifont-text' }}
              />
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                size="lg"
                radius="md"
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 transition-all duration-300 excalifont-text"
              >
                {isLoading ? 'Signing in...' : 'log in'}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 excalifont-text">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={isLoading}
              size="lg"
              radius="md"
              className="flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50 excalifont-text"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-14 h-7"
              />
              Sign in with Google
            </Button>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Text size="sm" c="dimmed" ta="center" className="excalifont-text">
                Test Accounts:
                <br />
                <span className="font-semibold">Admin</span> - username: admin, password: admin
                <br />
                <span className="font-semibold">User</span> - username: user, password: user123
              </Text>
            </div>
          </Paper>

          {/* About Card */}
          <Paper 
            shadow="xl" 
            p="xl" 
            radius="lg" 
            className="w-full bg-white/90 backdrop-blur-sm flex flex-col justify-center"
          >
            <div className="space-y-6">
              <Title order={2} className="text-3xl excalifont-text text-center mb-6">
                About DrawCal
              </Title>
              <div className="space-y-4">
                <Text className="text-lg text-gray-700 leading-relaxed excalifont-text">
                  DrawCal is an innovative web application that combines the power of drawing and mathematical calculations. Create, calculate, and visualize mathematical expressions in a whole new way!
                </Text>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Text fw={600} className="text-blue-600 excalifont-text">Draw</Text>
                    <Text size="sm" className="text-gray-600 excalifont-text">Express your mathematical ideas through drawing</Text>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <Text fw={600} className="text-red-600 excalifont-text">Calculate</Text>
                    <Text size="sm" className="text-gray-600 excalifont-text">Get instant results for your mathematical expressions</Text>
                  </div>
                </div>

                {/* Animated Demo Section */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg overflow-hidden">
                  <Text fw={600} className="text-gray-700 mb-3 text-center excalifont-text">
                    See it in Action
                  </Text>
                  <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                    <img
                      src="/gif1.jpeg"
                      alt="DrawCal Demo"
                      className="w-full h-full object-cover rounded-lg transform hover:scale-105 transition-transform duration-300"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  <Text size="sm" className="text-gray-600 mt-3 text-center excalifont-text">
                    Draw, Calculate, and Visualize in Real-time
                  </Text>
                </div>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Login; 