'use client';

// import Link from 'next/link';

const Index = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <a href="/berkah-ramadhan" legacyBehavior>
        <a>Go back to the homepage</a>
      </a>
    </div>
  );
};

export default Index;
