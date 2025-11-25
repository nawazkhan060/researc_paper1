import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PaperCard from '../components/PaperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import { mockAPI } from '../data/mockData';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');
  const [papers, setPapers] = useState([]);
  const [paperReviews, setPaperReviews] = useState({});
  const [reviewers, setReviewers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [issues, setIssues] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [paperIssueAssignments, setPaperIssueAssignments] = useState({});
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [issuePapersByIssueId, setIssuePapersByIssueId] = useState({});
  const [issuePapersLoadingId, setIssuePapersLoadingId] = useState(null);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [alert, setAlert] = useState(null);
  const [adminNotifications, setAdminNotifications] = useState([]);

  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewsModalPaper, setReviewsModalPaper] = useState(null);
  const [reviewsModalReviews, setReviewsModalReviews] = useState([]);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionModalPaper, setRevisionModalPaper] = useState(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectModalPaper, setRejectModalPaper] = useState(null);
  const [rejectNote, setRejectNote] = useState('');
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  const [showAssignIssueModal, setShowAssignIssueModal] = useState(false);
  const [assignIssuePaper, setAssignIssuePaper] = useState(null);
  const [selectedIssueId, setSelectedIssueId] = useState('');
  const [assignIssueSubmitting, setAssignIssueSubmitting] = useState(false);

  // Search functionality
  const [issueForm, setIssueForm] = useState({
    volume: '',
    issue: '',
    month: '',
    year: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [reviewerSortBy, setReviewerSortBy] = useState('name_az');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [adminSortBy, setAdminSortBy] = useState('recent');
  const [adminShowAllPapers, setAdminShowAllPapers] = useState(false);

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

  // Load admin notifications based on the logged-in user so we can show revised-manuscript badges
  useEffect(() => {
    const loadNotificationsForAdmin = async () => {
      if (!user || !user.id) {
        setAdminNotifications([]);
        return;
      }

      try {
        const notifResult = await mockAPI.getNotifications(user.id);
        setAdminNotifications(Array.isArray(notifResult) ? notifResult : []);
      } catch (err) {
        console.error('Error loading admin notifications in AdminDashboard', err);
        setAdminNotifications([]);
      }
    };

    loadNotificationsForAdmin();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setIssuesLoading(true);

      const allPapers = await mockAPI.getAllPapers();

      // Load reviews for each paper so admins can see review progress
      const reviewResults = await Promise.all(
        allPapers.map(async (paper) => {
          const reviews = await mockAPI.getReviewsByPaper(paper.id);
          return { paperId: paper.id, reviews };
        })
      );

      const reviewsMap = {};
      reviewResults.forEach(({ paperId, reviews }) => {
        reviewsMap[paperId] = reviews;
      });
      setPaperReviews(reviewsMap);

      const reviewerUsers = await mockAPI.getReviewers();
      setReviewers(reviewerUsers);

      const loadedIssues = await mockAPI.getIssues();
      setIssues(loadedIssues);

      // Load admin notifications so we can detect revised manuscripts
      if (user && user.id) {
        try {
          const notifResult = await mockAPI.getNotifications(user.id);
          setAdminNotifications(Array.isArray(notifResult) ? notifResult : []);
        } catch (err) {
          console.error('Error loading admin notifications in dashboard', err);
          setAdminNotifications([]);
        }
      } else {
        setAdminNotifications([]);
      }

      // Load issue assignments so we know which issue each published paper belongs to
      const assignments = await mockAPI.getIssueAssignments();
      const assignmentsByPaperId = {};
      assignments.forEach((assignment) => {
        if (assignment && assignment.paperId && assignment.issue) {
          assignmentsByPaperId[assignment.paperId] = assignment.issue;
        }
      });
      setPaperIssueAssignments(assignmentsByPaperId);

      // Attach assignedIssue info to each paper for easier rendering
      const papersWithAssignments = (allPapers || []).map((paper) => ({
        ...paper,
        assignedIssue: assignmentsByPaperId[paper.id] || null,
      }));
      setPapers(papersWithAssignments);
    } catch (error) {
      console.error('Error loading admin ', error);
    } finally {
      setLoading(false);
      setIssuesLoading(false);
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

  const openRequestRevisionsModal = (paper) => {
    if (!paper) return;
    setRevisionModalPaper(paper);
    setRevisionNote('');
    setShowRevisionModal(true);
  };

  const handleRequestRevisions = async () => {
    if (!revisionModalPaper) return;

    const note = revisionNote.trim();
    if (!note) {
      setAlert({ type: 'error', message: 'Please describe the requested changes before sending a revision request.' });
      return;
    }

    try {
      setRevisionSubmitting(true);
      const result = await mockAPI.requestRevisions(revisionModalPaper.id, note);
      if (result.success) {
        setAlert({ type: 'success', message: 'Revision request sent to the author.' });
        setShowRevisionModal(false);
        setRevisionModalPaper(null);
        setRevisionNote('');
        loadAdminData();
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to request revisions.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while requesting revisions.' });
    } finally {
      setRevisionSubmitting(false);
    }
  };

  const openRejectPaperModal = (paper) => {
    if (!paper) return;
    setRejectModalPaper(paper);
    setRejectNote('');
    setShowRejectModal(true);
  };

  const handleRejectPaper = async () => {
    if (!rejectModalPaper) return;

    try {
      setRejectSubmitting(true);
      const note = rejectNote.trim();
      const result = await mockAPI.rejectPaper(rejectModalPaper.id, note || undefined);
      if (result.success) {
        setAlert({ type: 'success', message: 'Paper rejected and author notified.' });
        setShowRejectModal(false);
        setRejectModalPaper(null);
        setRejectNote('');
        loadAdminData();
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to reject paper.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while rejecting the paper.' });
    } finally {
      setRejectSubmitting(false);
    }
  };

  const openAssignPaperToIssueModal = (paper) => {
    if (!paper) return;

    if (!issues || issues.length === 0) {
      setAlert({ type: 'error', message: 'No issues available. Please create an issue first in the Journal Issues tab.' });
      return;
    }

    setAssignIssuePaper(paper);
    if (issues.length > 0) {
      setSelectedIssueId(String(issues[0].id));
    } else {
      setSelectedIssueId('');
    }
    setShowAssignIssueModal(true);
  };

  const handleAssignPaperToIssue = async () => {
    if (!assignIssuePaper || !selectedIssueId) return;

    const issueId = parseInt(selectedIssueId, 10);
    if (Number.isNaN(issueId)) {
      setAlert({ type: 'error', message: 'Invalid issue ID.' });
      return;
    }

    try {
      setAssignIssueSubmitting(true);
      const result = await mockAPI.assignPaperToIssue(assignIssuePaper.id, issueId);
      if (result.success) {
        setAlert({ type: 'success', message: 'Paper assigned to issue successfully.' });
        setShowAssignIssueModal(false);
        setAssignIssuePaper(null);
        setSelectedIssueId('');
        loadAdminData(); // Refresh admin data after assigning paper to issue
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to assign paper to issue.' });
      }
    } catch (error) {
      console.error('Error assigning paper to issue:', error);
      setAlert({ type: 'error', message: 'An error occurred while assigning the paper to an issue.' });
    } finally {
      setAssignIssueSubmitting(false);
    }
  };

  const handleIssueFormChange = (e) => {
    const { name, value } = e.target;
    setIssueForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddIssue = async (e) => {
    e.preventDefault();

    try {
      const volume = parseInt(issueForm.volume, 10);
      const issueNumber = parseInt(issueForm.issue, 10);
      const year = parseInt(issueForm.year, 10);

      const result = await mockAPI.createIssue({
        volume,
        issue: issueNumber,
        month: issueForm.month,
        year,
      });

      if (result.success && result.issue) {
        setIssues(prev => [result.issue, ...prev].sort((a, b) => b.year - a.year || b.issue - a.issue));
        setIssueForm({ volume: '', issue: '', month: '', year: '' });
        setAlert({ type: 'success', message: 'New issue added successfully.' });
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to add issue.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while adding the issue.' });
    }
  };

  const handleDeleteIssue = async (issueId) => {
    try {
      const result = await mockAPI.deleteIssue(issueId);
      if (result.success) {
        setIssues(prev => prev.filter(issue => issue.id !== issueId));
        setAlert({ type: 'success', message: 'Issue deleted successfully.' });
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to delete issue.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while deleting the issue.' });
    }
  };

  const handleSetCurrentIssue = async (issueId) => {
    try {
      const result = await mockAPI.setCurrentIssue(issueId);
      if (result.success && result.issue) {
        const updated = result.issue;
        setIssues(prev =>
          prev.map(issue => ({
            ...issue,
            isCurrent: issue.id === updated.id,
          }))
        );
        setAlert({ type: 'success', message: 'Current issue has been updated.' });
      } else {
        setAlert({ type: 'error', message: result.error || 'Failed to update current issue.' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'An error occurred while updating the current issue.' });
    }
  };

  const handleIssueClick = async (issue) => {
    if (!issue) return;

    if (expandedIssueId === issue.id) {
      setExpandedIssueId(null);
      return;
    }

    setExpandedIssueId(issue.id);

    if (issuePapersByIssueId[issue.id]) {
      return;
    }

    try {
      setIssuePapersLoadingId(issue.id);
      const papers = await mockAPI.getIssuePapers(issue.id);
      setIssuePapersByIssueId((prev) => ({
        ...prev,
        [issue.id]: papers || [],
      }));
    } catch (error) {
      console.error('Error loading papers for issue', issue.id, error);
      setIssuePapersByIssueId((prev) => ({
        ...prev,
        [issue.id]: [],
      }));
      setIssuePapersLoadingId(null);
    }
  };

  const reviewerSearch = searchTerm.trim().toLowerCase();

  let filteredReviewers = reviewers.filter((reviewer) => {
    const name = (reviewer.name || '').toLowerCase();
    const email = (reviewer.email || '').toLowerCase();
    const affiliation = (reviewer.affiliation || '').toLowerCase();

    if (!reviewerSearch) return true;

    return (
      name.includes(reviewerSearch) ||
      email.includes(reviewerSearch) ||
      affiliation.includes(reviewerSearch)
    );
  });

  filteredReviewers = [...filteredReviewers].sort((a, b) => {
    if (reviewerSortBy === 'name_az') {
      return (a.name || '').localeCompare(b.name || '');
    }

    if (reviewerSortBy === 'name_za') {
      return (b.name || '').localeCompare(a.name || '');
    }

    if (reviewerSortBy === 'affiliation_az') {
      return (a.affiliation || '').localeCompare(b.affiliation || '');
    }

    return 0;
  });

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

  const adminSearch = adminSearchTerm.trim().toLowerCase();

  const matchesAdminSearch = (paper) => {
    if (!adminSearch) return true;

    const title = (paper.title || '').toLowerCase();
    const abstract = (paper.abstract || '').toLowerCase();
    const category = (paper.category || '').toLowerCase();
    const authorsText = Array.isArray(paper.authors) ? paper.authors.join(' ').toLowerCase() : String(paper.authors || '').toLowerCase();

    return (
      title.includes(adminSearch) ||
      abstract.includes(adminSearch) ||
      category.includes(adminSearch) ||
      authorsText.includes(adminSearch)
    );
  };

  const adminUnfinishedStatuses = ['submitted', 'under_review', 'revisions_requested'];

  let visibleAdminPapers = (papers || []).filter(matchesAdminSearch);

  if (!adminShowAllPapers) {
    visibleAdminPapers = visibleAdminPapers.filter(paper => adminUnfinishedStatuses.includes(paper.status));
  }

  visibleAdminPapers = [...visibleAdminPapers].sort((a, b) => {
    if (adminSortBy === 'title_az') {
      return (a.title || '').localeCompare(b.title || '');
    }

    if (adminSortBy === 'title_za') {
      return (b.title || '').localeCompare(a.title || '');
    }

    const dateA = a.submissionDate ? new Date(a.submissionDate) : new Date(0);
    const dateB = b.submissionDate ? new Date(b.submissionDate) : new Date(0);

    if (adminSortBy === 'oldest') {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  const underReviewPapersBase = (papers || []).filter(
    (p) => p.status === 'under_review' || p.status === 'revisions_requested'
  );

  let visibleUnderReviewPapers = underReviewPapersBase.filter(matchesAdminSearch);

  visibleUnderReviewPapers = [...visibleUnderReviewPapers].sort((a, b) => {
    if (adminSortBy === 'title_az') {
      return (a.title || '').localeCompare(b.title || '');
    }

    if (adminSortBy === 'title_za') {
      return (b.title || '').localeCompare(a.title || '');
    }

    const dateA = a.submissionDate ? new Date(a.submissionDate) : new Date(0);
    const dateB = b.submissionDate ? new Date(b.submissionDate) : new Date(0);

    if (adminSortBy === 'oldest') {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  const hasRevisedManuscript = (paper) => {
    if (!paper || !paper.title || !Array.isArray(adminNotifications)) return false;
    return adminNotifications.some((n) =>
      n && n.title === 'Revised manuscript uploaded' &&
      typeof n.message === 'string' && n.message.includes(paper.title)
    );
  };

  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading admin data..." />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
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
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <input
                type="text"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                placeholder="Search by title, author, category..."
                className="w-full md:max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="flex items-center gap-3">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recent">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title_az">Title A-Z</option>
                  <option value="title_za">Title Z-A</option>
                </select>
                <button
                  type="button"
                  onClick={() => setAdminShowAllPapers(prev => !prev)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {adminShowAllPapers ? 'Show unfinished only' : 'View all papers'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleAdminPapers.map(paper => (
                <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                    <span className={`${
                      paper.status === 'published' ? 'badge-success' :
                      paper.status === 'under_review' ? 'badge-warning' :
                      paper.status === 'submitted' ? 'badge-info' :
                      'badge-danger'
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

                  {paper.status === 'published' && issues.length > 0 && (
                    <div className="pt-4 border-t border-gray-200">
                      {paper.assignedIssue ? (
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                            Assigned to Volume {paper.assignedIssue.volume}, Issue {paper.assignedIssue.issue}
                          </span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAssignPaperToIssueModal(paper)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-full shadow-sm transition"
                        >
                          Add to Journal Issue
                        </button>
                      )}
                    </div>
                  )}

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
          </>
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
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <input
                type="text"
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                placeholder="Search by title, author, category..."
                className="w-full md:max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <div className="flex items-center gap-3">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="recent">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title_az">Title A-Z</option>
                  <option value="title_za">Title Z-A</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {visibleUnderReviewPapers.map(paper => {
                const reviews = paperReviews[paper.id] || [];
                const latestRecommendation = reviews[0]?.recommendation || '';

                return (
                  <div key={paper.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 mr-3 space-y-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{paper.title}</h3>
                        {paper.status === 'revisions_requested' && (
                          <span className="inline-flex items-center px-2 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full">
                            Revision requested / waiting for updated manuscript
                          </span>
                        )}
                        {hasRevisedManuscript(paper) && (
                          <span className="badge-revised">
                            Revised manuscript received
                          </span>
                        )}
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 whitespace-nowrap">
                        UNDER REVIEW
                      </span>
                    </div>

                    {reviews.length > 0 && (
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => {
                            setReviewsModalPaper(paper);
                            setReviewsModalReviews(reviews);
                            setShowReviewsModal(true);
                          }}
                          className="mt-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View all reviews
                        </button>
                      </div>
                    )}

                    <div className="mb-4 space-y-2 text-sm">
                      <div><span className="font-medium">Authors:</span> {paper.authors.join(', ')}</div>
                      <div><span className="font-medium">Category:</span> {paper.category}</div>
                      <div><span className="font-medium">Submitted:</span> {new Date(paper.submissionDate).toLocaleDateString()}</div>
                      {paper.reviewDeadline && (
                        <div><span className="font-medium">Deadline:</span> {new Date(paper.reviewDeadline).toLocaleDateString()}</div>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm mb-5 line-clamp-3">{paper.abstract}</p>

                    {paper.assignedReviewers && (
                      <div className="mb-5 text-sm text-gray-600">
                        <span className="font-medium">Assigned Reviewers:</span> {paper.assignedReviewers.length}
                      </div>
                    )}

                    {reviews.length > 0 && (
                      <div className="mb-5 text-sm text-gray-700">
                        <span className="font-medium">Completed Reviews:</span> {reviews.length}
                        {latestRecommendation && (
                          <button
                            type="button"
                            onClick={() => {
                              setReviewsModalPaper(paper);
                              setReviewsModalReviews(reviews);
                              setShowReviewsModal(true);
                            }}
                            className="ml-3 inline-flex items-center px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200 transition"
                          >
                            Recommendation:
                            <span className="ml-1 capitalize">
                              {latestRecommendation.replace('_', ' ')}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    {reviews.length === 0 && (
                      <p className="mb-5 text-xs text-gray-500">
                        At least one completed review is required before making a final decision.
                      </p>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handlePublishPaper(paper.id)}
                          disabled={reviews.length === 0}
                          className="Btn disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <strong>Publish Paper</strong>
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
                );
              })}
            </div>
          </>
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
                          <button
                            onClick={() => handleIssueClick(issue)}
                            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md"
                          >
                            {expandedIssueId === issue.id ? 'Hide Papers' : 'View Papers'}
                          </button>
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

                      {expandedIssueId === issue.id && (
                        <div className="mt-3 pt-3 border-t border-gray-200 space-y-2 text-sm">
                          {issuePapersLoadingId === issue.id ? (
                            <p className="text-gray-500">Loading papers for this issue...</p>
                          ) : (issuePapersByIssueId[issue.id] || []).length === 0 ? (
                            <p className="text-gray-500">No papers have been assigned to this issue yet.</p>
                          ) : (
                            (issuePapersByIssueId[issue.id] || []).map((paper) => (
                              <div key={paper.id} className="flex flex-col">
                                <a
                                  href={paper.pdfUrl || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                                >
                                  {paper.title}
                                </a>
                                <span className="text-xs text-gray-600">
                                  {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
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
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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

                <div className="mb-6" ref={dropdownRef}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="relative flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Search Reviewers</label>
                      <input
                        ref={inputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, or affiliation..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none mt-5 sm:mt-0">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>

                    <div className="w-full sm:w-56">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                      <select
                        value={reviewerSortBy}
                        onChange={(e) => setReviewerSortBy(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="name_az">Name A-Z</option>
                        <option value="name_za">Name Z-A</option>
                        <option value="affiliation_az">Affiliation A-Z</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg max-h-72 overflow-y-auto divide-y">
                    {filteredReviewers.length > 0 ? (
                      filteredReviewers.map((reviewer) => (
                        <button
                          type="button"
                          key={reviewer.id}
                          onClick={() => {
                            setSelectedReviewer(String(reviewer.id));
                            setSearchTerm(reviewer.name || reviewer.email || '');
                          }}
                          className={`w-full text-left px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 ${
                            selectedReviewer === String(reviewer.id)
                              ? 'bg-blue-50 border-l-4 border-blue-400'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-gray-900">
                              {reviewer.name || 'Unnamed reviewer'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {reviewer.email && <span>{reviewer.email}</span>}
                              {reviewer.affiliation && (
                                <span className="ml-1">
                                  • {reviewer.affiliation}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-sm text-gray-500 text-center">
                        No reviewers found. Try a different search.
                      </div>
                    )}
                  </div>
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

        {/* Reviews Modal */}
        {showReviewsModal && reviewsModalPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reviews for this paper</h2>
                  <button
                    onClick={() => setShowReviewsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{reviewsModalPaper.title}</h3>
                  <p className="text-sm text-gray-600">Authors: {reviewsModalPaper.authors.join(', ')}</p>
                </div>

                {reviewsModalReviews.length === 0 ? (
                  <p className="text-sm text-gray-600">No reviews have been submitted yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviewsModalReviews.map(review => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              Reviewer: {review.reviewerName || `#${review.reviewerId}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              Submitted on {review.submittedDate ? new Date(review.submittedDate).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-gray-800">
                            Rating: {review.rating}/5
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Recommendation:</span>{' '}
                          <span className="capitalize">{review.recommendation.replace('_', ' ')}</span>
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">
                          {review.comments}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => openRequestRevisionsModal(reviewsModalPaper)}
                    className="py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-sm font-medium rounded-lg transition"
                  >
                    Request Revisions
                  </button>
                  <button
                    type="button"
                    onClick={() => openRejectPaperModal(reviewsModalPaper)}
                    className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition"
                  >
                    Reject Paper
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewsModal(false)}
                    className="ml-auto py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Request Revisions Modal */}
        {showRevisionModal && revisionModalPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Request Revisions</h2>
                  <button
                    onClick={() => {
                      setShowRevisionModal(false);
                      setRevisionModalPaper(null);
                      setRevisionNote('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{revisionModalPaper.title}</h3>
                  <p className="text-xs text-gray-600">
                    This message will be sent to the author. Please clearly describe the requested changes.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to author
                  </label>
                  <textarea
                    value={revisionNote}
                    onChange={(e) => setRevisionNote(e.target.value)}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder="Describe the requested revisions..."
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRequestRevisions}
                    disabled={revisionSubmitting || !revisionNote.trim()}
                    className="flex-1 py-2 px-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 text-white text-sm font-medium rounded-lg transition"
                  >
                    {revisionSubmitting ? 'Sending...' : 'Send Request'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRevisionModal(false);
                      setRevisionModalPaper(null);
                      setRevisionNote('');
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reject Paper Modal */}
        {showRejectModal && rejectModalPaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Reject Paper</h2>
                  <button
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectModalPaper(null);
                      setRejectNote('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{rejectModalPaper.title}</h3>
                  <p className="text-xs text-gray-600">
                    You can optionally include a short note explaining the reason for rejection. This will be shared with the author.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Optional note to author
                  </label>
                  <textarea
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm resize-none"
                    placeholder="Explain briefly why the paper is being rejected (optional)."
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleRejectPaper}
                    disabled={rejectSubmitting}
                    className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium rounded-lg transition"
                  >
                    {rejectSubmitting ? 'Rejecting...' : 'Reject Paper'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRejectModal(false);
                      setRejectModalPaper(null);
                      setRejectNote('');
                    }}
                    className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assign to Issue Modal */}
        {showAssignIssueModal && assignIssuePaper && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Assign to Journal Issue</h2>
                  <button
                    onClick={() => {
                      setShowAssignIssueModal(false);
                      setAssignIssuePaper(null);
                      setSelectedIssueId('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    &times;
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{assignIssuePaper.title}</h3>
                  <p className="text-xs text-gray-600">
                    Choose a journal issue to which this published paper should belong.
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select issue
                  </label>
                  <select
                    value={selectedIssueId}
                    onChange={(e) => setSelectedIssueId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  >
                    <option value="">Choose an issue...</option>
                    {issues.map((issue) => (
                      <option key={issue.id} value={issue.id}>
                        {`Volume ${issue.volume}, Issue ${issue.issue} (${issue.month} ${issue.year})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={handleAssignPaperToIssue}
                    disabled={assignIssueSubmitting || !selectedIssueId}
                    className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium rounded-lg transition"
                  >
                    {assignIssueSubmitting ? 'Assigning...' : 'Assign to Issue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAssignIssueModal(false);
                      setAssignIssuePaper(null);
                      setSelectedIssueId('');
                    }}
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