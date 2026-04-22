import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-center mb-3">
              Refund Policy
            </h1>
            <p className="text-blue-100 text-center text-sm sm:text-base">
              Effective Date: January 1, 2025
            </p>
          </div>

          {/* Content Section */}
          <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
            {/* Introduction */}
            <div className="mb-8 sm:mb-10">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                <p className="text-blue-800 text-sm sm:text-base leading-relaxed">
                  We are committed to ensuring satisfaction with every service delivered through our platform. 
                  This Refund Policy outlines the conditions under which users may request refunds.
                </p>
              </div>
            </div>

            {/* 1. General Policy */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                1. General Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Due to the nature of digital services, refunds are only issued under certain conditions. 
                Refunds are not guaranteed and are issued at the discretion of Fulfill First Marketplace after careful review.
              </p>
            </div>

            {/* 2. Eligible Refund Scenarios */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                2. Eligible Refund Scenarios
              </h2>
              <p className="text-gray-700 mb-3 font-semibold">You may be eligible for a refund if:</p>
              <div className="space-y-3">
                {[
                  "The service was not delivered by the agreed-upon deadline and no valid reason was provided.",
                  "The delivered work does not match the service description or requirements clearly communicated before the order was placed.",
                  "The seller is unresponsive for more than 7 days after the order is placed.",
                  "The service was purchased due to a technical error (e.g., double payment, incorrect billing)."
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Non-Refundable Scenarios */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                3. Non-Refundable Scenarios
              </h2>
              <p className="text-gray-700 mb-3 font-semibold">Refunds will not be issued in the following cases:</p>
              <div className="space-y-3">
                {[
                  "You changed your mind after the order was placed.",
                  "You were dissatisfied due to unclear instructions or scope.",
                  "The service was marked as 'Completed' and later requested for a refund without proper cause.",
                  "Custom work was delivered and partially or fully used/downloaded.",
                  "Delays or issues caused by your own lack of communication or feedback."
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-800 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Requesting a Refund */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                4. Requesting a Refund
              </h2>
              <p className="text-gray-700 mb-3 font-semibold">To request a refund:</p>
              <div className="space-y-3">
                {[
                  "Go to your order dashboard and select the relevant order.",
                  "Click on 'Request Refund' and provide a clear explanation and supporting evidence (screenshots, delivery files, etc.).",
                  "Our support team will respond within 3-5 business days."
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-blue-800 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Resolution Process */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                5. Resolution Process
              </h2>
              <div className="space-y-3">
                {[
                  "Our team will review the dispute and may contact both buyer and seller for more information.",
                  "If the claim is valid, we will either issue a full refund or a partial refund based on the situation.",
                  "Refunds will be returned to your original payment method or your platform wallet balance."
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-purple-800 text-sm sm:text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Chargebacks */}
            <div className="mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-gray-200">
                6. Chargebacks
              </h2>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-amber-800 leading-relaxed">
                    Initiating a chargeback without first contacting us may result in account suspension or ban. 
                    Please allow us the opportunity to resolve any issues.
                  </p>
                </div>
              </div>
            </div>

            {/* 7. Contact Us */}
            {/* <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                7. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">If you have questions about your refund eligibility, contact us at:</p>
              <address className="not-italic">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-800">support@fulfill1st.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <a href="tel:+18883350221" className="text-blue-600 hover:text-blue-700 transition-colors">
                        +1 (888) 335-0221
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-500">Support Hours</p>
                      <p className="text-gray-800">12:00 AM - 9:00 AM EST</p>
                    </div>
                  </div>
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

export default RefundPolicy;