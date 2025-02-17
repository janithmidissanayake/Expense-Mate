import { useState } from 'react';
import { UserIcon, MailIcon, LockIcon, UserPlusIcon, Loader2Icon } from 'lucide-react';
import { notification } from 'antd';
import axios from 'axios';

const Role = {
  USER: 'USER',
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: Role.USER
  });

  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const showNotification = (type, message, description) => {
    api[type]({
      message,
      description,
      placement: 'topRight',
      duration: 4,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== passwordConfirm) {
      setPasswordError('Passwords do not match');
      showNotification('error', 'Error', 'Passwords do not match. Please try again.');
      return;
    }

    setPasswordError('');
    setLoading(true);

    try {
      const response = await axios.post(`/api/v1/auth/register`, formData);
      console.log('User registered successfully:', response.data);
      showNotification(
        'success',
        'Registration Successful',
        'Your account has been created successfully. Please login to continue.'
      );
      
      // Optional: Redirect to login page after a short delay
      // setTimeout(() => {
      //   window.location.href = '/signIn';
      // }, 2000);
      
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      showNotification(
        'error',
        'Registration Failed',
        error.response?.data?.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <UserPlusIcon className="h-8 w-8 text-purple-600" />
                Create Account
              </h2>
              <p className="text-gray-500 mt-2">Register to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex space-x-4">
                <div className="relative w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                  />
                </div>
                <div className="relative w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                  minLength={6}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                  required
                  minLength={6}
                />
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-900 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-purple-600 font-semibold hover:underline"
                >
                  Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;