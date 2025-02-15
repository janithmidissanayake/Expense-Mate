import  { useState } from 'react';
import { LockIcon, UserIcon, EyeIcon, EyeOffIcon ,LoaderIcon  } from 'lucide-react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';


// const api = axios.create({
//   baseURL: 'http://localhost:8080/api/v1/auth',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });
const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const auth = useAuth();
  const navigate = useNavigate(); // Get navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.email !== "" && formData.password !== "") {
      const result = await auth.loginAction(formData);
      console.log("Login result:", result);
      if (!result.success) {
        setError(result.message); // Show the error message if login fails
      } else {
        // Navigate to the "hello" page after a successful login
        navigate("/dashboard");
      }
    } else {
      alert("Please provide a valid email and password");
    }
  
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear any previous errors when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                required
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:opacity-90 transition duration-300 transform hover:scale-[1.01]
              active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Signing in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-gray-600">
              Don&apos;t have an account?{' '}
              <a 
                href="/register" 
                className="text-purple-600 font-semibold hover:underline"
              >
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;