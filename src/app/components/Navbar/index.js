import React from 'react';
import logo from '@/app/images/vandz15.png';
import Link from 'next/link'; // Ensure Link is imported from next/link

const Index = () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variable
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="brand">
            <img
              src={domain + "/assets/images/vandz15.png"}
              alt="Logo"
              className="brand-img"
            />
          </Link>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                target="_blank"
                className="nav-link"
                href="https://wa.me/6281287799457?text=Halo,pesan berkah-ramadhan. Ini alamat kirim saya`"
              >
                WhatsApp kami
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Index;
