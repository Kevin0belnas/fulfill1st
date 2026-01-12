import React from 'react';
import { Link} from 'react-router-dom';

const privacyStyles = {
 
  footer: {
    backgroundColor: '#fff',
    color: '#555',
    padding: 'clamp(1rem, 3vw, 2rem) 0',
    borderTop: '1px solid #e4e5e7',
    fontFamily: 'sans-serif',
    marginTop: 'clamp(1rem, 3vw, 2rem)',
  },
  footerContent: {
    maxWidth: 'clamp(300px, 90vw, 1400px)',
    margin: '0 auto',
    padding: '0 clamp(10px, 3vw, 20px)',
    textAlign: 'center',
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
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
    fontSize: 'clamp(10px, 2vw, 12px)',
    color: '#999',
    marginTop: 'clamp(0.25rem, 1vw, 0.5rem)',
  },
};

const PrivacyPolicy = () => {
  return (
    <div
      className="privacy-policy"
      style={{
        maxWidth: 'clamp(300px, 90vw, 800px)',
        margin: 'clamp(1rem, 3vw, 2rem) auto',
        padding: 'clamp(1rem, 5vw, 40px) clamp(0.5rem, 3vw, 20px)',
        fontFamily: 'Arial, sans-serif',
        fontSize: 'clamp(14px, 2vw, 16px)',
        lineHeight: 1.6,
      }}
    >
     <h1 style={{ textAlign: 'center',fontSize: 'clamp(1.5rem, 5vw, 2rem)',
       marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>Privacy Policy</h1>
      <p>We value your privacy and strive to protect your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website https://fulfill1st.com/, use our services, or purchase our products, including hair extensions.</p>
      
      <p>By using our website and services, you agree to the terms of this Privacy Policy.</p>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Information We Collect</h2>
      <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Personal Information</h3>
      <p>When you visit our website or purchase our products, we may collect the following personal information:</p>
      <ul style={{ paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Shipping address</li>
        <li>Payment information</li>
      </ul>

      <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Non-Personal Information</h3>
      <p>We may also collect non-personal information, including but not limited to:</p>
      <ul style={{ paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <li>Browser type and version</li>
        <li>IP address</li>
        <li>Pages visited and time spent on our website</li>
        <li>Referring website</li>
      </ul>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Process and fulfill your orders</li>
        <li>Communicate with you regarding your orders or inquiries</li>
        <li>Improve our website and services</li>
        <li>Send promotional emails and newsletters (with your consent)</li>
        <li>Analyze website usage and trends</li>
      </ul>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>How We Protect Your Information</h2>
      <p>We implement a variety of security measures to maintain the safety of your personal information. These measures include:</p>
      <ul style={{ paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <li>Secure Socket Layer (SSL) technology to encrypt data</li>
        <li>Regular malware scans</li>
        <li>Access control measures to restrict access to your personal information</li>
      </ul>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Sharing Your Information</h2>
      <p>We do not sell, trade, or otherwise transfer your personal information to outside parties, except in the following circumstances:</p>
      <ul style={{ paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <li>To trusted third parties who assist us in operating our website, conducting our business, or servicing you, provided that these parties agree to keep your information confidential.</li>
        <li>When required by law or to protect our rights, property, or safety.</li>
      </ul>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Cookies and Tracking Technologies</h2>
      <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small files that a site or its service provider transfers to your computer's hard drive through your web browser that enables the site's systems to recognize your browser and capture and remember certain information.</p>
      <p>You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.</p>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Your Rights</h2>
      <p>Depending on your location, you may have the following rights regarding your personal information:</p>
      <ul style={{ paddingLeft: 'clamp(1rem, 4vw, 1.5rem)' }}>
        <li><strong>Access:</strong> You can request a copy of your personal information we hold.</li>
        <li><strong>Correction:</strong> You can request that we correct any inaccuracies in your personal information.</li>
        <li><strong>Deletion:</strong> You can request that we delete your personal information.</li>
        <li><strong>Opt-out:</strong> You can opt-out of receiving promotional communications from us.</li>
      </ul>
      <p>To exercise any of these rights, please contact us at <a href="tel:+1888 335 0221">Phone: +1888 335 0221</a>.</p>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Changes to This Privacy Policy</h2>
      <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website. You are advised to review this Privacy Policy periodically for any changes.</p>

      <h2 style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>Contact Us</h2>
      <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
      <address>
        <strong>Fulfill First Marketplace</strong><br />
        US: 116 East Lafayette Street, Palmyra, MO 63461<br />
        {/* Email: <a href="mailto:support@411socials.space">support@411socials.space</a><br /> */}
        Phone: <a href="tel:+1888 335 0221">+1888 335 0221</a>
      </address>



       <footer style={privacyStyles.footer}>
        <div style={privacyStyles.footerContent}>
          <div style={privacyStyles.footerLinks}>
            <Link to="/privacy-policy" style={privacyStyles.footerLink}>Privacy Policy</Link>
            <span style={privacyStyles.divider}>|</span>
            <Link to="/terms" style={privacyStyles.footerLink}>Terms of Service</Link>
            <span style={privacyStyles.divider}>|</span>
            <Link to="/refunds" style={privacyStyles.footerLink}>Refund Policy</Link>
            <span style={privacyStyles.divider}>|</span>
            <Link to="https://app.autobooks.co/pay/page-and-pixel-digital-solutions" style={privacyStyles.footerLink}>Payment Link</Link>
          </div>
          <p style={privacyStyles.copyright}>© {new Date().getFullYear()} Fulfill First Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>



  );
};

export default PrivacyPolicy;