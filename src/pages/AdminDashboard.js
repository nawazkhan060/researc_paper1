import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PaperCard from '../components/PaperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { mockAPI, mockUsers } from '../data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  const [papers, setPapers] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [issues, setIssues] = useState([
    { id: 1, volume: 3, issue: 4, month: 'December', year: 2025, isCurrent: true },
    { id: 2, volume: 3, issue: 3, year: 2024, isCurrent: false },
    { id: 3, volume: 3, issue: 2, year: 2024, isCurrent: false },
    { id: 4, volume: 3, issue: 1, year: 2024, isCurrent: false },
    { id: 5, volume: 2, issue: 12, year: 2023, isCurrent: false },
    { id: 6, volume: 2, issue: 11, year: 2023, isCurrent: false },
    { id: 7, volume: 2, issue: 10, year: 2023, isCurrent: false },
  ]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Search functionality
  const [issueForm, setIssueForm] = useState({
    volume: '',
    issue: '',
    month: '',
    year: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const allPapers = await mockAPI.getAllPapers();
      setPapers(allPapers);
      
      const reviewerUsers = mockUsers.filter(u => u.role === 'reviewer');
      setReviewers(reviewerUsers);
    } catch (error) {
      console.error('Error loading admin ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignReviewer = async () => {
    if (!selectedPaper || !selectedReviewer) return;

    setAssigning(true);
    try {
      const result = await mockAPI.assignReviewer(selectedPaper.id, parseInt(selectedReviewer));
      if (result.success) {
        setAlert({ type: 'success', message: 'Reviewer assigned successfully.' });
        setShowAssignModal(false);
        setSelectedPaper(null);
        setSelectedReviewer('');
        setSearchTerm('');
        loadAdminData();
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to assign reviewer.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while assigning the reviewer.' });
    } finally {
      setAssigning(false);
    }
  };

  const handlePublishPaper = async (paperId) => {
    try {
      const result = await mockAPI.publishPaper(paperId);
      if (result.success) {
        setAlert({ type: 'success', message: 'Paper published successfully.' });
        loadAdminData();
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to publish paper.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while publishing the paper.' });
    }
  };

  const handleIssueFormChange = (e) => {
    const { name, value } = e.target;
    setIssueForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIssue = (e) => {
    e.preventDefault();
    const newIssue = {
      id: issues.length > 0 ? Math.max(...issues.map(i => i.id)) + 1 : 1,
      volume: parseInt(issueForm.volume),
      issue: parseInt(issueForm.issue),
      month: issueForm.month,
      year: parseInt(issueForm.year),
      isCurrent: false,
    };
    setIssues(prev => [newIssue, ...prev].sort((a, b) => b.year - a.year || b.issue - a.issue));
    setIssueForm({ volume: '', issue: '', month: '', year: '' });
    setAlert({ type: 'success', message: 'New issue added successfully.' });
  };

  const handleDeleteIssue = (issueId) => {
    setIssues(prev => prev.filter(issue => issue.id !== issueId));
    setAlert({ type: 'success', message: 'Issue deleted successfully.' });
  };

  const handleSetCurrentIssue = (issueId) => {
    setIssues(prev =>
      prev.map(issue => ({
        ...issue,
        isCurrent: issue.id === issueId,
      }))
    );
    setAlert({ type: 'success', message: 'Current issue has been updated.' });
  };

  const filteredReviewers = reviewers.filter(reviewer =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.affiliation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStats = () => {
    const stats = {
      submitted: papers.filter(p => p.status === 'submitted').length,
      under_review: papers.filter(p => p.status === 'under_review').length,
      published: papers.filter(p => p.status === 'published').length,
      rejected: papers.filter(p => p.status === 'rejected').length
    };
    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin data..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">
            Welcome back, <span className="font-medium">{user.name}</span>. Manage submissions and reviewer assignments.
          </p>
        </div>

        {/* Alert */}
        {alert && (
          <div className="mb-8">
            <Alert 
              type={alert.type} 
              message={alert.message} 
              onClose={() => setAlert(null)} 
            />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Submitted</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Under Review</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.under_review}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Published</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Submissions ({papers.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'pending'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pending Assignment ({stats.submitted})
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'issues'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Journal Issues ({issues.length})
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'review'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Under Review ({stats.under_review})
              </button>
            </nav>
          </div>
        </div>

        {/* Papers List */}
        {activeTab === 'submissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    paper.status === 'published' ? 'bg-green-100 text-green-800' :
                    paper.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                    paper.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {paper.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Authors:</span> {paper.authors.join(', ')}</div>
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Category:</span> {paper.category}</div>
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Submitted:</span> {new Date(paper.submissionDate).toLocaleDateString()}</div>
                  {paper.doi && <div><span className="font-medium text-gray-700 w-20 inline-block">DOI:</span> {paper.doi}</div>}
                </div>

                <p className="text-gray-700 text-sm mb-5 line-clamp-3">{paper.abstract}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {paper.keywords.map((keyword, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
                      {keyword}
                    </span>
                  ))}
                </div>

                {paper.assignedReviewers && (
                  <div className="pt-4 border-t border-gray-200 text-sm text-gray-600">
                    <span className="font-medium">Assigned Reviewers:</span> {paper.assignedReviewers.length}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pending Assignment */}
        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.filter(p => p.status === 'submitted').map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    PENDING ASSIGNMENT
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Authors:</span> {paper.authors.join(', ')}</div>
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Category:</span> {paper.category}</div>
                  <div><span className="font-medium text-gray-700 w-20 inline-block">Submitted:</span> {new Date(paper.submissionDate).toLocaleDateString()}</div>
                </div>

                <p className="text-gray-700 text-sm mb-5 line-clamp-3">{paper.abstract}</p>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedPaper(paper);
                      setShowAssignModal(true);
                    }}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                  >
                    Assign Reviewer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Under Review */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.filter(p => p.status === 'under_review').map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    UNDER REVIEW
                  </span>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div><span className="font-medium text-gray-700 w-24 inline-block">Authors:</span> {paper.authors.join(', ')}</div>
                  <div><span className="font-medium text-gray-700 w-24 inline-block">Category:</span> {paper.category}</div>
                  <div><span className="font-medium text-gray-700 w-24 inline-block">Submitted:</span> {new Date(paper.submissionDate).toLocaleDateString()}</div>
                  {paper.reviewDeadline && (
                    <div><span className="font-medium text-gray-700 w-24 inline-block">Deadline:</span> {new Date(paper.reviewDeadline).toLocaleDateString()}</div>
                  )}
                </div>

                <p className="text-gray-700 text-sm mb-5 line-clamp-3">{paper.abstract}</p>

                {paper.assignedReviewers && (
                  <div className="mb-5 text-sm text-gray-600">
                    <span className="font-medium">Assigned Reviewers:</span> {paper.assignedReviewers.length}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handlePublishPaper(paper.id)}
                      className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                    >
                      Publish Paper
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPaper(paper);
                        setShowAssignModal(true);
                      }}
                      className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                    >
                      Assign More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Journal Issues Management */}
        {activeTab === 'issues' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-800 mb-4">All Issues</h3>
                <div className="space-y-4">
                  {issues.map(issue => (
                    <div key={issue.id} className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${issue.isCurrent ? 'border-green-500' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-gray-900">
                            Volume {issue.volume}, Issue {issue.issue} ({issue.month} {issue.year})
                          </p>
                          {issue.isCurrent && (
                            <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                              Current Issue
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {!issue.isCurrent && (
                            <button
                              onClick={() => handleSetCurrentIssue(issue.id)}
                              className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md"
                            >
                              Set as Current
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteIssue(issue.id)}
                            className="text-xs bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Issue</h3>
                <form onSubmit={handleAddIssue} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700">Volume</label>
                    <input
                      type="number"
                      name="volume"
                      id="volume"
                      value={issueForm.volume}
                      onChange={handleIssueFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div>
                    <label htmlFor="issue" className="block text-sm font-medium text-gray-700">Issue</label>
                    <input
                      type="number"
                      name="issue"
                      id="issue"
                      value={issueForm.issue}
                      onChange={handleIssueFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                    <input
                      type="text"
                      name="month"
                      id="month"
                      value={issueForm.month}
                      onChange={handleIssueFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., December"
                    />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="number"
                      name="year"
                      id="year"
                      value={issueForm.year}
                      onChange={handleIssueFormChange}
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="e.g., 2025"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                  >
                    Add Issue
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'pending' && papers.filter(p => p.status === 'submitted').length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">All Papers Assigned</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              All submitted papers have been assigned to reviewers. Check back later for new submissions.
            </p>
          </div>
        )}

        {activeTab === 'review' && papers.filter(p => p.status === 'under_review').length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Papers Under Review</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Papers currently under review will appear here. You can assign reviewers to pending papers.
            </p>
          </div>
        )}

        {/* Assign Reviewer Modal */}
        {showAssignModal && selectedPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Assign Reviewer</h2>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedPaper.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Authors:</span> {selectedPaper.authors.join(', ')}</div>
                    <div><span className="font-medium">Category:</span> {selectedPaper.category}</div>
                    <div><span className="font-medium">Submitted:</span> {new Date(selectedPaper.submissionDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mb-6 relative" ref={dropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Reviewer</label>
                  
                  {/* Search Input */}
                  <div className="relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      placeholder="Search reviewers by name or affiliation..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown */}
                  {isDropdownOpen && (
                    <div 
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto"
                      style={{ width: inputRef.current?.offsetWidth || '100%' }}
                    >
                      {filteredReviewers.length > 0 ? (
                        filteredReviewers.map(reviewer => (
                          <div
                            key={reviewer.id}
                            className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                              selectedReviewer === String(reviewer.id) ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              setSelectedReviewer(String(reviewer.id));
                              setSearchTerm(reviewer.name);
                              setIsDropdownOpen(false);
                            }}
                          >
                            <div className="font-medium text-gray-900">{reviewer.name}</div>
                            <div className="text-sm text-gray-500">{reviewer.affiliation}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-500">
                          No reviewers found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAssignReviewer}
                    disabled={assigning || !selectedReviewer}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition flex items-center justify-center"
                  >
                    {assigning ? 'Assigning...' : 'Assign Reviewer'}
                  </button>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;