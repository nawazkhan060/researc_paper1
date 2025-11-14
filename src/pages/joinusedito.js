// src/pages/JoinEditorialTeam.jsx
import React from 'react';

const JoinEditorialTeam = () => {
  // 🔗 Replace these with your actual links/emails
  const GOOGLE_FORM_LINK = "https://forms.gle/ThKT31uW4K4F3dUX7"; // ← UPDATE THIS
  const JOURNAL_EMAIL = "editor@ijepa.org"; // ← UPDATE THIS

  return (
    <div className="bg-[#f8fafc] min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Join Us as Associate Editor or Reviewer
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            The International Journal of Engineering Practices and Applications (IJEPA) invites academicians, researchers, and industry experts with strong academic and research credentials to join our editorial community as Associate Editors or Reviewers.
          </p>
        </div>

        {/* Intro Paragraph */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <p className="text-gray-700">
            We believe that the quality of a journal is a reflection of the dedication and expertise of its editorial board and reviewers. By joining IJEPA, you will have the opportunity to contribute to the advancement of engineering research worldwide while gaining valuable recognition for your service.
          </p>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Eligibility Criteria</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• A Ph.D. or Master’s degree in a relevant engineering or technology discipline.</li>
            <li>• Proven research record with publications in peer-reviewed journals or conferences.</li>
            <li>• Commitment to maintaining high ethical standards in research and publication.</li>
            <li>• Willingness to review manuscripts in your area of expertise within stipulated timelines.</li>
          </ul>
        </div>

        {/* Roles & Responsibilities */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Roles & Responsibilities</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Associate Editors</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Assist in managing the peer-review process.</li>
              <li>Provide editorial decisions and recommendations.</li>
              <li>Contribute to the strategic development of the journal.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-800 mb-2">Reviewers</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Provide constructive, detailed, and timely reviews of assigned manuscripts.</li>
              <li>Help uphold the quality and integrity of published research.</li>
            </ul>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Benefits</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">✓</span>
              <span>Recognition as an Associate Editor/Reviewer on the IJEPA website.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">✓</span>
              <span>Opportunity to stay updated with cutting-edge research in your field.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">✓</span>
              <span>Certificate of appreciation for your editorial/reviewing contribution.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2 mt-0.5">✓</span>
              <span>Networking with international researchers and professionals.</span>
            </li>
          </ul>
        </div>

        {/* How to Apply */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Apply</h2>
          <p className="text-gray-700 mb-4">
            Interested candidates are invited to complete the application form via the link below:
          </p>
          <a
            href={GOOGLE_FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            👉 Apply Here
          </a>
          <p className="mt-6 text-gray-600">
            For queries, please contact:<br />
            <span className="font-medium">Editorial Office, IJEPA</span><br />
            Email: <a
              href={`mailto:${JOURNAL_EMAIL}`}
              className="text-blue-500 hover:underline"
            >
              {JOURNAL_EMAIL}
            </a>
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} International Journal of Engineering Practices and Applications (IJEPA). All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default JoinEditorialTeam;