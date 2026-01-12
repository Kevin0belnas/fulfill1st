// pages/About.js
import React from 'react';

export default function About() {
  return (
    <div style={styles.container}>
      <h1>About Us</h1>
      <p>This is the About page with a different navbar/layout.</p>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};