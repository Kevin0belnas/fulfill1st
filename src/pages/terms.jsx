import React from 'react';
import { Link} from 'react-router-dom';

const TermStyles = {
 
  footer: {
    backgroundColor: '#fff',
    color: '#555',
    padding: 'clamp(1rem, 3vw, 2rem) 0',
    borderTop: '1px solid #e4e5e7',
    fontFamily: 'sans-serif',
    marginTop: 'clamp(1rem, 3vw, 2rem)',
  },
  footerContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 clamp(1rem, 3vw, 1.25rem)',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    marginBottom:  'clamp(0.5rem, 2vw, 1rem)',
    flexWrap: 'wrap',
  },
  footerLink: {
    color: '#555',
    fontSize: 'clamp(12px, 3vw, 14px)',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#0096c7',
    },
  },
  divider: {
    color: '#ddd',
    fontSize: 'clamp(12px, 3vw, 14px)',
  },
  copyright: {
    fontSize: 'clamp(10px, 2.5vw, 12px)',
    color: '#999',
    marginTop: 'clamp(0.25rem, 1vw, 0.5rem)',
  },
};

const TermsOfService = () => {
  return (
    <div
      className="terms-of-service"
      style={{
        maxWidth: 'clamp(300px, 90vw, 800px)',
        margin: 'clamp(1rem, 3vw, 1.5rem) auto',
        padding: 'clamp(1.5rem, 5vw, 2.5rem) clamp(1rem, 3vw, 1.25rem)',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        fontSize: 'clamp(14px, 3vw, 16px)',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 1.875rem)',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Terms of Service</h1>
      <p>Welcome to Fulfill First Marketplace. These Terms of Service ("Terms") govern your use of our website and our products and services. By accessing or using our website, you agree to comply with and be bound by these Terms. If you do not agree to these Terms, please do not use our website or services.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Use of Our Website</h2>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>Eligibility</h3>
      <p>You must be at least 18 years old to use our website and purchase our products. By using our website, you represent that you meet this age requirement.</p>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>Account Registration</h3>
      <p>To access certain features of our website, you may be required to create an account. You agree to provide accurate and complete information during the registration process and to update such information as needed. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Orders and Payment</h2>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>Product Availability</h3>
      <p>All products listed on our website are subject to availability. We reserve the right to limit the quantity of products we supply, and to discontinue any product at any time.</p>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>Pricing</h3>
      <p>Prices for our products are subject to change without notice. We strive to ensure that pricing information on our website is accurate, but we cannot guarantee the absence of pricing errors. In the event of a pricing error, we will inform you and give you the option to proceed with the purchase at the correct price or cancel your order.</p>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)'}}>Payment</h3>
      <p>We accept various forms of payment as indicated on our website. By providing payment information, you represent and warrant that you are authorized to use the payment method provided. We reserve the right to decline or cancel any order if we suspect fraudulent activity.</p>
      
      <h3 style={{ marginBottom: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        fontSize: 'clamp(1rem, 3.5vw, 1.25rem)' }}>Delivery</h3>
      <p>We strive to deliver your order within the estimated delivery time provided. However, delivery times are not guaranteed and may be affected by factors beyond our control. We are not liable for any delays in delivery.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Returns and Exchanges</h2>
      <p>Due to the nature of our products, we do not accept returns or exchanges. Please review our Return and Exchange Policy for more information.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Intellectual Property</h2>
      <p>All content on our website, including text, images, graphics, logos, and software, is the property of  Fulfill First Marketplace or its licensors and is protected by intellectual property laws. You may not use, reproduce, modify, or distribute any content from our website without our prior written permission.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, Fulfill First Marketplace shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from your use of our website or products. This includes, but is not limited to, damages for loss of profits, data, or other intangible losses.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Indemnification</h2>
      <p>You agree to indemnify and hold Fulfill First Marketplace harmless from any claims, losses, liabilities, damages, and expenses, including legal fees, arising out of your use of our website or violation of these Terms.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Governing Law</h2>
      <p>These Terms are governed by and construed in accordance with the laws of the State of Missouri. Any disputes arising out of or relating to these Terms shall be resolved in the courts of Missouri.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Changes to These Terms</h2>
      <p>We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on our website. Your continued use of our website following the posting of changes constitutes your acceptance of such changes.</p>

      <h2 style={{ marginTop: 'clamp(1.25rem, 3vw, 1.5625rem)', 
        marginBottom: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(1.125rem, 4vw, 1.5rem)' }}>Contact Us</h2>
      <p>If you have any questions or concerns about these Terms, please contact us at:</p>
      <address style={{ fontStyle: 'italic', 
        marginTop: 'clamp(0.75rem, 2vw, 0.9375rem)',
        fontSize: 'clamp(14px, 3vw, 16px)' }}>
  <strong style={{ fontStyle: 'italic' }}>Fulfill First Marketplace</strong><br />
  US: 116 East Lafayette Street, Palmyra, MO 63461<br />
  {/* Email: <a href="mailto:support@411socials.space" style={{ color: '#0066cc', textDecoration: 'none', fontStyle: 'italic' }}>support@411socials.space</a><br /> */}
  Phone: <a href="tel:+1888 335 0221" style={{ color: '#0066cc', textDecoration: 'none', fontStyle: 'italic', fontSize: 'clamp(14px, 3vw, 16px)' }}>+1888 335 0221</a>
</address>



      <footer style={TermStyles.footer}>
        <div style={TermStyles.footerContent}>
          <div style={TermStyles.footerLinks}>
            <Link to="/privacy-policy" style={TermStyles.footerLink}>Privacy Policy</Link>
            <span style={TermStyles.divider}>|</span>
            <Link to="/terms" style={TermStyles.footerLink}>Terms of Service</Link>
            <span style={TermStyles.divider}>|</span>
            <Link to="/refunds" style={TermStyles.footerLink}>Refund Policy</Link>
            <span style={TermStyles.divider}>|</span>
            <Link to="https://app.autobooks.co/pay/page-and-pixel-digital-solutions" style={TermStyles.footerLink}>Payment Link</Link>
          </div>
          <p style={TermStyles.copyright}>© {new Date().getFullYear()} Fulfill First Marketplace. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
};

export default TermsOfService;