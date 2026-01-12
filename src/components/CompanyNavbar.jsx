// components/CompanyNavbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CompanyNavbar() {
  const location = useLocation();
  
  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Back to Services', path: '/' },
  ];
  
  return (
    <nav style={styles.navbar}>
      <div style={styles.navContainer}>
        <Link to="/" style={styles.logo}>
          Fulfill First
        </Link>
        
        <div style={styles.navLinks}>
          {companyLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.path && styles.activeNavLink)
              }}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#FFFFFF',
    padding: '16px 0',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    top: 0,
    zIndex: 1000,
    width: '100%',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2E8B57',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
  },
  navLink: {
    color: '#333333',
    textDecoration: 'none',
    fontWeight: '500',
    padding: '8px',
  },
  activeNavLink: {
    color: '#2E8B57',
    fontWeight: '600',
  },
};