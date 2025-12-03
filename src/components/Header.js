import React, { useState } from 'react';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';
import StarBorder from './StarBorder';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const desktopNavItems = [
    { label: 'Home', href: '/' },
    { label: 'Indexing', href: '/indexing' },
    { label: 'Journal Issues', href: '/journal-issues' },
    { label: 'Author Guidelines', href: '/author-guidelines' },
    { label: 'Call for Papers', href: '/callforpapers' },
    { label: 'Join Us', href: '/joinusedito' },
  ];

  const dashboardHref =
    user && user.role === 'author'
      ? '/author-dashboard'
      : user && user.role === 'reviewer'
      ? '/reviewer-dashboard'
      : user && user.role === 'admin'
      ? '/admin-dashboard'
      : '/login';

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

      <header className="hidden md:block bg-white shadow-lg relative overflow-visible">
        {/* Top info bar aligned to the right */}
        <div className="bg-sky-600 text-white text-xs lg:text-sm">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-end h-10 space-x-6">
            <span className="whitespace-nowrap">+91 98765 43210</span>
            <span className="whitespace-nowrap">ISSN: 2349-6002</span>
            <span className="hidden md:inline-block whitespace-nowrap">
              An International Peer-Reviewed Research Journal
            </span>
            <div className="flex items-center space-x-2">
              {user ? (
                <>
                  <Link
                    to={
                      user.role === 'author'
                        ? '/author-dashboard'
                        : user.role === 'reviewer'
                        ? '/reviewer-dashboard'
                        : '/admin-dashboard'
                    }
                    className="px-3 py-1 text-xs lg:text-sm font-semibold bg-sky-700 hover:bg-sky-800 rounded-md whitespace-nowrap"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-xs lg:text-sm font-semibold bg-slate-900 hover:bg-slate-800 rounded-md whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-3 py-1 text-xs lg:text-sm font-semibold bg-sky-700 hover:bg-sky-800 rounded-md whitespace-nowrap"
                  >
                    Author Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 py-1 text-xs lg:text-sm font-semibold bg-slate-900 hover:bg-slate-800 rounded-md whitespace-nowrap"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Desktop navbar */}
        <div className="bg-white">
          <div className="w-full px-6 lg:px-10 flex items-center justify-between h-20">
            {/* Logo and title */}
            <Link to="/" className="flex items-center space-x-4">
              <img
                src={logo}
                alt="Research Platform Logo"
                className="w-16 h-16 object-contain"
              />
              <div>
                <span className="block text-3xl font-bold text-slate-900 leading-tight whitespace-nowrap">
                  IJEPA
                </span>
                <span className="block text-xs lg:text-sm text-slate-500 font-medium whitespace-nowrap">
                  International Journal of Engineering Practices and Applications
                </span>
              </div>
            </Link>

            {/* Nav links + Dashboard button */}
            <nav className="flex items-center space-x-6">
              <ul className="header-links flex items-center space-x-6 text-base font-semibold text-slate-800">
                {desktopNavItems.map(item => (
                  <li
                    key={item.href}
                    className={location.pathname === item.href ? 'active' : ''}
                  >
                    <Link to={item.href} className="hover:text-amber-600">
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <StarBorder as="button" className="inline-flex rounded-full" color="amber" speed="6s">
                <Link
                  to={dashboardHref}
                  className="px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-base font-semibold shadow-md whitespace-nowrap"
                >
                  Dashboard
                </Link>
              </StarBorder>
            </nav>
          </div>
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
                  build by Billsoft publication
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