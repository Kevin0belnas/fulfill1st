import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
 import ChatBubble from '../components/ChatBubble';

const ContactPage = () => {

   const chatBubbleRef = React.useRef(); 

  return (
    <div style={styles.container}>
      {/* Header with Background Image and Single Title */}
      <div style={styles.header}>
        <div style={styles.headerOverlay}>
          <h1 style={styles.title}>CONTACT US</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={styles.content}>
        {/* Form Section */}
        <div style={styles.formSection}>
          <div style={styles.formColumn}>
            {/* Left Column - Form */}
            <div style={styles.infoColumn}>
            <h2 style={styles.infoTitle}>KEEP IN TOUCH</h2>
            <div style={styles.infoItem}>
              <h3 style={styles.infoSubtitle}>Phone</h3>
              <p style={styles.infoText}>( +1888 335 0221)</p>
            </div>
            <div style={styles.infoItem}>
              <h3 style={styles.infoSubtitle}>Email</h3>
              <p style={styles.infoText}> support@411socials.space</p>
            </div>
            <button 
                onClick={() => chatBubbleRef.current?.openChat()} 
                style={styles.contactButton}
              >
                CONTACT AGENT
              </button>
              <ChatBubble ref={chatBubbleRef} />
            <div style={styles.infoItem}>
              {/* <h3 style={styles.infoSubtitle}>US Address</h3>
              <p style={styles.infoText}>118 East Lafayette Street, Palmyra, MO 63461</p> */}
            </div>
          </div>
          </div>

          {/* Right Column - Contact Info */}
          
          {/* <div style={styles.formGroup}>
              <h1 style={styles.formTitle}>CONTACT US</h1>
              <p style={styles.subtitle}>Drop your details below and we'll get back to you within a day.</p>
              
              <div style={styles.formRow}>
                <input type="text" placeholder="Name" style={styles.input} />
                <input type="text" placeholder="Type of enquiry" style={styles.input} />
              </div>
             
              <div style={styles.formRow}>
                <input type="email" placeholder="Email" style={styles.input} />
                <input type="tel" placeholder="Your Phone" style={styles.input} />
              </div>

              <textarea placeholder="Message" style={styles.textarea} rows="4"></textarea>
              <button style={styles.sendButton}>SEND</button>
            </div> */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '100%',
    margin: '0 auto',
    padding: '0',
    overflowX: 'hidden',
  },
  header: {
    backgroundImage: 'url(https://www.shutterstock.com/image-photo/call-center-customer-support-indian-600nw-2561972505.jpg)' , // Replace with your image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: 'clamp(150px, 25vw, 250px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    position: 'relative',
    marginTop: '3rem',
    width: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 'clamp(1.5rem, 5vw, 3rem)',
    textTransform: 'uppercase',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 2,
    padding: '0 clamp(0.5rem, 3vw, 2rem)',
    textAlign: 'center',
  },
  content: {
    padding: 'clamp(1rem, 5vw, 2.5rem)',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
     gap: 'clamp(1rem, 3vw, 2.5rem)',
    width: '100%',
  },
  formColumn: {
    width: '100%',
  },
  infoColumn: {
    width: '100%',
    padding: '0',

  },
  infoTitle: {
    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
    marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
    fontWeight: 'bold',
    color: 'rgb(30, 150, 90)',
  },
  infoItem: {
   marginBottom: 'clamp(1rem, 3vw, 1.5rem)',
  },
  infoSubtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    marginBottom: '0.5rem',
    fontWeight: 'bold',
  },
  infoText: {
   fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    margin: '0',
    color: '#555',
  },
  contactButton: {
    backgroundColor: '#087830',
    color: 'white',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    margin: '0 auto clamp(1rem, 3vw, 1.5rem)', // Center horizontally
    width: 'clamp(150px, 50vw, 200px)',
    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',

  },
  
};

export default ContactPage;