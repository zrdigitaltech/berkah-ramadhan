'use client';
import Link from 'next/link';

export default function Index() {
  return (
    <footer className="footers">
      <h3>Buruan Beli Sebelum Kehabisan!</h3>
      {/* <p> Makanan enak buat mood kamu makin semangat lagi</p> */}
      <p className="copyright-text">
        <small>
          {/* &copy; 2022 - {new Date().getFullYear()}{' '} */}
          &copy; {new Date().getFullYear()}{' '}
          <Link href="/" className="text-primary">
            VandZ15
          </Link>{' '}
          Published by{' '}
          <a href="https://zrdevelopers.github.io/" target="_blank" className="text-primary">
            ZRDevelopers
          </a>
          . All rights reserved
        </small>
      </p>
    </footer>
  );
}
