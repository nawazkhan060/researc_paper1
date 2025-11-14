import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-academic-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src={logo} 
              alt="Research Platform Logo" 
              className="w-10 h-10 object-contain"
            />
            <div>
              <span className="block text-xl font-bold text-academic-900 leading-tight">
                IJEPA
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                build by Softech publication
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/indexing" className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Indexing
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/journal-issues" className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Journal Issues
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/joinusedito" className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Join Us
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/author-guidelines" className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Author Guidelines
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>
            <Link to="/callforpapers" className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group">
              Call for Papers
              <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </Link>

            {user && (
              <>
                {user.role === 'author' && (
                  <Link 
                    to="/author-dashboard" 
                    className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                )}
                {user.role === 'reviewer' && (
                  <Link 
                    to="/reviewer-dashboard" 
                    className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin-dashboard" 
                    className="text-academic-600 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors duration-200 relative group"
                  >
                    Dashboard
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-sm text-academic-700">
                  <span className="font-medium text-academic-900">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-academic-700 hover:text-academic-900 bg-academic-100 hover:bg-academic-200 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-academic-700 hover:text-academic-900 bg-academic-100 hover:bg-academic-200 rounded-lg transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-academic-600 hover:bg-academic-100 hover:text-academic-900 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Fixed positioning */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white border-t border-academic-200 z-40 overflow-y-auto">
          <div className="px-4 pt-4 pb-6 space-y-1">
            <Link 
              to="/" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Published Papers
            </Link>
            <Link 
              to="/indexing" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Indexing & Abstracting
            </Link>
            <Link 
              to="/journal-issues" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Journal Issues
            </Link>
            <Link 
              to="/joinusedito" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Join as Editor/Reviewer
            </Link>
            <Link 
              to="/author-guidelines" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Author Guidelines
            </Link>
            <Link 
              to="/callforpapers" 
              className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              Call for Papers
            </Link>            
            
            {user ? (
              <div className="pt-4 mt-4 border-t border-academic-200">
                <div className="px-4 py-2 text-sm text-academic-600">
                  Signed in as <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full mt-2 px-4 py-3 text-base font-medium text-academic-700 hover:text-academic-900 bg-academic-100 hover:bg-academic-200 rounded-lg transition-colors duration-200 text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-academic-200 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full px-4 py-3 text-base font-medium text-academic-700 hover:text-academic-900 bg-academic-100 hover:bg-academic-200 rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full px-4 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;