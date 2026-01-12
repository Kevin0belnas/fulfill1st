import React from 'react';
import { Link} from 'react-router-dom';

const refundStyles = {
 
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

const RefundPolicy = () => {
  return (
    <div
      className="refund-policy"
      style={{
        maxWidth: 'clamp(300px, 90vw, 800px)',
        margin: 'clamp(1rem, 3vw, 1.5rem) auto',
        padding: 'clamp(1rem, 5vw, 40px) clamp(0.5rem, 3vw, 20px)',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        fontSize: 'clamp(14px, 2vw, 16px)'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: 'clamp(1rem, 3vw, 30px)',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Refund Policy</h1>
      <p style={{  marginBottom: 'clamp(1rem, 3vw, 20px)', 
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 2vw, 16px)' }}>Effective Date: January 1, 2025</p>
      
      <p style={{ marginBottom: 'clamp(1rem, 3vw, 20px)' }}>
        We are committed to ensuring satisfaction with every service delivered through our platform. 
        This Refund Policy outlines the conditions under which users may request refunds.
      </p>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>1. General Policy</h2>
        <p>
          Due to the nature of digital services, refunds are only issued under certain conditions. 
          Refunds are not guaranteed and are issued at the discretion of Fulfill First Marketplace after careful review.
        </p>
      </section>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>2. Eligible Refund Scenarios</h2>
        <p style={{ marginBottom: 'clamp(0.5rem, 2vw, 10px)'  }}>You may be eligible for a refund if:</p>
        <ul style={{ marginLeft: 'clamp(1rem, 3vw, 20px)', 
          marginBottom: 'clamp(0.75rem, 2vw, 15px)' }}>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>The service was not delivered by the agreed-upon deadline and no valid reason was provided.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>The delivered work does not match the service description or requirements clearly communicated before the order was placed.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>The seller is unresponsive for more than 7 days after the order is placed.</li>
          <li>The service was purchased due to a technical error (e.g., double payment, incorrect billing).</li>
        </ul>
      </section>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{  marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>3. Non-Refundable Scenarios</h2>
        <p style={{ marginBottom: 'clamp(0.5rem, 2vw, 10px)' }}>Refunds will not be issued in the following cases:</p>
        <ul style={{ marginLeft: 'clamp(1rem, 3vw, 20px)', 
          marginBottom: 'clamp(0.75rem, 2vw, 15px)' }}>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>You changed your mind after the order was placed.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>You were dissatisfied due to unclear instructions or scope.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>The service was marked as "Completed" and later requested for a refund without proper cause.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>Custom work was delivered and partially or fully used/downloaded.</li>
          <li>Delays or issues caused by your own lack of communication or feedback.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)'}}>4. Requesting a Refund</h2>
        <p style={{ marginBottom: 'clamp(0.5rem, 2vw, 10px)' }}>To request a refund:</p>
        <ol style={{marginLeft: 'clamp(1rem, 3vw, 20px)', 
          marginBottom: 'clamp(0.75rem, 2vw, 15px)' }}>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>Go to your order dashboard and select the relevant order.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>Click on "Request Refund" and provide a clear explanation and supporting evidence (screenshots, delivery files, etc.).</li>
          <li>Our support team will respond within 3-5 business days.</li>
        </ol>
      </section>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>5. Resolution Process</h2>
        <ul style={{ marginLeft: 'clamp(1rem, 3vw, 20px)', 
          marginBottom: 'clamp(0.75rem, 2vw, 15px)' }}>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)'}}>Our team will review the dispute and may contact both buyer and seller for more information.</li>
          <li style={{ marginBottom: 'clamp(0.25rem, 1vw, 8px)' }}>If the claim is valid, we will either issue a full refund or a partial refund based on the situation.</li>
          <li>Refunds will be returned to your original payment method or your platform wallet balance.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 'clamp(1rem, 3vw, 25px)' }}>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>6. Chargebacks</h2>
        <p>
          Initiating a chargeback without first contacting us may result in account suspension or ban. 
          Please allow us the opportunity to resolve any issues.
        </p>
      </section>

      <section>
        <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)', 
          paddingBottom: 'clamp(0.25rem, 1vw, 8px)', 
          borderBottom: '1px solid #e2e8f0',
          fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>7. Contact Us</h2>
        <p style={{ marginBottom: 'clamp(0.75rem, 2vw, 15px)' }}>If you have questions about your refund eligibility, contact us at:</p>
       <div style={{ backgroundColor: '#f8f9fa', padding: 'clamp(0.75rem, 2vw, 15px)', borderRadius: '5px' }}>
  {/* <p style={{ marginBottom: '8px', fontStyle: 'italic' }}>
    <strong style={{ fontStyle: 'italic' }}>Email:</strong> 
    <a href="mailto:support@411socials.com" style={{ color: '#0066cc', textDecoration: 'none', fontStyle: 'italic' }}>
      support@411socials.com
    </a>
  </p> */}
  <p style={{ fontStyle: 'italic' }}>
    <strong>Phone: </strong><a href="tel:+1888 335 0221" >+1888 335 0221</a>
  </p>
  <p style={{ fontStyle: 'italic' }}>
    <strong style={{ fontStyle: 'italic' }}>Support Hours:</strong> 12:00am-9am EST
  </p>

        </div>
      </section>


<footer style={refundStyles.footer}>
        <div style={refundStyles.footerContent}>
          <div style={refundStyles.footerLinks}>
            <Link to="/privacy-policy" style={refundStyles.footerLink}>Privacy Policy</Link>
            <span style={refundStyles.divider}>|</span>
            <Link to="/terms" style={refundStyles.footerLink}>Terms of Service</Link>
            <span style={refundStyles.divider}>|</span>
            <Link to="/refunds" style={refundStyles.footerLink}>Refund Policy</Link>
            <span style={refundStyles.divider}>|</span>
            <Link to="https://app.autobooks.co/pay/page-and-pixel-digital-solutions" style={refundStyles.footerLink}>Payment Link</Link>
          </div>
          <p style={refundStyles.copyright}>© {new Date().getFullYear()} Fulfill First Marketplace. All rights reserved.</p>
        </div>
      </footer>


    </div>
  );
};

export default RefundPolicy;