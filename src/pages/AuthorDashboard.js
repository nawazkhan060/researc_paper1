import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PaperCard from '../components/PaperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { mockAPI } from '../data/mockData';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AuthorDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // 👈 Initialize the hookF
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    authors: '',
    abstract: '',
    keywords: '',
    category: '',
    wordCount: '',
    pdfFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadAuthorPapers();
  }, []);

  const loadAuthorPapers = async () => {
    try {
      setLoading(true);
      const allPapers = await mockAPI.getAllPapers();
      const authorPapers = allPapers.filter(paper => 
        paper.authors.some(author => author.includes(user.name.split(' ')[0]))
      );
      setPapers(authorPapers);
    } catch (error) {
      console.error('Error loading papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFormChange = (e) => {
    const { name, value, files } = e.target;
    setUploadFormData({
      ...uploadFormData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmitPaper = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const paperData = {
        title: uploadFormData.title,
        authors: uploadFormData.authors.split(',').map(author => author.trim()),
        abstract: uploadFormData.abstract,
        keywords: uploadFormData.keywords.split(',').map(keyword => keyword.trim()),
        category: uploadFormData.category,
        wordCount: parseInt(uploadFormData.wordCount),
        submissionFee: 150,
        paymentStatus: 'pending'
      };

      const result = await mockAPI.submitPaper(paperData);
      if (result.success) {
        setAlert({ type: 'success', message: 'Paper submitted successfully!' });
        setShowUploadForm(false);
        setUploadFormData({
          title: '',
          authors: '',
          abstract: '',
          keywords: '',
          category: '',
          wordCount: '',
          pdfFile: null
        });
        loadAuthorPapers();
      } else {
        setAlert({ type: 'error', message: 'Failed to submit paper. Please try again.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while submitting the paper.' });
    } finally {
      setUploading(false);
    }
  };

  const handlePayment = async (paperId) => {
    try {
      const paper = papers.find(p => p.id === paperId);
      if (paper) {
        paper.paymentStatus = 'paid';
        setAlert({ type: 'success', message: 'Payment processed successfully!' });
        loadAuthorPapers();
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Payment failed. Please try again.' });
    }
  };

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
        <LoadingSpinner size="lg" text="Loading your papers..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-academic-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-academic-900 mb-3 leading-tight">
            Author Dashboard
          </h1>
          <p className="text-academic-600 text-lg">
            Welcome back, <span className="font-medium">{user.name}</span>. Track your research submissions and manage your academic portfolio.
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
          <div className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-academic-500 uppercase tracking-wide">Submitted</p>
                <p className="text-3xl font-bold text-academic-900 mt-1">{stats.submitted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-academic-500 uppercase tracking-wide">Under Review</p>
                <p className="text-3xl font-bold text-academic-900 mt-1">{stats.under_review}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-academic-500 uppercase tracking-wide">Published</p>
                <p className="text-3xl font-bold text-academic-900 mt-1">{stats.published}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 transition-all duration-300 hover:shadow-md">
            <div className="flex items-center">
              <div className="p-3 bg-red-50 rounded-xl">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-academic-500 uppercase tracking-wide">Rejected</p>
                <p className="text-3xl font-bold text-academic-900 mt-1">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
      <div className="mb-10">
    <button
      onClick={() => navigate('/submitform')} // 👈 Use the hook
      className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
    >
      Submit New Paper
    </button>
  </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-academic-900">Submit New Paper</h2>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="text-academic-400 hover:text-academic-600 hover:bg-academic-100 rounded-full p-2 transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmitPaper} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-academic-700 mb-2">Paper Title</label>
                    <input
                      type="text"
                      name="title"
                      value={uploadFormData.title}
                      onChange={handleUploadFormChange}
                      className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Enter paper title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-academic-700 mb-2">Authors (comma-separated)</label>
                    <input
                      type="text"
                      name="authors"
                      value={uploadFormData.authors}
                      onChange={handleUploadFormChange}
                      className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="Author 1, Author 2, Author 3"
                      required
                    />
                    <p className="mt-1 text-xs text-academic-500">Include all contributing authors in order of contribution</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-academic-700 mb-2">Abstract</label>
                    <textarea
                      name="abstract"
                      value={uploadFormData.abstract}
                      onChange={handleUploadFormChange}
                      className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 resize-none"
                      placeholder="Enter paper abstract (150-300 words)"
                      rows="6"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-academic-700 mb-2">Keywords (comma-separated)</label>
                    <input
                      type="text"
                      name="keywords"
                      value={uploadFormData.keywords}
                      onChange={handleUploadFormChange}
                      className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                      placeholder="keyword1, keyword2, keyword3"
                      required
                    />
                    <p className="mt-1 text-xs text-academic-500">3-8 keywords that best represent your paper</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">Category</label>
                      <select
                        name="category"
                        value={uploadFormData.category}
                        onChange={handleUploadFormChange}
                        className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Environmental Science">Environmental Science</option>
                        <option value="Biomedical Engineering">Biomedical Engineering</option>
                        <option value="Physics">Physics</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Chemistry">Chemistry</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-academic-700 mb-2">Word Count</label>
                      <input
                        type="number"
                        name="wordCount"
                        value={uploadFormData.wordCount}
                        onChange={handleUploadFormChange}
                        className="w-full px-4 py-3 border border-academic-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
                        placeholder="e.g., 5000"
                        min="500"
                        required
                      />
                      <p className="mt-1 text-xs text-academic-500">Minimum 500 words</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-academic-700 mb-2">PDF File</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-academic-300 border-dashed rounded-lg hover:border-academic-400 transition-colors duration-200">
                      <div className="space-y-1 text-center">
                        <svg className="mx-auto h-12 w-12 text-academic-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="flex text-sm text-academic-600">
                          <label className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              name="pdfFile"
                              accept=".pdf"
                              onChange={handleUploadFormChange}
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-academic-500">PDF up to 20MB</p>
                        {uploadFormData.pdfFile && (
                          <p className="text-sm text-green-600 font-medium">
                            <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {uploadFormData.pdfFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-academic-50 p-5 rounded-xl border border-academic-200">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-academic-900">Submission Information</h3>
                        <div className="mt-2 text-sm text-academic-600">
                          <p>Submission fee: <strong className="text-lg text-primary-600">$150</strong></p>
                          <p className="mt-1">Payment is required to initiate the review process. You can pay immediately after submission.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                      {uploading ? (
                        <span className="flex items-center">
                          <LoadingSpinner size="sm" text="" />
                          <span className="ml-2">Submitting...</span>
                        </span>
                      ) : 'Submit Paper'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="flex-1 py-3 px-4 bg-academic-200 hover:bg-academic-300 text-academic-700 font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-academic-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-academic-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'submissions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-academic-500 hover:text-academic-700 hover:border-academic-300'
                }`}
              >
                All Submissions ({papers.length})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === 'pending'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-academic-500 hover:text-academic-700 hover:border-academic-300'
                }`}
              >
                Pending Payment ({stats.submitted})
              </button>
            </nav>
          </div>
        </div>

        {/* Papers List */}
        {activeTab === 'submissions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-academic-900 line-clamp-2 leading-tight">
                    {paper.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    paper.status === 'published' ? 'bg-green-100 text-green-800' :
                    paper.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' :
                    paper.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {paper.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium text-academic-700 text-sm w-20">Authors:</span>
                    <span className="text-sm text-academic-600">{paper.authors.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-academic-700 text-sm w-20">Category:</span>
                    <span className="text-sm text-academic-600">{paper.category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-academic-700 text-sm w-20">Submitted:</span>
                    <span className="text-sm text-academic-600">{new Date(paper.submissionDate).toLocaleDateString()}</span>
                  </div>
                  {paper.publicationDate && (
                    <div className="flex items-center">
                      <span className="font-medium text-academic-700 text-sm w-20">Published:</span>
                      <span className="text-sm text-academic-600">{new Date(paper.publicationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-academic-700 text-sm leading-relaxed line-clamp-3">
                    {paper.abstract}
                  </p>
                </div>

                {paper.status === 'submitted' && paper.paymentStatus === 'pending' && (
                  <div className="pt-4 border-t border-academic-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-sm text-academic-600 font-medium">
                          Submission fee: <span className="text-lg font-bold text-primary-600">$150</span>
                        </span>
                        <p className="text-xs text-academic-500 mt-1">Complete payment to begin review</p>
                      </div>
                      <button
                        onClick={() => handlePayment(paper.id)}
                        className="py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                )}

                {paper.status === 'submitted' && paper.paymentStatus === 'paid' && (
                  <div className="pt-4 border-t border-academic-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span className="text-sm text-green-600 font-medium">Payment completed</span>
                      </div>
                      <span className="text-sm text-academic-500">
                        Awaiting reviewer assignment
                      </span>
                    </div>
                  </div>
                )}

                {paper.status === 'under_review' && (
                  <div className="pt-4 border-t border-academic-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-academic-600">Currently under review</span>
                    </div>
                    {paper.reviewDeadline && (
                      <p className="text-xs text-academic-500 mt-1">
                        Estimated completion: {new Date(paper.reviewDeadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}

                {paper.status === 'published' && (
                  <div className="pt-4 border-t border-academic-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-green-600 font-medium">Congratulations! Your paper has been published.</span>
                    </div>
                    {paper.doi && (
                      <p className="text-xs text-academic-600 mt-1">
                        DOI: {paper.doi}
                      </p>
                    )}
                  </div>
                )}

                {paper.status === 'rejected' && (
                  <div className="pt-4 border-t border-academic-200">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span className="text-sm text-red-600">This paper was not accepted for publication.</span>
                    </div>
                    <p className="text-xs text-academic-500 mt-1">
                      Consider revising based on feedback and resubmitting.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.filter(paper => paper.status === 'submitted' && paper.paymentStatus === 'pending').map(paper => (
              <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-academic-200 p-6 hover:shadow-md transition-all duration-300">
                <h3 className="text-lg font-semibold text-academic-900 mb-4 line-clamp-2">
                  {paper.title}
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-academic-600 font-medium">
                      Submission fee: <span className="text-lg font-bold text-primary-600">$150</span>
                    </p>
                    <p className="text-xs text-academic-500 mt-1">
                      Submitted on {new Date(paper.submissionDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-academic-500 mt-1">
                      Complete payment to initiate review process
                    </p>
                  </div>
                  <button
                    onClick={() => handlePayment(paper.id)}
                    className="py-2 px-5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {papers.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-academic-200">
            <div className="text-academic-300 text-6xl mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-academic-700 mb-2">
              No Papers Submitted Yet
            </h3>
            <p className="text-academic-500 max-w-md mx-auto mb-6">
              Start your academic journey by submitting your first research paper. We're excited to review your work!
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
            >
              Submit Your First Paper
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthorDashboard;