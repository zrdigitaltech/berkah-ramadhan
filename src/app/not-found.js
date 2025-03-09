'use client';

import Link from 'next/link';

const Page = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link href="/" legacyBehavior>
        Go back to the homepage
      </Link>
    </div>
  );
};

export default Page;
