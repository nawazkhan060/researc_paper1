import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

 // Adjust path if needed

const AuthorGuidelines = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'IJEPA_Author_Guidelines',
    pageStyle: `
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
      }
      @screen {
        .print-only { display: none !important; }
      }
    `,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Reuse your existing Navbar */}


      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Download Button - Only visible on screen */}
       

        {/* Printable Content */}
        <div ref={componentRef} className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 print:p-6">
          {/* Header */}
          <div className="text-center mb-10 pb-6 border-b border-slate-200">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Author Guidelines
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              International Journal of Engineering Practices and Applications (IJEPA)
            </p>
          </div>

          {/* Intro */}
          <p className="text-slate-700 mb-8 leading-relaxed">
            The <strong>International Journal of Engineering Practices and Applications (IJEPA)</strong> welcomes high-quality research contributions from scholars, academicians, industry professionals, and practitioners across all engineering domains. Authors are requested to carefully read and follow the guidelines below before submitting their manuscripts.
          </p>

          {/* Guidelines Sections */}
          <div className="space-y-10">
            {/* 1. Manuscript Preparation */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Manuscript Preparation</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Language:</strong> All manuscripts must be written in clear, concise, and grammatically correct English.</li>
                <li><strong>Format:</strong> Manuscripts should be submitted in MS Word (DOC/DOCX) format. PDF files will not be accepted for initial submission.</li>
                <li><strong>Length:</strong> Research papers should typically range between 6–12 pages. Review articles may be longer, subject to editorial approval.</li>
                <li>
                  <strong>Structure:</strong> The manuscript should be organized as follows:
                  <ol className="list-decimal pl-6 mt-2 space-y-1">
                    <li>Title Page (with author details)</li>
                    <li>Abstract (150–250 words) and Keywords (3–6)</li>
                    <li>Introduction</li>
                    <li>Methodology / Materials and Methods</li>
                    <li>Results and Discussion</li>
                    <li>Conclusion</li>
                    <li>Acknowledgements (if any)</li>
                    <li>References</li>
                  </ol>
                </li>
              </ul>
            </section>

            {/* 2. Formatting Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Formatting Requirements</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li><strong>Font:</strong> Times New Roman, size 12, single-column, 1.5 line spacing.</li>
                <li><strong>Headings:</strong> Use a clear hierarchy (e.g., 1. Introduction, 1.1 Subheading).</li>
                <li><strong>Figures & Tables:</strong> Must be numbered consecutively, with descriptive captions. Ensure high resolution and clarity.</li>
                <li><strong>Equations:</strong> Should be typed using an equation editor and numbered sequentially.</li>
                <li><strong>References:</strong> Follow <span className="font-semibold">IEEE</span> referencing style consistently throughout.</li>
              </ul>
            </section>

            {/* 3. Originality & Plagiarism Policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Originality & Plagiarism Policy</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Submissions must be original and not under review or published elsewhere.</li>
                <li>All manuscripts will be checked for plagiarism. Papers exceeding the acceptable similarity index will be rejected.</li>
              </ul>
            </section>

            {/* 4. Peer Review Process */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Peer Review Process</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>All submissions undergo a double-blind peer-review process.</li>
                <li>Authors may be asked to revise their manuscripts based on reviewer feedback.</li>
                <li>Final acceptance is subject to editorial approval.</li>
              </ul>
            </section>

            {/* 5. Submission Process */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Submission Process</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Manuscripts should be submitted via the <a href="/SubmitForm" className="text-indigo-600 hover:underline">Online Submission System</a> or emailed directly to <span className="font-mono">editor@ijepa.org</span>.</li>
                <li>Along with the manuscript, authors must provide:
                  <ul className="list-none pl-4 mt-2 space-y-1">
                    <li>• A cover letter highlighting the contribution of the paper.</li>
                    <li>• A signed copyright form (see below).</li>
                  </ul>
                </li>
              </ul>
            </section>

            {/* 6. Publication Charges */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Publication Charges</h2>
              <p className="text-slate-700 mb-3">
                To support the open-access policy and editorial process, the following Article Processing Charges (APC) apply:
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Indian Authors:</span>
                    <span className="font-semibold">INR 1500/- per accepted paper</span>
                  </li>
                  <li className="flex justify-between">
                    <span>International Authors:</span>
                    <span className="font-semibold">USD 50 per accepted paper</span>
                  </li>
                </ul>
                <p className="mt-3 text-sm text-blue-800 italic">
                  Note: No submission fees are charged. Authors are required to pay only after acceptance of the manuscript.
                </p>
              </div>
            </section>

            {/* 7. Paper Template */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Paper Template</h2>
              <p className="text-slate-700 mb-4">
                Authors must prepare their manuscripts using the official IJEPA Paper Template to ensure uniformity.
              </p>
              <a href="#" className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Paper Template
              </a>
            </section>

            {/* 8. Copyright Form */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Copyright Form</h2>
              <p className="text-slate-700 mb-4">
                Upon acceptance, authors must complete and submit the IJEPA Copyright Transfer Form. This form ensures that:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-1 text-slate-700">
                <li>The work is original and not published elsewhere.</li>
                <li>Authors transfer publication rights to IJEPA while retaining intellectual property rights.</li>
              </ul>
              <a
                href="#"
                className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Copyright Form
              </a>
            </section>

            {/* 9. Publication Ethics */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">9. Publication Ethics</h2>
              <p className="text-slate-700 mb-3">
                IJEPA adheres to strict ethical standards. Authors are expected to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Properly cite all sources of information.</li>
                <li>Acknowledge contributions and funding support.</li>
                <li>Disclose any potential conflicts of interest.</li>
                <li>Refrain from multiple submissions of the same work.</li>
              </ul>
            </section>

            {/* 10. Copyright & Open Access Policy */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">10. Copyright & Open Access Policy</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>By submitting to IJEPA, authors agree to transfer copyright of the accepted article to the journal.</li>
                <li>All published papers are made freely accessible under the journal’s open-access policy, ensuring maximum visibility.</li>
              </ul>
            </section>

            {/* 11. Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">11. Contact Information</h2>
              <p className="text-slate-700">
                For queries regarding manuscript preparation and submission, please contact:
              </p>
              <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-medium">Editorial Office, IJEPA</p>
                <p className="mt-1 font-mono text-slate-700">Email: editor@ijepa.org</p>
              </div>
            </section>
          </div>

          {/* Final Note */}
          <div className="mt-12 pt-6 border-t border-slate-200 text-center">
            <p className="text-slate-600 italic">
              We strongly encourage authors to review recent articles published in IJEPA to familiarize themselves with the journal’s style and scope before submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorGuidelines;