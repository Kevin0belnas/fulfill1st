// layouts/CompanyLayout.jsx
import React from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import FulfillmentNav from '../components/FulfillmentNav';
import CompanyLogin from '../pages/CompanyLogin'; // Import the login page

const CompanyLayout = () => (
  <div style={styles.layout}>
    <FulfillmentNav />
    <div style={styles.mainContent}>
      <div style={styles.pageContent}>
        {/* Render nested routes */}
        <Outlet />
        
        {/* Add login route inside this layout */}
        <Routes>
          <Route path="/company/login" element={<CompanyLogin />} />
        </Routes>
      </div>
    </div>
  </div>
);

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
  },
  mainContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  pageContent: {
    flexGrow: 1,
    padding: '0.5rem',
    paddingBottom: '1rem',
    backgroundColor: '#f8fafc',
    paddingTop: '80px', // Space for fixed navbar
  }
};

export default CompanyLayout;