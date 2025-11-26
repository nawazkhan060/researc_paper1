import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <style jsx>{`
        .header-links li span {
          position: relative;
          z-index: 0;
        }

        .header-links li span::before {
          content: '';
          position: absolute;
          z-index: -1;
          bottom: 2px;
          left: -4px;
          right: -4px;
          display: block;
          height: 6px;
        }

        .header-links li.active span::before {
          background-color: #fcae04;
        }

        .header-links li:not(.active):hover span::before {
          background-color: #ccc;
        }
      `}</style>

      <header className="bg-white shadow-lg h-24 hidden md:flex">
        <Link to="/" className="border flex-shrink-0 flex items-center justify-center px-4 lg:px-6 xl:px-8">
          <img 
            src={logo} 
            alt="Research Platform Logo" 
            className="w-16 h-16 object-contain"
          />
        </Link>
        
        <div className="flex items-center ml-4 xl:ml-8 mr-auto">
          <button
            type="button"
            onClick={() => setIsDesktopMenuOpen((prev) => !prev)}
            className="inline-flex items-center px-6 py-3 border border-academic-200 rounded-full text-base lg:text-lg font-semibold text-academic-700 hover:bg-academic-50 hover:border-academic-300 transition-colors duration-200 shadow-sm"
          >
            <span className="mr-2">Menu</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <div className="border flex items-center px-4 lg:px-6 xl:px-8">
         
          
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-gray-700 text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="bg-black hover:bg-gray-700 text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded mr-2"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-black hover:bg-gray-700 text-white font-bold px-4 xl:px-6 py-2 xl:py-3 rounded"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {isDesktopMenuOpen && (
        <div className="hidden md:block fixed top-24 inset-x-0 bg-white border-b border-academic-200 shadow-lg z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-2 py-4 text-base lg:text-lg font-semibold text-academic-700">
              <Link
                to="/"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Home
              </Link>
              <Link
                to="/indexing"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Indexing
              </Link>
              <Link
                to="/journal-issues"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Journal Issues
              </Link>
              <Link
                to="/author-guidelines"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Author Guidelines
              </Link>
              <Link
                to="/callforpapers"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Call for Papers
              </Link>
              <Link
                to="/joinusedito"
                onClick={() => setIsDesktopMenuOpen(false)}
                className="hover:text-primary-600"
              >
                Join Us
              </Link>
              {user && (
                <Link
                  to={
                    user.role === 'author' ? '/author-dashboard' :
                    user.role === 'reviewer' ? '/reviewer-dashboard' :
                    '/admin-dashboard'
                  }
                  onClick={() => setIsDesktopMenuOpen(false)}
                  className="hover:text-primary-600"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Header - Keep existing mobile functionality */}
      <header className="bg-white shadow-sm border-b border-academic-200 md:hidden sticky top-0 z-50">
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

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-academic-600 hover:bg-academic-100 hover:text-academic-900 transition-colors duration-200"
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-white border-t border-academic-200 z-40 overflow-y-auto">
            <div className="px-4 pt-4 pb-6 space-y-1">
              <Link 
                to="/" 
                className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
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
              
              {user && (
                <Link 
                  to={
                    user.role === 'author' ? '/author-dashboard' :
                    user.role === 'reviewer' ? '/reviewer-dashboard' :
                    '/admin-dashboard'
                  }
                  className="block px-4 py-3 text-base font-medium text-academic-700 hover:text-primary-600 hover:bg-academic-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              
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
    </>
  );
};

export default Header;