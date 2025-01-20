import React from 'react';
import logo from '@/app/images/vandz15.png';
import Image from 'next/image';
import Link from 'next/link'; // Ensure Link is imported from next/link

const Index = () => {
  return (
    <header>
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="brand">
            <Image
              src={logo} // Image source
              alt="Logo" // Image alt text
              className="brand-img" // Optional className for styling
              width={150} // Adjust width based on your design
              height={60} // Adjust height based on your design
              // sizes="(max-width: 768px) 100vw, 50vw"  // Optional: for responsive images
            />
          </Link>
          <ul className="nav-list">
            <li className="nav-item">
              <Link
                target="_blank"
                className="nav-link"
                href="https://wa.me/6281287799457?text=Halo,pesan vandz15.github.io. Ini alamat kirim saya`"
              >
                Whatsapp kami
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Index;
