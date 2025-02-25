'use client';

import React from 'react';
import ProductList from '@/app/components/ProductList';

const SearchResults = (props) => {
  const { keyword, productList, isLoading, searchResultsRef, handleFormWhatsApp } = props;

  return (
    <section className="recipes recipes-search-results" ref={searchResultsRef}>
      <div className="container">
        <h2 className="heading-2">
          Hasil pencarian untuk <span style={{ color: '#51C273' }}>{keyword} </span>
          {productList && <span className="amount">({productList?.length})</span>}
        </h2>
        {isLoading && <p>Tunggu sebentar...</p>}
        {productList && (
          <ProductList
            product={productList}
            handleFormWhatsApp={(e, products, varians, quantitys) =>
              handleFormWhatsApp(e, products, varians, quantitys)
            }
          />
        )}
      </div>
    </section>
  );
};

export default SearchResults;
