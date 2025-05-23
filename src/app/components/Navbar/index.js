'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './cart.scss';
import './navbar.scss';

import { useSelector, useDispatch } from 'react-redux';
import { getListKeranjangs } from '@/app/redux/action/keranjangs/creator';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Index = () => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variables
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartRef = useRef(null); // Untuk mendeteksi klik di luar dropdown

  const keranjangsList = useSelector((state) => state.keranjangs.keranjangsList ?? []);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const displayedItems = keranjangsList?.slice(0, 4);
  const remainingItemsCount = Math.max(0, keranjangsList?.length - displayedItems?.length);

  const [isSticky, setIsSticky] = useState(true);
  const observerRef = useRef(null); // Menyimpan observer agar bisa dihapus nanti

  const fetchKeranjangs = async () => {
    setIsLoading(true);
    await dispatch(getListKeranjangs());
    setIsLoading(false);
  };

  const handleSticky = () => {
    const tabsContainer = document.querySelector('.batasHeader'); // Ambil elemen dengan class tabs-container

    if (!tabsContainer) return; // Cegah error jika elemen belum tersedia

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting); // Jika tabs-container terlihat, header berhenti sticky
      },
      { rootMargin: '0px 0px -1000px 0px' } // Sesuaikan margin agar deteksi lebih halus
    );

    observer.observe(tabsContainer); // Amati elemen tabs-container

    return () => observer.disconnect(); // Hapus observer saat komponen unmount
  };

  // Menutup dropdown saat klik di luar area cart
  useEffect(() => {
    handleSticky();
    fetchKeranjangs();
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className={isSticky ? 'sticky-header' : 'relative-header'}>
      <div className="container">
        <nav className="navbar">
          <Link href="/" className="brand">
            <img src={domain + '/assets/images/vandz15.png'} alt="Logo" className="brand-img" />
          </Link>
          <ul className="nav-list">
            {pathname !== '/' &&
              <li className="nav-item">
                <Link className={`nav-link ${pathname === '/' ? 'selected' : ''}`} href="/">
                  <span className="produk-icon">🛍️</span>
                </Link>
              </li>
            }
            {pathname === '/keranjang' ? (
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === '/keranjang' ? 'selected' : ''}`}
                  href="/keranjang"
                >
                  Keranjang Saya
                </Link>
              </li>
            ) : (
              <li
                className="nav-item cart"
                ref={cartRef} // Gunakan ref untuk mendeteksi klik luar
                onMouseEnter={() => setIsCartOpen(true)}
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <Link
                  className={`nav-link ${pathname === '/keranjang' ? 'selected' : ''}`}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="cart-icon">🛒</span>
                </Link>
                <span className="favorite-counter">{keranjangsList?.length}</span>

                {/* Dropdown Produk dalam Keranjang */}
                <div
                  className={`cart-dropdown ${isCartOpen ? 'open' : ''}`}
                  onMouseLeave={() => setIsCartOpen(false)}
                >
                  <div className="cart-items">
                    {isLoading ? (
                      Array(4)
                        .fill()
                        .map((_, idx) => (
                          <div key={idx} className="mb-2">
                            <Skeleton height={60} />
                          </div>
                        ))
                    ) : displayedItems?.length > 0 ? (
                      displayedItems?.map((item, idx) => (
                        <div className="cart-item" key={idx || item?.id}>
                          <img
                            src={
                              item?.images?.startsWith('/assets/images/')
                                ? domain + item.images
                                : item?.images || 'https://placehold.co/1024x1024'
                            }
                            alt={item?.name}
                            className="cart-item-image"
                          />
                          <div className="cart-item-info text-truncate">
                            <p className="cart-item-name text-truncate" title={item?.name}>
                              {item?.name}
                            </p>
                            <h4 className="cart-item-price" style={{ color: '#a0a0a0' }}>
                              {item?.variant?.jumlah} {item?.variant?.nama_berat}
                            </h4>
                            <h4 className="cart-item-price">
                              {item?.quantity} x <small>Rp</small>
                              {item?.variant?.harga?.toLocaleString('id-ID')}{' '}
                              <small
                                style={{
                                  textDecoration: 'line-through',
                                  color: 'rgb(160, 160, 160)'
                                }}
                              >
                                <small>Rp</small>
                                {item.variant?.harga_normal?.toLocaleString('id-ID')}
                              </small>
                            </h4>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-cart">
                        <p className="empty-cart-message">Oops! Keranjangmu masih kosong.</p>
                      </div>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="mb-3">
                      <Skeleton height={30} />
                    </div>
                  ) : (
                    <div className="cart-footer">
                      <p className="remaining-items">
                        {remainingItemsCount > 0 ? `+${remainingItemsCount} Produk Lainnya` : ''}
                      </p>

                      {keranjangsList?.length > 0 && (
                        <Link
                          href="/keranjang"
                          className="view-cart-button"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Lihat Keranjang
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Index;
