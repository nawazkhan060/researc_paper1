import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { mockAPI } from '../data/mockData';

const JournalIssues = () => {
  // Mock data simulation - replace with real data from your API/backend
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIssuePapers, setCurrentIssuePapers] = useState([]);
  const [papersLoading, setPapersLoading] = useState(false);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [archiveIssuePapers, setArchiveIssuePapers] = useState({});
  const [archivePapersLoadingId, setArchivePapersLoadingId] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await mockAPI.getIssues();
        const sorted = (data || []).slice().sort((a, b) => b.year - a.year || b.issue - a.issue);
        setIssues(sorted);
      } catch (error) {
        console.error('Error loading issues:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  const currentIssue = issues.find(issue => issue.isCurrent);
  const archives = issues.filter(issue => !issue.isCurrent);

  useEffect(() => {
    const loadCurrentIssuePapers = async () => {
      const issue = issues.find((i) => i.isCurrent);
      if (!issue) {
        setCurrentIssuePapers([]);
        return;
      }

      try {
        setPapersLoading(true);
        const papers = await mockAPI.getIssuePapers(issue.id);
        setCurrentIssuePapers(papers || []);
      } catch (error) {
        console.error('Error loading current issue papers:', error);
        setCurrentIssuePapers([]);
      } finally {
        setPapersLoading(false);
      }
    };

    if (issues && issues.length > 0) {
      loadCurrentIssuePapers();
    } else {
      setCurrentIssuePapers([]);
    }
  }, [issues]);

  // Group archives by volume
  const archivesByVolume = archives.reduce((acc, issue) => {
    const volumeKey = `Volume ${issue.volume}`;
    if (!acc[volumeKey]) {
      acc[volumeKey] = [];
    }
    acc[volumeKey].push(issue);
    return acc;
  }, {});

  const mapBackendPaperToIssueCard = (paper) => ({
    id: paper.id,
    title: paper.title,
    authors: paper.authors || [],
    category: paper.category || 'N/A',
    doi: paper.doi || 'N/A',
    abstract: paper.abstract || '',
    keywords: paper.keywords || [],
    submittedDate: paper.submissionDate
      ? new Date(paper.submissionDate).toLocaleDateString()
      : 'N/A',
    publishedDate: paper.publicationDate
      ? new Date(paper.publicationDate).toLocaleDateString()
      : 'N/A',
    citations: paper.citationCount || 0,
    status: (paper.status || 'Published').replace('_', ' ').toUpperCase(),
    pdfUrl: paper.pdfUrl || null,
  });

  const handleArchiveIssueClick = async (issue) => {
    if (!issue) return;

    if (expandedIssueId === issue.id) {
      setExpandedIssueId(null);
      return;
    }

    setExpandedIssueId(issue.id);

    if (archiveIssuePapers[issue.id]) {
      return;
    }

    try {
      setArchivePapersLoadingId(issue.id);
      const papers = await mockAPI.getIssuePapers(issue.id);
      setArchiveIssuePapers((prev) => ({
        ...prev,
        [issue.id]: papers || [],
      }));
    } catch (error) {
      console.error('Error loading archive issue papers:', error);
      setArchiveIssuePapers((prev) => ({
        ...prev,
        [issue.id]: [],
      }));
    } finally {
      setArchivePapersLoadingId(null);
    }
  };

  // Render individual paper card (for current issue only)
  const PaperCard = ({ paper }) => (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
            {paper.title}
          </h3>
          <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            {paper.status}
          </span>
        </div>

        <div className="mb-3">
          <p className="text-sm text-slate-600 mb-1">
            <strong>Authors:</strong> {paper.authors.join(", ")}
          </p>
          <p className="text-sm text-slate-600">
            <strong>Category:</strong> {paper.category}
          </p>
        </div>

        <div className="mb-3">
          <p className="text-sm text-slate-600 mb-1">
            <strong>DOI:</strong> <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">{paper.doi}</a>
          </p>
        </div>

        <p className="text-sm text-slate-700 mb-4 line-clamp-3">
          {paper.abstract}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {paper.keywords.map((keyword, index) => (
            <span key={index} className="inline-flex items-center px-2 py-1 bg-slate-100 text-slate-800 text-xs rounded-full">
              {keyword}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500 mb-4">
          <span>Submitted: {paper.submittedDate}</span>
          <span>Published: {paper.publishedDate}</span>
          <span>Citations: {paper.citations}</span>
        </div>

        <a
          href={paper.pdfUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          View Full Paper
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Journal <span className="text-amber-200">Issues</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore current and archived issues of IJEPA featuring peer-reviewed research across engineering disciplines.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <div className="text-center mb-16">
            <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
              The <strong>International Journal of Engineering Practices and Applications (IJEPA)</strong> publishes regular issues featuring high-quality research articles, reviews, and case studies across diverse engineering domains. Our issues provide a global platform for disseminating knowledge and fostering innovation in engineering practices and applications.
            </p>
          </div>

          {/* Current Issue - Single Card */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Current Issue</h2>
            </div>

            {loading ? (
              <div className="text-center text-slate-500">Loading current issue...</div>
            ) : currentIssue ? (
              <>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Volume {currentIssue.volume}, Issue {currentIssue.issue} – {currentIssue.month}, {currentIssue.year}
                  </h3>
                  <p className="text-slate-600">Articles published in this issue.</p>
                </div>

                {papersLoading ? (
                  <div className="text-center text-slate-500">Loading papers for this issue...</div>
                ) : currentIssuePapers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {currentIssuePapers.map((paper) => (
                      <PaperCard key={paper.id} paper={mapBackendPaperToIssueCard(paper)} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                    <p className="text-slate-600">No papers have been assigned to this issue yet.</p>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
                <p className="text-slate-600">No current issue is available at the moment.</p>
              </div>
            )}
          </section>

          {/* Archives */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M9 11a2 2 0 11-4 0m8 0a2 2 0 11-4 0m-4 8a2 2 0 012-2h8a2 2 0 012 2v2M5 19h14a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Archives</h2>
            </div>

            <p className="text-slate-700 mb-6">
              Explore previously published volumes and issues of IJEPA. All articles are available in full text under our open-access policy.
            </p>

            {loading ? (
              <div className="text-center text-slate-500">Loading archives...</div>
            ) : (
              <div className="space-y-12">
                {Object.entries(archivesByVolume).map(([volume, issuesInVolume]) => (
                  <section key={volume}>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">{volume}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {issuesInVolume.map((issue) => (
                        <div
                          key={issue.id}
                          className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
                          onClick={() => handleArchiveIssueClick(issue)}
                        >
                          <h4 className="text-lg font-bold text-slate-900 mb-3 flex items-center justify-between">
                            <span>
                              Issue {issue.issue}, {issue.year}
                            </span>
                            <span className="text-xs text-amber-700">
                              {expandedIssueId === issue.id ? 'Hide Articles' : 'View Articles'}
                            </span>
                          </h4>

                          {expandedIssueId === issue.id && (
                            <div className="mt-4 border-t border-slate-200 pt-4 space-y-3">
                              {archivePapersLoadingId === issue.id ? (
                                <p className="text-sm text-slate-500">Loading papers for this issue...</p>
                              ) : (archiveIssuePapers[issue.id] || []).length === 0 ? (
                                <p className="text-sm text-slate-500">No papers have been assigned to this issue yet.</p>
                              ) : (
                                (archiveIssuePapers[issue.id] || []).map((paper) => (
                                  <div key={paper.id} className="text-sm">
                                    <a
                                      href={paper.pdfUrl || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="font-semibold text-amber-800 hover:text-amber-900 hover:underline"
                                    >
                                      {paper.title}
                                    </a>

                                    <p className="text-slate-600 text-xs mt-1">
                                      {Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors}
                                    </p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>

          {/* Publication Frequency & Access Policy */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Publication Frequency</h3>
              </div>
              <p className="text-slate-700">
                IJEPA publishes <strong>Monthly</strong>. Special issues on emerging topics in engineering may also be announced periodically.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Access Policy</h3>
              </div>
              <p className="text-slate-700">
                All journal issues are published online and made <strong>freely accessible</strong> under our open-access policy, ensuring maximum visibility and citation for authors.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <div className="text-center py-10 bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl border border-amber-100">
            <p className="text-lg text-slate-700 mb-4">
              To publish in upcoming issues, please visit our Call for Papers page.
            </p>
            <a
              href="/call-for-papers"
              className="inline-flex items-center px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              Call for Papers
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </main>

      
    </div>
  );
};

export default JournalIssues;