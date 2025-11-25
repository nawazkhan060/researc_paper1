import React, { useState, useEffect } from 'react';
import PaperCard from '../components/PaperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockAPI } from '../data/mockData';
import hero from "../components/annie-spratt-5cFwQ-WMcJU-unsplash.jpg"

// We will inject Roboto font for Landing page only
const Landing = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredPapers, setFilteredPapers] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    loadPublishedPapers();
  }, []);

  useEffect(() => {
    filterPapers();
  }, [papers, searchTerm, selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadPublishedPapers = async () => {
    try {
      setLoading(true);
      const publishedPapers = await mockAPI.getPublishedPapers();
      setPapers(publishedPapers);
    } catch (error) {
      console.error('Error loading papers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPapers = () => {
    let filtered = papers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(paper =>
        paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper.authors.some(author => 
          author.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        paper.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(paper => paper.category === selectedCategory);
    }

    setFilteredPapers(filtered);
  };

  const categories = ['all', ...new Set(papers.map(paper => paper.category))];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading published papers...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
        .landing-page-roboto { font-family: 'Roboto', sans-serif; }
      `}</style>
      <div className="min-h-full bg-slate-50 landing-page-roboto">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hero})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        
      }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <span className="text-indigo-300 text-sm font-medium">Trusted by 500+ Researchers Worldwide</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Publish Your Research with
              <span className="block bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">IJEPA</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white mb-10 leading-relaxed max-w-3xl mx-auto">
              A seamless platform for authors, reviewers, and editors. Transparent workflows. 
              Trusted by researchers worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/papers"
                className="group bg-white text-slate-900 hover:bg-indigo-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Browse Papers...
                <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="/register"
                className="group border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1"
              >
                  Join Our Platform
              </a>
            </div>
          </div>
        </div>
      </section>
       <section className="bg-gradient-to-br from-slate-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              About <span className="text-indigo-600">IJEPA</span>
            </h2>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-4xl mx-auto text-slate-700 leading-relaxed">
            <p className="mb-6">
              The <strong>International Journal of Engineering Practices and Applications (IJEPA)</strong> is a peer-reviewed, open-access journal dedicated to advancing research, innovation, and practical applications in the field of engineering. Our mission is to serve as a trusted platform for scholars, researchers, practitioners, and industry professionals to share knowledge, exchange ideas, and contribute to the progress of engineering science and technology.
            </p>
            
            <p className="mb-6">
              IJEPA publishes monthly high-quality original research papers, review articles, and case studies that address theoretical foundations, experimental investigations, and real-world applications across diverse engineering disciplines. We welcome interdisciplinary work that bridges the gap between academic research and industry practices, fostering solutions to contemporary challenges.
            </p>

            <div className="mt-12 mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center mr-3">✓</span>
                Our Vision
              </h3>
              <p className="pl-11">
                To become a globally recognized journal that drives innovation, disseminates impactful research, and promotes collaboration across engineering domains.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 text-purple-700 rounded-lg flex items-center justify-center mr-3">✓</span>
                Our Scope
              </h3>
              <p className="pl-11 mb-4">
                IJEPA covers, but is not limited to, the following areas:
              </p>
              <ul className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-2">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Civil, Mechanical, Electrical, and Electronics Engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Computer Science, Information Technology, and Artificial Intelligence</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Industrial, Manufacturing, and Materials Engineering</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Communication, Control, and Instrumentation Systems</span>
                </li>
                <li className="flex items-start md:col-span-2">
                  <span className="text-indigo-600 mr-2">•</span>
                  <span>Sustainable, Green, and Emerging Engineering Practices</span>
                </li>
              </ul>
            </div>

            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center mr-3">✓</span>
                Why Publish with Us?
              </h3>
              <ul className="pl-11 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Rigorous peer-review process ensuring quality and credibility</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Open-access policy for maximum visibility and global reach</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Fast and efficient review and publication cycle</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span>Support for young researchers and academics worldwide</span>
                </li>
              </ul>
            </div>

            <p className="mt-8 text-center text-lg italic text-slate-600">
              "At IJEPA, we believe that engineering is not just about knowledge creation but also about meaningful application. 
              By connecting research with practice, we aim to contribute to technological growth and societal development."
            </p>
          </div>
        </div>
      </section>

      {/* Important Dates Section */}
      

      {/* Search and Filter Section */}
      
      {/* Features Section */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Why Researchers Choose Build Softech
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We provide a comprehensive solution for academic research publication and peer review
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-200">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-200 transition-all duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                Rigorous Peer Review
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed text-center">
                Your paper is reviewed by qualified experts assigned by our editorial team for quality and integrity.
              </p>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-200">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-all duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                Fast Turnaround
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed text-center">
                Streamlined workflows ensure your paper moves quickly from submission to publication.
              </p>
            </div>

            <div className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-slate-200">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-all duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-600">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                Global Visibility
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed text-center">
                Get your research seen by academics and institutions worldwide through our indexed platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">
              Quick Access
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Navigate to key sections of our platform with a single click.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card 1: Indexing & Abstracting */}
              <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                    <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                  Indexing & Abstracting
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed text-center mb-6">
                  Discover where our journal is indexed and abstracted.
                </p>
                <a href="/indexing" className="block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  Learn More
                </a>
              </div>

              {/* Card 2: Journal Issues */}
              <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                    <path d="M4 6h16M4 12h16M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                  Journal Issues
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed text-center mb-6">
                  Browse our past and current journal issues.
                </p>
                <a href="/journal-issues" className="block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  View Issues
                </a>
              </div>

              {/* Card 3: Join as Editor/Reviewer */}
              <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                  Join Our Team
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed text-center mb-6">
                  Become an editor or reviewer for IJEPA.
                </p>
                <a href="/joinusedito" className="block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  Join Now
                </a>
              </div>
            </div>
            <div className="mt-8 flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Card 4: Author Guidelines */}
                <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                    Author Guidelines
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed text-center mb-6">
                    Everything you need to know to prepare your manuscript.
                  </p>
                  <a href="/author-guidelines" className="block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                    Read Guidelines
                  </a>
                </div>

                {/* Card 5: Call for Papers */}
                <div className="group bg-white p-8 rounded-2xl border border-slate-200 transition-all duration-300 hover:border-indigo-300 hover:shadow-md">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-indigo-600">
                      <path d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.148-6.443a1.76 1.76 0 013.417-.592zM11 5.882a1.76 1.76 0 012.592.443l2.148 6.443a1.76 1.76 0 01-3.417.592l-2.148-6.443a1.76 1.76 0 01.825-1.036z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                    Call for Papers
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed text-center mb-6">
                    Submit your latest research to our upcoming issues.
                  </p>
                  <a href="/callforpapers" className="block text-center bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                    Submit Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section - IJEPA */}
     


      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-50"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </div>
  </>
);
};
export default Landing;