import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-3">
              Terms of Service
            </h1>
            <p className="text-blue-100 text-center text-sm sm:text-base">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            {/* Introduction */}
            <div className="mb-8 sm:mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
                <p className="text-blue-800 text-sm sm:text-base">
                  Welcome to Fulfill First Marketplace. These Terms of Service ("Terms") govern your use of our website and our products and services. By accessing or using our website, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our website or services.
                </p>
              </div>
            </div>

            {/* Use of Our Website */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Use of Our Website
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Eligibility
                  </h3>
                  <p className="text-gray-700 leading-relaxed">You must be at least 18 years old to use our website and purchase our products. By using our website, you represent that you meet this age requirement.</p>
                </div>
                
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    Account Registration
                  </h3>
                  <p className="text-gray-700 leading-relaxed">To access certain features of our website, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to update such information as needed. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                </div>
              </div>
            </div>

            {/* Orders and Payment */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Orders and Payment
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Availability</h3>
                  <p className="text-gray-600 text-sm">All products listed on our website are subject to availability. We reserve the right to limit the quantity of products we supply, and to discontinue any product at any time.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing</h3>
                  <p className="text-gray-600 text-sm">Prices for our products are subject to change without notice. We strive to ensure that pricing information on our website is accurate, but we cannot guarantee the absence of pricing errors.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment</h3>
                  <p className="text-gray-600 text-sm">We accept various forms of payment as indicated on our website. By providing payment information, you represent and warrant that you are authorized to use the payment method provided.</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Delivery</h3>
                  <p className="text-gray-600 text-sm">We strive to deliver your order within the estimated delivery time provided. However, delivery times are not guaranteed and may be affected by factors beyond our control.</p>
                </div>
              </div>
            </div>

            {/* Returns and Exchanges */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Returns and Exchanges
              </h2>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <p className="text-amber-800">Due to the nature of our products, we do not accept returns or exchanges. Please review our Return and Exchange Policy for more information.</p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Intellectual Property
              </h2>
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-6a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 01-1-1V4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-purple-800">All content on our website, including text, images, graphics, logos, and software, is the property of Fulfill First Marketplace or its licensors and is protected by intellectual property laws. You may not use, reproduce, modify, or distribute any content from our website without our prior written permission.</p>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Limitation of Liability
              </h2>
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <p className="text-red-800">To the fullest extent permitted by law, Fulfill First Marketplace shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of our website or products. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.</p>
              </div>
            </div>

            {/* Indemnification */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Indemnification
              </h2>
              <p className="text-gray-700 leading-relaxed">You agree to indemnify and hold Fulfill First Marketplace harmless from any claims, losses, liabilities, damages, and expenses, including legal fees, arising out of your use of our website or violation of these Terms.</p>
            </div>

            {/* Governing Law */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">These Terms are governed by and construed in accordance with the laws of the State of Missouri. Any disputes arising out of or relating to these Terms shall be resolved in the courts of Missouri.</p>
            </div>

            {/* Changes to These Terms */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                Changes to These Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of our website following the posting of changes constitutes your acceptance of such changes.</p>
            </div>

            {/* Contact Us */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-700 mb-4">If you have any questions or concerns about these Terms, please contact us at:</p>
              <address className="not-italic">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-800 text-lg">Fulfill First Marketplace</p>
                  <p className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <a href="tel:+18883350221" className="text-blue-600 hover:text-blue-700 transition-colors">
                      
                    </a>
                  </p>
                </div>
              </address>
            </div>
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

export default TermsOfService;