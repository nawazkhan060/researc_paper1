import React from 'react';

import Footer from '../components/Footer';

const Indexing = () => {
  const currentIndexing = [
    { name: 'Google Scholar', description: 'Global academic search engine' },
    { name: 'CrossRef', description: 'DOI registration agency' },
    { name: 'ResearchGate', description: 'Research networking platform' },
    { name: 'Academia.edu', description: 'Academic sharing platform' },
    { name: 'Semantic Scholar', description: 'AI-powered research discovery' },
    { name: 'BASE', description: 'Bielefeld Academic Search Engine' },
  ];



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
              Indexing & <span className="text-amber-200">Abstracting</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Enhancing global visibility, accessibility, and impact of your research through strategic database partnerships.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Introduction */}
          <div className="text-center mb-16">
            <p className="text-lg text-slate-700 max-w-4xl mx-auto leading-relaxed">
              The <strong>International Journal of Engineering Practices and Applications (IJEPA)</strong> is committed to increasing the visibility, accessibility, and citation of published research. To achieve this, we actively pursue indexing in leading academic and research databases.
            </p>
          </div>

          {/* Currently Indexed */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Currently Indexed In</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentIndexing.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Indexing in Progress */}
          <section className="mb-20">
            <div className="flex items-center mb-8">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mr-4">
              </div>
            </div>

            <div className="space-y-6">

            </div>
          </section>

          {/* Importance of Indexing */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-100">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
                Why Indexing Matters
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Greater visibility and global readership for published papers',
                  'Increased citations and academic recognition for authors',
                  'Long-term preservation and accessibility of research',
                  'Compliance with academic and institutional requirements for quality publications.'
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-slate-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* DOI & CrossRef */}
          <section className="mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
              <div className="flex flex-col md:flex-row items-center">
                <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                  <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">DOIs & CrossRef Membership</h2>
                  <p className="text-slate-700 leading-relaxed">
                    Each article published in IJEPA is assigned a unique <strong>Digital Object Identifier (DOI)</strong>, ensuring permanent online availability, reliable citation tracking, and integration with global scholarly infrastructure through our CrossRef membership.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Commitment */}
          <div className="text-center py-12 bg-slate-900 rounded-2xl text-white">
            <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
            <p className="text-slate-300 max-w-3xl mx-auto mb-6 leading-relaxed">
              We are continuously working to expand our indexing coverage so that IJEPA remains a trusted platform for impactful engineering research.
            </p>
            <a
              href="/contact-us"

              className="inline-flex items-center px-6 py-3 bg-white text-slate-900 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contact Editorial Office
            </a>
          </div>
        </div>
      </main>


    </div>
  );
};

export default Indexing;