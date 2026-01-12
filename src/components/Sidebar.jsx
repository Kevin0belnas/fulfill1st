import React from 'react';
import { Link } from 'react-router-dom';

const sidebarStyles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f8f8',
    padding: '20px 0',
    borderRight: '1px solid #e1e1e1',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    // overflowY: 'auto'
  },
  heading: {
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    borderBottom: '1px solid #e1e1e1',
    marginBottom: '15px'
  },
  category: {
    padding: '12px 20px',
    fontSize: '16px',
    color: '#555',
    display: 'block',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    borderLeft: '3px solid transparent',
    '&:hover': {
      backgroundColor: '#e9e9e9',
      color: '#008080',
      borderLeft: '3px solid #008080'
    }
  },
  activeCategory: {
    padding: '12px 20px',
    fontSize: '16px',
    color: '#008080',
    display: 'block',
    textDecoration: 'none',
    backgroundColor: '#e9e9e9',
    borderLeft: '3px solid #008080',
    fontWeight: '600'
  },
  readMore: {
    padding: '12px 20px',
    fontSize: '14px',
    color: '#008080',
    display: 'block',
    textDecoration: 'none',
    fontWeight: '600',
    marginTop: '10px',
    '&:hover': {
      textDecoration: 'underline'
    }
  }
};

const Sidebar = ({ activeCategory }) => {
  const categories = [
    "All services",
    "Digital Marketing",
    "Programming & Tech",
    "Writing & Translation",
    "Business Services",
    "Video & Animation",
    "Music & Audio",
    "Graphics Design"
  ];

  return (
    <div style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.heading}>Categories</div>
      
      {categories.map((category) => (
        <Link
          to={`/${category.toLowerCase().replace(/\s+/g, '-')}`}
          key={category}
          style={
            activeCategory === category.toLowerCase().replace(/\s+/g, '-')
              ? sidebarStyles.activeCategory
              : sidebarStyles.category
          }
        >
          {category}
        </Link>
      ))}
      
      <Link to="/more-services" style={sidebarStyles.readMore}>
        More →
      </Link>
    </div>
  );
};

export default Sidebar;