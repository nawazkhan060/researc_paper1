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
        
        <nav className="header-links contents font-semibold text-base lg:text-lg">
          <ul className="flex items-center ml-4 xl:ml-8 mr-auto">
            <li className="p-3 xl:p-6">
              <Link to="/">
                <span>Home</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/indexing">
                <span>Indexing</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/journal-issues">
                <span>Journal Issues</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/author-guidelines">
                <span>Author Guidelines</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/callforpapers">
                <span>Call for Papers</span>
              </Link>
            </li>
            <li className="p-3 xl:p-6">
              <Link to="/joinusedito" className="flex items-center">
                <span>Join Us</span>
                <svg className="h-3 opacity-30 ml-2" aria-hidden="true" focusable="false" data-prefix="far" data-icon="chevron-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"></path>
                </svg>
              </Link>
            </li>
            
            {user && (
              <li className="p-3 xl:p-6">
                <Link 
                  to={
                    user.role === 'author' ? '/author-dashboard' :
                    user.role === 'reviewer' ? '/reviewer-dashboard' :
                    '/admin-dashboard'
                  }
                >
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <nav className="hidden xl:contents">
          <ul className="flex items-center mr-4 lg:mr-6 xl:mr-8">
            <li className="p-1">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path fill="currentColor" d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
                </svg>
              </a>
            </li>
            <li className="p-1">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                </svg>
              </a>
            </li>
            <li className="p-1">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </a>
            </li>
            <li className="p-1">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="inline-block rounded-full border p-2 hover:shadow-lg hover:border-opacity-0 duration-200 hover:-translate-y-0.5">
                <svg className="h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"></path>
                </svg>
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="border flex items-center px-4 lg:px-6 xl:px-8">
          <Link to="/contact-us" className="mr-4 lg:mr-6 xl:mr-8">
            <svg className="h-6 xl:h-8" aria-hidden="true" focusable="false" data-prefix="far" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path fill="currentColor" d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
            </svg>
          </Link>
          
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