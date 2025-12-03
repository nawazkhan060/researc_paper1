import React, { useState, useEffect } from 'react';
import PaperCard from '../components/PaperCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { mockAPI } from '../data/mockData';
import hero from "../components/annie-spratt-5cFwQ-WMcJU-unsplash.jpg";
import StarBorder from '../components/StarBorder';
import LogoLoop from '../components/Logoloop';
import ModelViewer from '../components/Modelviewer';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          } else {
            entry.target.classList.remove('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-5% 0px -5% 0px' }
    );

    // Add fade-ready after a short delay so content is visible on load
    const timeout = setTimeout(() => {
      document.querySelectorAll('.fade-section').forEach((el) => {
        el.classList.add('fade-ready');
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
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
      <div className="flex items-center justify-center bg-slate-50 py-16">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        /* Scroll-triggered fade/slide animation */
        .fade-section {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-section.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        /* Hide after a short delay so observer can work */
        .fade-section.fade-ready {
          opacity: 0;
          transform: translateY(40px);
        }
        .fade-section.fade-ready.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
      <div className="bg-slate-50 landing-page-roboto">
        {/* Hero Section - text left, image right */}
        <section className="bg-slate-50 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <div className="inline-block bg-amber-50 rounded-full px-4 py-2 mb-6 border border-amber-100">
                <span className="text-amber-700 text-sm font-medium">Trusted by 500+ Researchers Worldwide</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                International Journal of Engineering Practices and Applications
                <span className="block text-amber-600 mt-2">IJEPA</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
                A seamless platform for authors, reviewers, and editors. Transparent workflows.
                Trusted by researchers worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/papers"
                  className="group bg-amber-600 text-white hover:bg-amber-700 font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Browse Papers...
                  <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="/register"
                  className="group border-2 border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-1"
                >
                  Join Our Platform
                </a>
              </div>
            </div>

            {/* Right 3D model viewer (native <model-viewer> web component) */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-slate-900/5">
                <model-viewer
                  src="/ijepa.glb"
                  ar
                  ar-modes="webxr scene-viewer quick-look"
                  camera-controls
                  auto-rotate
                  camera-orbit="0deg 0deg 1.5m"
                  tone-mapping="neutral"
                  poster="/poster.webp"
                  shadow-intensity="1.2"
                  style={{ width: '100%', height: '400px' }}
                ></model-viewer>
              </div>
            </div>
          </div>

          {/* Latest updates ticker */}
          <div className="bg-slate-900 text-white text-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h18" />
                    <path d="M8 8l-5 4 5 4" />
                  </svg>
                </span>
                <span className="font-semibold tracking-wide uppercase text-xs">
                  Latest Updates
                </span>
              </div>
              <p className="text-slate-100 md:ml-6 text-center md:text-left">
                The DOI number is available upon request. Kindly write to editor@ijepa.org for details.
              </p>
            </div>
          </div>
        </section>

        {/* About IJEPA - two-column layout */}
        <section className="bg-gradient-to-br from-slate-50 to-white py-24 border-t border-slate-200 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 max-w-3xl">
              <h2 className="text-4xl font-bold text-slate-900 mb-6 text-left">
                About <span className="text-amber-700">IJEPA</span>
              </h2>
              <div className="w-24 h-1 bg-amber-700 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Illustrative images column */}
              <div className="relative flex flex-col gap-4">
                <div className="rounded-3xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                  <img
                    src="/image.png"
                    alt="Researchers collaborating on publications"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-3xl bg-white shadow-lg border border-slate-200 overflow-hidden">
                  <img
                    src="/image1.png"
                    alt="Editorial and review process illustration"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Existing about content */}
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                <p className="mb-6">
                  The <strong>International Journal of Engineering Practices and Applications (IJEPA)</strong> is a peer-reviewed, open-access journal dedicated to advancing research, innovation, and practical applications in the field of engineering. Our mission is to serve as a trusted platform for scholars, researchers, practitioners, and industry professionals to share knowledge, exchange ideas, and contribute to the progress of engineering science and technology.
                </p>

                <p className="mb-6">
                  IJEPA publishes monthly high-quality original research papers, review articles, and case studies that address theoretical foundations, experimental investigations, and real-world applications across diverse engineering disciplines. We welcome interdisciplinary work that bridges the gap between academic research and industry practices, fostering solutions to contemporary challenges.
                </p>

                <div className="mt-8 mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center mr-3">✓</span>
                    Our Vision
                  </h3>
                  <p className="pl-11">
                    To become a globally recognized journal that drives innovation, disseminates impactful research, and promotes collaboration across engineering domains.
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center mr-3">✓</span>
                    Our Scope
                  </h3>
                  <p className="pl-11 mb-4">
                    IJEPA covers, but is not limited to, the following areas:
                  </p>
                  <ul className="pl-11 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">•</span>
                      <span>Civil, Mechanical, Electrical, and Electronics Engineering</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">•</span>
                      <span>Computer Science, Information Technology, and Artificial Intelligence</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">•</span>
                      <span>Industrial, Manufacturing, and Materials Engineering</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-700 mr-2">•</span>
                      <span>Communication, Control, and Instrumentation Systems</span>
                    </li>
                    <li className="flex items-start md:col-span-2">
                      <span className="text-amber-700 mr-2">•</span>
                      <span>Sustainable, Green, and Emerging Engineering Practices</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center mr-3">✓</span>
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

                <p className="mt-8 text-lg italic text-slate-600">
                  "At IJEPA, we believe that engineering is not just about knowledge creation but also about meaningful application.
                  By connecting research with practice, we aim to contribute to technological growth and societal development."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call for Papers Section */}

        <section className="bg-slate-50 border-t border-slate-200 py-24 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">
                Call for Papers
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                The International Journal of Engineering Practices and Applications (IJEPA) invites researchers,
                academicians, industry professionals, and practitioners to submit high-quality research articles,
                review papers, case studies, and technical notes for upcoming issues.
              </p>
              <p className="text-slate-600 text-sm md:text-base">
                We welcome interdisciplinary work that bridges theoretical advances with practical engineering
                applications and addresses real-world challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <StarBorder as="div" className="w-full">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Scope Highlights</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Civil, Mechanical, Electrical, and Electronics Engineering</li>
                    <li>• Computer Science, Artificial Intelligence, and Information Technology</li>
                    <li>• Industrial, Manufacturing, and Materials Engineering</li>
                    <li>• Communication, Signal Processing, and Control Systems</li>
                    <li>• Renewable Energy, Green Technologies, and Sustainable Engineering</li>
                    <li>• Emerging and interdisciplinary engineering practices</li>
                  </ul>
                </div>
              </StarBorder>

              <StarBorder as="div" className="w-full mt-4 lg:mt-0">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Why Publish with IJEPA?</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Peer-reviewed and high-quality publications</li>
                    <li>• Open access for global visibility and readership</li>
                    <li>• Rapid and transparent review process</li>
                    <li>• International editorial and reviewer panel</li>
                    <li>• Opportunities for academic recognition and collaboration</li>
                  </ul>
                </div>
              </StarBorder>

              <StarBorder as="div" className="w-full">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Important Dates (Sample)</h3>
                  <ul className="text-sm text-slate-600 space-y-2 mb-4">
                    <li>• Manuscript Submission Deadline: [Insert Date]</li>
                    <li>• Notification of Acceptance: [Insert Date]</li>
                    <li>• Final Camera-Ready Paper Due: [Insert Date]</li>
                    <li>• Publication Date: [Insert Date]</li>
                  </ul>
                  <p className="text-xs text-slate-500 mb-4">
                    Actual dates will be announced on the detailed Call for Papers page.
                  </p>
                  <a
                    href="/callforpapers"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold w-full text-center"
                  >
                    View Full Call for Papers
                  </a>
                </div>
              </StarBorder>
            </div>
          </div>
        </section>

        {/* Author Guidelines Snapshot */}
        <section className="bg-white border-t border-slate-200 py-20 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">
                Author Guidelines – At a Glance
              </h2>
              <p className="text-slate-600 text-sm md:text-base">
                Before submitting, please ensure your manuscript follows the core requirements below. Full
                details are available on the Author Guidelines page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StarBorder as="div" className="w-full">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Manuscript Basics</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Language: clear, grammatically correct English</li>
                    <li>• Format: MS Word (DOC/DOCX), not PDF for initial submission</li>
                    <li>• Length: typically 6–12 pages for research papers</li>
                    <li>• Structure: Title, Abstract, Keywords, Introduction, Methods, Results, Conclusion, References</li>
                  </ul>
                </div>
              </StarBorder>

              <StarBorder as="div" className="w-full">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Formatting & Ethics</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Times New Roman, size 12, single-column, 1.5 line spacing</li>
                    <li>• Numbered figures, tables, and equations with clear captions</li>
                    <li>• Consistent reference style (e.g., IEEE / APA / Harvard)</li>
                    <li>• Original work only; all submissions checked for plagiarism</li>
                  </ul>
                </div>
              </StarBorder>

              <StarBorder as="div" className="w-full">
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">APC & Policies</h3>
                  <ul className="text-sm text-slate-600 space-y-2 mb-3">
                    <li>• Indian Authors: INR 1500 per accepted paper</li>
                    <li>• International Authors: USD 50 per accepted paper</li>
                    <li>• No submission fee; charges apply only after acceptance</li>
                    <li>• Double-blind peer review and strict publication ethics</li>
                  </ul>
                  <a
                    href="/author-guidelines"
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-white border border-amber-600 text-amber-700 text-sm font-semibold hover:bg-amber-50 w-full text-center"
                  >
                    Read Complete Author Guidelines
                  </a>
                </div>
              </StarBorder>
            </div>
          </div>
        </section>

        {/* Journal Issues Teaser */}
        <section className="bg-slate-50 border-t border-slate-200 py-20 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">
                  Journal Issues
                </h2>
                <p className="text-slate-600 text-sm md:text-base mb-4">
                  IJEPA publishes monthly issues featuring peer-reviewed articles, reviews, and case studies across
                  diverse engineering domains.
                </p>
                <StarBorder as="div" className="w-full mb-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">Current Issue</h3>
                    <p className="text-sm text-slate-600 mb-2">Volume [X], Issue [Y] – [Month, Year]</p>
                    <p className="text-xs text-slate-500 mb-3">
                      Access the latest peer-reviewed articles published in this issue.
                    </p>
                    <a
                      href="/journal-issues"
                      className="inline-flex items-center px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                    >
                      View Current Issue
                    </a>
                  </div>
                </StarBorder>
              </div>

              <StarBorder as="div" className="w-full">
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Archives</h3>
                  <p className="mb-3">
                    Explore previously published volumes and issues of IJEPA to discover impactful research and trends
                    across engineering disciplines.
                  </p>
                  <ul className="space-y-1 text-xs">
                    <li>• Volume [X], Issue [Y], [Year] – View Articles</li>
                    <li>• Volume [X-1], Issue [Y-1], [Year] – View Articles</li>
                    <li>• Volume [X-2], Issue [Y-2], [Year] – View Articles</li>
                  </ul>
                  <p className="mt-3 text-xs text-slate-500">
                    These are sample placeholders; update them as new issues are published.
                  </p>
                </div>
              </StarBorder>
            </div>
          </div>
        </section>

        {/* Conference inquiries & indexing partners band */}
        <section className="bg-sky-50 border-t border-slate-200 py-16 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Send us your Conference inquiries
                </h2>
                <div className="w-16 h-0.5 bg-sky-500 mb-6"></div>
                <p className="text-slate-700 leading-relaxed">
                  Institutions, universities, and colleges are encouraged to send inquiries about publishing their
                  conference proceedings and special issues with IJEPA. Our team will guide you through the process
                  and help you reach a global research audience.
                </p>
              </div>

              <div className="text-slate-700 leading-relaxed">
                <p className="mb-3">
                  IJEPA invites both national and international conferences to publish their research proceedings
                  online through our platform. For conference collaborations and proposals, please contact us using
                  the conference inquiry form available on the website.
                </p>
                <p>
                  For detailed discussions, you can also reach out via email to <span className="text-sky-700 font-medium">editor@ijepa.org</span>.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-10">
              <h3 className="text-center text-lg font-semibold text-slate-800 mb-4">Indexing & Abstracting</h3>
              <p className="text-center text-slate-600 max-w-3xl mx-auto mb-6 text-sm md:text-base">
                IJEPA is committed to improving the visibility, accessibility, and citation of published research through
                indexing in leading academic databases and assigning DOIs to every article.
              </p>
              <div className="flex justify-center mb-6">
                <LogoLoop
                  logos={[
                    { node: <span className="text-slate-500 text-base md:text-lg font-semibold">Google Scholar</span>, ariaLabel: 'Google Scholar' },
                    { node: <span className="text-slate-500 text-base md:text-lg font-semibold">ROAD</span>, ariaLabel: 'ROAD' },
                    { node: <span className="text-slate-500 text-base md:text-lg font-semibold">ISSUU</span>, ariaLabel: 'ISSUU' },
                    { node: <span className="text-slate-500 text-base md:text-lg font-semibold">Slideshare</span>, ariaLabel: 'Slideshare' },
                    { node: <span className="text-slate-500 text-base md:text-lg font-semibold">CiteSeerX</span>, ariaLabel: 'CiteSeerX' }
                  ]}
                  speed={80}
                  direction="left"
                  gap={40}
                  fadeOut
                  ariaLabel="Indexing and abstracting partners"
                />
              </div>
              <p className="text-center text-slate-600 text-xs md:text-sm mb-4">
                We are continuously working towards inclusion in major databases such as Scopus, Web of Science (ESCI), DOAJ,
                EBSCO, ProQuest, and UGC-CARE to further enhance author visibility and recognition.
              </p>
              <div className="flex justify-center">
                <a
                  href="/indexing"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-full border border-sky-600 text-sky-700 text-sm font-semibold hover:bg-sky-50"
                >
                  Learn more about our indexing
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Publication Workflow Section */}
        <section className="bg-amber-600 border-t border-amber-700 py-24 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-left">
                Publication Workflow at IJEPA
              </h2>
              <p className="text-amber-100 text-base md:text-lg">
                Understand how your manuscript moves from submission to online publication through our structured
                editorial and peer-review workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-6 text-white">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-white mb-2">Submission</h3>
                <p className="text-amber-100 text-sm">
                  Authors submit their manuscripts via the online submission system or by email to the editorial office.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-white mb-2">Initial Screening</h3>
                <p className="text-amber-100 text-sm">
                  The editorial team performs a preliminary check for scope, formatting, plagiarism, and basic quality.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-white mb-2">Peer Review</h3>
                <p className="text-amber-100 text-sm">
                  Suitable manuscripts are assigned to qualified reviewers for detailed technical and scientific evaluation.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-white mb-2">Revision & Decision</h3>
                <p className="text-amber-100 text-sm">
                  Authors submit revisions based on reviewer comments; the editor issues acceptance, revision, or rejection.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  5
                </div>
                <h3 className="font-semibold text-white mb-2">Publication & Indexing</h3>
                <p className="text-amber-100 text-sm">
                  Accepted papers are typeset, assigned to an issue, published online, and indexed in relevant databases.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IJEPA Partner Network Section */}
        <section className="bg-white border-t border-slate-200 py-24 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                IJEPA Partner Network (IPN)
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Join our referral and reviewer network to support quality publications, earn rewards, and help
                authors publish their research with IJEPA.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Register as Referral/Reviewer</h3>
                <p className="text-slate-600 text-sm">
                  Sign up for the IJEPA Partner Network and create your profile.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Submit Papers</h3>
                <p className="text-slate-600 text-sm">
                  Share research manuscripts from your network for consideration in IJEPA.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Earn Rewards</h3>
                <p className="text-slate-600 text-sm">
                  Receive benefits and recognition for successful submissions and reviews.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4 text-2xl font-bold">
                  4
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Withdraw Earnings</h3>
                <p className="text-slate-600 text-sm">
                  Track your rewards and withdraw your earnings as per the program guidelines.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/joinusedito"
                className="px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-sm"
              >
                IJEPA Partner Network (IPN) Login
              </a>
              <a
                href="/register"
                className="px-6 py-3 rounded-full border border-amber-600 text-amber-700 hover:bg-amber-50 font-semibold text-sm"
              >
                Register as New Partner
              </a>
            </div>
          </div>
        </section>

        {/* FAQ & CTA Section */}
        <section className="bg-slate-50 border-t border-slate-200 py-24 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* FAQ Column */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-left">
                  Frequently Asked Questions
                </h2>
                <p className="text-slate-600 mb-8">
                  Find quick answers to some of the most common questions about publishing with IJEPA.
                </p>

                <div className="space-y-4">
                  <details className="group bg-white border border-slate-200 rounded-2xl p-4 open:shadow-md transition-all">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-semibold text-slate-900">
                        How long does the review process take?
                      </span>
                      <span className="ml-4 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      Review timelines may vary depending on the complexity of the manuscript and reviewer availability,
                      but we aim to provide an initial decision within a few weeks of submission.
                    </p>
                  </details>

                  <details className="group bg-white border border-slate-200 rounded-2xl p-4 open:shadow-md transition-all">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-semibold text-slate-900">
                        Where can I find the Author Guidelines?
                      </span>
                      <span className="ml-4 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      Detailed instructions for preparing and submitting your manuscript are available on the
                      Author Guidelines page.
                    </p>
                  </details>

                  <details className="group bg-white border border-slate-200 rounded-2xl p-4 open:shadow-md transition-all">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-semibold text-slate-900">
                        How do I track the status of my submitted paper?
                      </span>
                      <span className="ml-4 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      After submission, you can track the status of your manuscript by logging into your author
                      account or by contacting the editorial office with your paper ID.
                    </p>
                  </details>

                  <details className="group bg-white border border-slate-200 rounded-2xl p-4 open:shadow-md transition-all">
                    <summary className="flex justify-between items-center cursor-pointer list-none">
                      <span className="font-semibold text-slate-900">
                        Do you provide e-certificates for authors and reviewers?
                      </span>
                      <span className="ml-4 text-slate-500 group-open:rotate-180 transition-transform">▾</span>
                    </summary>
                    <p className="mt-3 text-sm text-slate-600">
                      Yes, e-certificates can be provided for accepted papers and for reviewers who complete
                      their review assignments.
                    </p>
                  </details>
                </div>
              </div>

              {/* CTA Column */}
              <div className="bg-amber-600 text-white rounded-3xl overflow-hidden flex flex-col md:flex-row items-stretch shadow-xl">
                <div className="flex-1 p-8 lg:p-10 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Sign Up for IJEPA Partner Network
                  </h3>
                  <p className="text-amber-100 mb-6 text-sm md:text-base">
                    Register now to become part of our growing reviewer and referral community. Help authors publish
                    impactful research while earning recognition and rewards.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="/register"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white text-amber-700 font-semibold text-sm hover:bg-amber-50 transition-colors"
                    >
                      Register Free
                    </a>
                    <a
                      href="/joinusedito"
                      className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-amber-200 text-white font-semibold text-sm hover:bg-amber-700 transition-colors"
                    >
                      IPN Login
                    </a>
                  </div>
                </div>
                <div className="hidden md:block md:w-1/3 bg-cover bg-center" style={{ backgroundImage: `url(${hero})` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact & Submission Strip */}
        <section className="bg-slate-900 py-12 border-t border-slate-800 fade-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-slate-100">
              <div>
                <h2 className="text-2xl font-bold mb-3">Contact the Editorial Office</h2>
                <p className="text-slate-300 text-sm mb-4">
                  For queries related to manuscript preparation, submission status, or journal policies, feel free to
                  reach out to us. We aim to respond within 22 business days.
                </p>
                <ul className="text-sm space-y-1">
                  <li><span className="font-semibold">Email:</span> editor@ijepa.org</li>
                  <li><span className="font-semibold">Phone:</span> +91 98765 43210</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Submit Your Paper</h2>
                <p className="text-slate-300 text-sm mb-4">
                  Ready to publish with IJEPA? Prepare your manuscript in DOC/DOCX format and follow the Author
                  Guidelines before submitting.
                </p>
                <ul className="text-sm text-slate-200 space-y-1 mb-4">
                  <li>• Fill in the required author and manuscript details.</li>
                  <li>• Upload your manuscript and copyright form.</li>
                  <li>• Add any additional comments or cover letter.</li>
                </ul>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="/SubmitForm"
                    className="inline-flex items-center px-5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-900 text-sm font-semibold"
                  >
                    Go to Submission Form
                  </a>
                  <a
                    href="/author-guidelines"
                    className="inline-flex items-center px-5 py-2 rounded-full border border-slate-300 text-slate-100 text-sm font-semibold hover:bg-slate-800"
                  >
                    View Author Guidelines
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl z-50"
            aria-label="Scroll to top"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};
export default Landing;