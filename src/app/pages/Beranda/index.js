'use client';

import React, { Fragment, useEffect, useState, useRef } from 'react';

import Navbar from '@/app/components/Navbar';
import SearchBar from '@/app/components/SearchBar';
import SearchResults from '@/app/components/SearchResults';
import ProductList from '@/app/components/ProductList';
import ProductTerlaris from '@/app/components/ProductTerlaris';
import Footer from '@/app/components/Footer';

import { FloatingWhatsApp } from 'react-floating-whatsapp';

import { useSelector, useDispatch } from 'react-redux';
import { getListFloatingWhatsapp } from '@/app/redux/action/floatingWhatsapp/creator';
import { getListProducts, getTerlarisProducts } from '@/app/redux/action/products/creator';
import { getListKategoris } from '@/app/redux/action/kategoris/creator';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Impor CSS untuk animasi

export default function Index() {
  const searchResultsRef = useRef();
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // New state for category filtering
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const mainContent = useRef(null);

  const handleScrollDown = () => {
    const html = document.querySelector('html');
    html.classList.add('scroll-smooth');
    mainContent.current?.scrollIntoView();
    html.classList.remove('scroll-smooth');
  };

  const floatingWhatsAppList = useSelector((state) => state.floatingWhatsapp.floatingWhatsappList);
  const productList = useSelector((state) => state.products.productsList);
  const productTerlaris = useSelector((state) => state.products.productsTerlaris);
  const kategoriList = useSelector((state) => state.kategoris.kategorisList);
  const dispatch = useDispatch();

  const fetchFloatingWhatsApp = async () => {
    dispatch(getListFloatingWhatsapp());
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    await dispatch(getListProducts());
    setIsLoadingProducts(false);
  };

  const fetchKategoris = async () => {
    setIsLoadingCategories(true);
    await dispatch(getListKategoris());
    setIsLoadingCategories(false);
  };

  const fetchTerlarisProducts = async () => {
    setIsLoadingProducts(true);
    await dispatch(getTerlarisProducts());
    setIsLoadingProducts(false);
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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Scroll back to the top with an offset
    const element = document.getElementById('recipeList');
    if (element) {
      const offset = 70; // Adjust this value for the desired spacing
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const filteredByCategory =
    selectedCategory === 'all'
      ? productList
      : productList.filter((product) => product.id_kategori === selectedCategory);

  useEffect(() => {
    fetchFloatingWhatsApp();
    fetchProducts();
    fetchKategoris();
    fetchTerlarisProducts();
  }, []);

  return (
    <Fragment>
      <Navbar />
      <section
        className="hero"
        style={{ backgroundImage: `url('/berkah-ramadhan/assets/images/bg-hero.png')` }}
      >
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
        <div className="container" style={{ marginBottom: '3rem' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>
            Terlaris
          </h2>
          {/* Best Seller */}
          <ProductTerlaris product={productTerlaris} isLoadingProducts={isLoadingProducts} />
        </div>
        <div className="container">
          <h2 className="heading-2">Kamu Mungkin Suka</h2>
          {/* Tab Navigation */}
          <div className="tabs-container">
            {/* Button "ALL" outside the scrollable container */}
            {isLoadingCategories ? null : (
              <button
                className={`tab ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('all')}
              >
                ALL
              </button>
            )}

            {/* Scrollable container for other categories */}
            <div className="categories-scrollable">
              {isLoadingCategories ? (
                <div style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px' }}>
                  {Array(3)
                    .fill()
                    .map((_, index) => (
                      <div key={index} style={{ marginRight: '10px' }}>
                        <Skeleton height={40} width={100} />
                      </div>
                    ))}
                </div>
              ) : (
                kategoriList?.map((category) => (
                  <button
                    key={category?.id}
                    className={`tab ${selectedCategory === category?.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category?.id)}
                  >
                    {category?.name?.toUpperCase()}
                  </button>
                ))
              )}
            </div>
          </div>
          {/* Produk List */}
          <ProductList product={filteredByCategory} isLoadingProducts={isLoadingProducts} />
        </div>
      </section>
      <Footer />
      <FloatingWhatsApp
        avatar={floatingWhatsAppList?.avatar}
        phoneNumber={floatingWhatsAppList?.phone_number}
        accountName={floatingWhatsAppList?.account_name}
        chatMessage={floatingWhatsAppList?.chat_message}
        statusMessage={floatingWhatsAppList?.status_message}
        darkMode={true}
        placeholder="Ketik pesan..."
        // allowEsc={true}
        // allowClickAway
        // notification
        // notificationDelay={60000} // 1 minute
        // notificationSound
        styles={{
          position: 'fixed',
          bottom: '15px',
          height: '0px !important',
          fontSize: '14px'
        }}
      />
    </Fragment>
  );
}
