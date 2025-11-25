import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import logo from '../assets/logo.png'; // ✅ Import logo

const Login = () => {
  const { login, loginWithGoogle } = useAuth(); // ✅ assuming you have Google login in AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result && result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result?.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Demo login buttons
  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      let creds;
      if (role === 'admin') {
        creds = { email: 'admin@example.com', password: 'password123' };
      } else if (role === 'reviewer') {
        creds = { email: 'reviewer@example.com', password: 'password123' };
      } else {
        creds = { email: 'author@example.com', password: 'password123' };
      }

      const result = await login(creds.email, creds.password);
      if (result && result.success) {
        navigate('/');
      } else {
        setError(result?.error || 'Demo login failed.');
      }
    } catch (err) {
      setError('Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-academic-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* ✅ Logo */}
        <div className="flex justify-center mb-8">
          <img
            src={logo}
            alt="Research Platform Logo"
            className="w-16 h-16 object-contain rounded-2xl shadow-lg"
          />
        </div>

        <h2 className="mt-2 text-center text-3xl font-extrabold text-academic-900 leading-tight">
          Sign in to your account
        </h2>
        <p className="mt-4 text-center text-base text-academic-600">
          Access your research papers, reviews, and administrative tools
        </p>
        <p className="mt-2 text-center text-sm text-academic-600">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
          {error && <Alert type="error" message={error} />}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-academic-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-academic-300 rounded-md shadow-sm placeholder-academic-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-academic-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-academic-300 rounded-md shadow-sm placeholder-academic-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="button-auth w-full justify-center"
              >
                <span className="dots_border"></span>
                <svg className="sparkle" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path className="path" d="M14.8285 14.8285C16.105 13.552 16.105 11.448 14.8285 10.1716C13.552 8.89502 11.448 8.89502 10.1716 10.1716C8.89502 11.448 8.89502 13.552 10.1716 14.8285C11.448 16.105 13.552 16.105 14.8285 14.8285Z" />
                  <path className="path" d="M12 2V4M12 20V22M4 12H2M22 12H20M19.071 19.071L17.657 17.657M6.343 6.343L4.929 4.929M19.071 4.929L17.657 6.343M6.343 17.657L4.929 19.071" />
                </svg>
                <span className="text_button">{loading ? 'Signing In...' : 'Sign In'}</span>
              </button>
            </div>
          </form>

          {/* Forgot password */}
          <div className="mt-6 flex items-center justify-center">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot your password?
            </Link>
          </div>

          {/* ✅ Google Sign-in */}
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-academic-700 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Sign in with Google
            </button>
          </div>

          {/* ✅ Demo login buttons */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              onClick={() => handleDemoLogin('admin')}
              className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              Demo Login as Admin
            </button>
            <button
              onClick={() => handleDemoLogin('reviewer')}
              className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              Demo Login as Reviewer
            </button>
            <button
              onClick={() => handleDemoLogin('author')}
              className="w-full py-2 px-4 border rounded-md shadow-sm text-sm font-medium bg-gray-100 hover:bg-gray-200"
            >
              Demo Login as Author
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
