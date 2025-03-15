'use client';

import React, { useEffect, use } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getListProducts } from '@/app/redux/action/products/creator';

export default function TokoPage({ params }) {
  // Unwrap params menggunakan use()
  const { id } = use(params);

  const dispatch = useDispatch();
  
  // Ambil daftar produk dari Redux store
  const productList = useSelector((state) => state.products.productsList);

  // Konversi ID ke Number
  const productId = Number(id);

  // Cari semua produk yang memiliki link_wa yang sama
  const products = productList.filter((p) => Number(p.link_wa) === productId);

  useEffect(() => {
    if (!productList.length) {
      dispatch(getListProducts()); // Fetch data hanya jika belum ada
    }
  }, [dispatch, productList.length]);

  // Debugging log
  useEffect(() => {
    console.log('Params:', id);
    console.log('Produk dari Redux:', productList);
    console.log('Mencari produk dengan link_wa:', productId);
    console.log('Hasil pencarian:', products);
  }, [productList, productId]);

  // Tampilkan "Loading..." jika data belum tersedia
  if (!productList.length) return <p className="text-center">Loading...</p>;

  // Jika produk tidak ditemukan, tampilkan pesan
  if (!products.length) return <p className="text-center text-red-500">Produk tidak ditemukan</p>;

  return (
    <div className="text-center">
      Cooming Soon
    </div>
  );
}
