import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mt-5 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-3">
              Privacy Policy
            </h1>
            <p className="text-blue-100 text-center text-sm sm:text-base">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            {/* Introduction */}
            <div className="mb-8 sm:mb-10">
              <p className="text-gray-700 leading-relaxed mb-4">
                We value your privacy and strive to protect your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://fulfill1st.com/" className="text-blue-600 hover:text-blue-700 underline transition-colors">https://fulfill1st.com/</a>, use our services, or purchase our products, including hair extensions.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <p className="text-blue-800 text-sm sm:text-base">
                  By using our website and services, you agree to the terms of this Privacy Policy.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Information We Collect
              </h2>
              
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-3">
                Personal Information
              </h3>
              <p className="text-gray-700 mb-3">When you visit our website or purchase our products, we may collect the following personal information:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Shipping address</li>
                <li>Payment information</li>
              </ul>

              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mt-6 mb-3">
                Non-Personal Information
              </h3>
              <p className="text-gray-700 mb-3">We may also collect non-personal information, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Browser type and version</li>
                <li>IP address</li>
                <li>Pages visited and time spent on our website</li>
                <li>Referring website</li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you regarding your orders or inquiries</li>
                <li>Improve our website and services</li>
                <li>Send promotional emails and newsletters (with your consent)</li>
                <li>Analyze website usage and trends</li>
              </ul>
            </div>

            {/* How We Protect Your Information */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                How We Protect Your Information
              </h2>
              <p className="text-gray-700 mb-3">We implement a variety of security measures to maintain the safety of your personal information. These measures include:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-800">SSL Technology</span>
                  </div>
                  <p className="text-green-700 text-sm">Secure Socket Layer (SSL) technology to encrypt data</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-800">Regular Scans</span>
                  </div>
                  <p className="text-green-700 text-sm">Regular malware scans and security audits</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 sm:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-green-800">Access Control</span>
                  </div>
                  <p className="text-green-700 text-sm">Access control measures to restrict access to your personal information</p>
                </div>
              </div>
            </div>

            {/* Sharing Your Information */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Sharing Your Information
              </h2>
              <p className="text-gray-700 mb-3">We do not sell, trade, or otherwise transfer your personal information to outside parties, except in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>To trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided that these parties agree to keep your information confidential.</li>
                <li>When required by law or to protect our rights, property, or safety.</li>
              </ul>
            </div>

            {/* Cookies and Tracking Technologies */}
            <div className="mb-8 sm:mb-10 bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-700 mb-3">Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser that enables the site's systems to recognize your browser and capture and remember certain information.</p>
              <p className="text-gray-700">You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.</p>
            </div>

            {/* Your Rights */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Your Rights
              </h2>
              <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Access</h4>
                  <p className="text-gray-600 text-sm">Request a copy of your personal information we hold.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Correction</h4>
                  <p className="text-gray-600 text-sm">Request corrections to inaccuracies in your personal information.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Deletion</h4>
                  <p className="text-gray-600 text-sm">Request deletion of your personal information.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-gray-800 mb-2">Opt-out</h4>
                  <p className="text-gray-600 text-sm">Opt-out of receiving promotional communications.</p>
                </div>
              </div>
              {/* <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <p className="text-gray-700">
                  To exercise any of these rights, please contact us at{' '}
                  <a href="tel:+18883350221" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                    +1 (888) 335-0221
                  </a>
                </p>
              </div> */}
            </div>

            {/* Changes to This Privacy Policy */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Changes to This Privacy Policy
              </h2>
              <p className="text-gray-700">We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.</p>
            </div>

            {/* Contact Us */}
            {/* <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <address className="not-italic">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800">Fulfill First Marketplace</p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+18883350221" className="text-blue-600 hover:text-blue-700 transition-colors">
                      +1 (888) 335-0221
                    </a>
                  </p>
                </div>
              </address>
            </div> */}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 sm:px-8 lg:px-10 py-8">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
              <Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/terms" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-300">|</span>
              <Link to="/refunds" className="text-gray-600 hover:text-blue-600 text-sm sm:text-base font-medium transition-colors">
                Refund Policy
              </Link>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs sm:text-sm">
                © {new Date().getFullYear()} Fulfill First Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;