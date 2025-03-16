'use client';

import React, { Fragment, useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';

import SearchBar from '@/app/components/SearchBar';
import SearchResults from '@/app/components/SearchResults';
import ProductList from '@/app/components/ProductList';
import ProductTerlaris from '@/app/components/ProductTerlaris';

import { useSelector, useDispatch } from 'react-redux';
import {
  getListProducts,
  getTerlarisProducts,
  resetProductsInLocalStorage
} from '@/app/redux/action/products/creator';
import { getListKategoris } from '@/app/redux/action/kategoris/creator';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'; // Impor CSS untuk animasi

// modals
import FormWhatsAppModal from '@/app/modals/formWhatsApp';
import TerimaKasihModal from '@/app/modals/terimaKasih';

import { formatPhoneNumber } from '@/app/helper/utils';

export default function Index() {
  const productList = useSelector((state) => state.products.productsList);
  const productTerlaris = useSelector((state) => state.products.productsTerlaris);
  const kategoriList = useSelector((state) => state.kategoris.kategorisList);
  const dispatch = useDispatch();

  const searchResultsRef = useRef();
  const [query, setQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all'); // New state for category filtering
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const mainContent = useRef(null);

  const [showFormWhatsApp, setShowFormWhatsApp] = useState(false);
  const [products, setProducts] = useState([]);
  const [varians, setVarians] = useState({});
  const [quantitys, setQuantitys] = useState({});

  const [showTerimaKasih, setShowTerimaKasih] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);

  const handleScrollDown = () => {
    const html = document.querySelector('html');
    html.classList.add('scroll-smooth');
    mainContent.current?.scrollIntoView();
    html.classList.remove('scroll-smooth');
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    resetProductsInLocalStorage();
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
    }, 500);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setVisibleCount(12);

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

  const handleFormWhatsApp = async (e, products, varians, quantitys) => {
    e.preventDefault();
    setShowFormWhatsApp(true);

    const dataArray = [
      {
        id: products?.id,
        id_kategori: products?.id_kategori,
        name: products?.name,
        images: products?.images,
        link_shopee: products?.link_shopee,
        link_wa: products?.link_wa,
        quantity: quantitys,
        variant: varians
      }
    ];
    setProducts(dataArray);
    setVarians(varians);
    setQuantitys(quantitys);
  };

  const handleCloseModal = async (value) => {
    setShowFormWhatsApp(false);
    setProducts({});
    setVarians({});
    setQuantitys({});
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 12); // Menampilkan tambahan 10 produk
  };

  const getFilteredProducts = () => {
    if (selectedCategory === 'all') {
      return productList.slice(0, visibleCount);
    }
    return productList
      .filter((product) => product.id_kategori === selectedCategory)
      .slice(0, visibleCount);
  };

  const filteredByCategory = useMemo(getFilteredProducts, [
    selectedCategory,
    productList,
    visibleCount
  ]);

  const shouldShowLoadMoreButton = useMemo(() => {
    const totalProducts =
      selectedCategory === 'all'
        ? productList.length
        : productList.filter((product) => product.id_kategori === selectedCategory).length;

    return totalProducts > visibleCount;
  }, [selectedCategory, productList, visibleCount]);

  useEffect(() => {
    fetchProducts();
    fetchKategoris();
    fetchTerlarisProducts();
  }, []);

  const dataBrands = [
    ...new Set(
      productList
        .map((item) => item.link_wa)
        .filter((wa) => wa !== null && wa !== undefined) // Hindari null & undefined
        .map((wa) => wa.toString()) // Konversi ke string setelah filtering
    )
  ];

  return (
    <Fragment>
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
          handleFormWhatsApp={(e, products, varians, quantitys) =>
            handleFormWhatsApp(e, products, varians, quantitys)
          }
        />
      )}
      {/* Kontent - Cemilan untukmu hari ini */}

      <section className="recipes recipes-today" ref={mainContent}>
      <div style={{ height: '60px' }}></div>
        <div className="container mb-3">
        <h2 className="heading-2">Toko Pilihan UntukMu</h2>
          <div className="align-items-center tabs-container">
            

            {/* Scrollable container for other categories */}
            <div className="categories-scrollable">
              {isLoadingCategories ? (
                <div
                  className="align"
                  style={{ display: 'flex', overflowX: 'auto', paddingBottom: '10px' }}
                >
                  {Array(3)
                    .fill()
                    .map((_, index) => (
                      <div key={index} style={{ marginRight: '10px' }}>
                        <Skeleton height={40} width={100} />
                      </div>
                    ))}
                </div>
              ) : (
                dataBrands?.map((brand, idx) => (
                  <Link key={idx || brand} className={`tab`} href={`/${brand}`}>
                    {formatPhoneNumber(brand)}
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="container" style={{ marginBottom: '3rem' }}>
          <h2 className="heading-2" style={{ marginBottom: '1rem' }}>
            Terlaris
          </h2>
          {/* Best Seller */}
          <ProductTerlaris
            product={productTerlaris}
            isLoadingProducts={isLoadingProducts}
            handleFormWhatsApp={(e, products, varians, quantitys) =>
              handleFormWhatsApp(e, products, varians, quantitys)
            }
          />
        </div>
        <div className="container">
          <h2 className="heading-2">Kamu Mungkin Suka</h2>
          {/* Tab Navigation */}
          <div className="tabs-container batasHeader">
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
          <ProductList
            product={filteredByCategory}
            isLoadingProducts={isLoadingProducts}
            handleFormWhatsApp={(e, products, varians, quantitys) =>
              handleFormWhatsApp(e, products, varians, quantitys)
            }
          />

          {/* {productList?.length > visibleCount && ( */}
          {shouldShowLoadMoreButton && (
            <div className="text-center mt-10">
              <button
                disabled={isLoadingProducts}
                onClick={handleLoadMore}
                className="btn btn-primary"
                style={{ width: '50%' }}
              >
                Muat Lebih Banyak
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Modals */}
      <FormWhatsAppModal
        show={showFormWhatsApp}
        onClose={handleCloseModal}
        products={products}
        varians={varians}
        quantitys={quantitys}
        handlePesananViaWhatsApp={() => setShowTerimaKasih(true)}
      />
      <TerimaKasihModal show={showTerimaKasih} onClose={() => setShowTerimaKasih(false)} />
    </Fragment>
  );
}
