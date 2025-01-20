'use client';

import React, { Fragment, useEffect, useState, useRef } from 'react';

import Navbar from '@/app/components/Navbar';
import SearchBar from '@/app/components/SearchBar';
import SearchResults from '@/app/components/SearchResults';
import ProductList from '@/app/components/ProductList';
import Footer from '@/app/components/Footer';

// import { FloatingWhatsApp } from "react-floating-whatsapp";

import { useSelector, useDispatch } from 'react-redux';
import { getListFloatingWhatsapp } from '@/app/redux/action/floatingWhatsapp/creator';
import { getListProducts } from '@/app/redux/action/products/creator';

export default function Index() {
  const searchResultsRef = useRef();
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const mainContent = useRef(null);

  const handleScrollDown = () => {
    const html = document.querySelector('html');
    html.classList.add('scroll-smooth');
    mainContent.current?.scrollIntoView();
    html.classList.remove('scroll-smooth');
  };

  const floatingWhatsAppList = useSelector((state) => state.floatingWhatsapp.floatingWhatsappList);
  const productList = useSelector((state) => state.products.productsList);
  const dispatch = useDispatch();

  const fetchFloatingWhatsApp = async () => {
    dispatch(getListFloatingWhatsapp());
  };

  const fetchProducts = async () => {
    dispatch(getListProducts());
  };

  const handleSearch = async (e) => {
    setQuery(e?.target?.value);
    setFilteredProducts([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const filteredList = productList.filter((product) =>
        product.name
          .replace(/[-/]/g, '')
          .toLowerCase()
          .includes(query.replace(/[-/]/g, '').toLowerCase())
      );
      setFilteredProducts(filteredList);

      if (query && filteredList) {
        const offsetTop = searchResultsRef?.current?.offsetTop;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
      setIsLoading(false);
    }, 2000);
  };

  useEffect(() => {
    fetchFloatingWhatsApp();
    fetchProducts();
  }, []);

  return (
    <Fragment>
      <Navbar />
      <section className="hero" style={{ backgroundImage: `url('/assets/images/bg-hero.png')` }}>
        <div className="container">
          <h1>
            Yuk, temukan yang kamu butuhkan!
            <br />
            Cari aja disini!
          </h1>
          <SearchBar
            value={query ? query : ''}
            onChange={(e) => handleSearch(e)}
            onSubmit={handleSubmit}
          />
          {isLoading && (
            <div>
              {' '}
              <p>Tunggu sebentar...</p>
            </div>
          )}
          <div className="mouse-scroll-anim" onClick={handleScrollDown}></div>
        </div>
      </section>
      {/* Kontent - Hasil pencarian cemilan */}
      {query && (
        <SearchResults
          keyword={query}
          isLoading={isLoading}
          productList={filteredProducts}
          searchResultsRef={searchResultsRef}
        />
      )}
      {/* Kontent - Cemilan untukmu hari ini */}

      <section className="recipes recipes-today" ref={mainContent}>
        <div className="container">
          <h2 className="heading-2">Rekomendasi</h2>
          <ProductList product={productList} />
        </div>
      </section>
      <Footer />
      {/* <FloatingWhatsApp
                avatar={floatingWhatsAppList?.avatar}
                phoneNumber={floatingWhatsAppList?.phone_number}
                accountName={floatingWhatsAppList?.account_name}
                chatMessage={floatingWhatsAppList?.chat_message}
                statusMessage={floatingWhatsAppList?.status_message}
                darkMode={true}
                allowEsc={true}
                allowClickAway
                notification
                notificationDelay={60000} // 1 minute
                notificationSound
                styles={{
                    position: "fixed",
                    bottom: "15px",
                    height: "0px !important",
                }}
            /> */}
    </Fragment>
  );
}
