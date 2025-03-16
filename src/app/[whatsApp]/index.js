'use client';

import React, { useEffect, useState, Fragment } from 'react';
import './id.scss';

import ProductList from '@/app/components/ProductList';

import { useSelector, useDispatch } from 'react-redux';
import { getListProducts } from '@/app/redux/action/products/creator';

import { formatPhoneNumber } from '@/app/helper/utils';

// modals
import FormWhatsAppModal from '@/app/modals/formWhatsApp';
import TerimaKasihModal from '@/app/modals/terimaKasih';
import ShareModal from '@/app/modals/share';

export default function TokoPage(props) {
  // Unwrap params menggunakan use()
  const { whatsApp } = props;

  const dispatch = useDispatch();

  // Ambil daftar produk dari Redux store
  const productList = useSelector((state) => state.products.productsList);
  const [isLoading, setIsLoading] = useState(false);

  // Konversi ID ke Number
  const productId = Number(whatsApp);

  // Cari semua produk yang memiliki link_wa yang sama
  const products = productList.filter((p) => Number(p.link_wa) === productId);

  const [showFormWhatsApp, setShowFormWhatsApp] = useState(false);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataVarians, setDataVarians] = useState({});
  const [dataQuantitys, setDataQuantitys] = useState({});

  const [visibleProducts, setVisibleProducts] = useState(12); // Awalnya tampilkan 12 produk
  const [showTerimaKasih, setShowTerimaKasih] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + 12); // Tambah 12 produk setiap klik
  };

  const handleShareShop = () => {
    setShowShare(true);
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
    setDataProducts(dataArray);
    setDataVarians(varians);
    setDataQuantitys(quantitys);
  };
  const handleCloseModal = async (value) => {
    setShowFormWhatsApp(false);
    setDataProducts({});
    setDataVarians({});
    setDataQuantitys({});
  };

  const handleChatPenjual = () => {
    if (!productId) {
      alert('Nomor WhatsApp tidak ditemukan.');
      return;
    }

    // Format nomor WhatsApp (tanpa spasi dan simbol yang tidak perlu)
    const waNumber = productId.toString().replace(/\D/g, ''); // Hanya angka
    const waLink = `https://wa.me/${waNumber}?text=Halo%20saya%20tertarik%20dengan%20produk%20Anda.%20Bisa%20saya%20mendapatkan%20informasi%20lebih%20lanjut?`;

    window.open(waLink, '_blank');
  };

  const fetchProducts = async () => {
    if (!productList.length) {
      setIsLoading(true);
      await dispatch(getListProducts()); // Fetch data hanya jika belum ada
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch, productList.length]);

  // Debugging log
  useEffect(() => {}, [productList, productId]);

  return (
    <Fragment>
      <section>
        <div className="container">
          <div className="card-toko">
            <h1 className="text-2xl font-bold">{formatPhoneNumber(whatsApp)}</h1>
            <small>Kota Tangerang</small>
            <div className="d-flex mt-3">
              <button
                type="button"
                className="btn btn-primary px-4 w-auto"
                onClick={handleChatPenjual}
              >
                Chat Penjual
              </button>
              <button type="button" className="btnShareShop" onClick={handleShareShop}>
                <span>
                  <svg
                    className="unf-icon"
                    viewBox="0 0 24 24"
                    width="18px"
                    height="18px"
                    fill="#7C8597"
                    // style="display: inline-block; vertical-align: middle;"
                  >
                    <path d="M18.28 14.85a2.89 2.89 0 0 0-2.36 1.21l-6.69-3.53a.38.38 0 0 1-.1 0A2.63 2.63 0 0 0 9.1 11h.09l7-3.2a2.85 2.85 0 0 0 2.12 1 2.95 2.95 0 1 0-3-2.88c.02.203.057.403.11.6L8.57 9.61a.83.83 0 0 0-.18.13 2.95 2.95 0 0 0-5.06 2.12 3 3 0 0 0 3 2.88 2.94 2.94 0 0 0 2.16-1c.028.026.058.05.09.07l6.84 3.61c-.01.13-.01.26 0 .39a3 3 0 0 0 3 2.88 2.949 2.949 0 0 0 2.196-5.09 2.95 2.95 0 0 0-2.196-.8l-.14.05Zm0-10.5a1.45 1.45 0 1 1 0 2.89 1.52 1.52 0 0 1-1.45-1.44 1.46 1.46 0 0 1 1.45-1.45Zm-12 8.89a1.52 1.52 0 0 1-1.45-1.44 1.45 1.45 0 1 1 1.45 1.44Zm12 6a1.52 1.52 0 0 1-1.45-1.44 1.45 1.45 0 1 1 1.45 1.44Z"></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Produk List */}
      <section className="recipes recipes-today">
        <div className="container">
          <h2 className="heading-2">Sesuai incaran kamu di toko ini</h2>
          <ProductList
            product={products.slice(0, visibleProducts)}
            isLoadingProducts={isLoading}
            handleFormWhatsApp={(e, products, varians, quantitys) =>
              handleFormWhatsApp(e, products, varians, quantitys)
            }
          />

          {visibleProducts < products.length && (
            <div className="text-center mt-10">
              <button className="btn btn-primary" style={{ width: '50%' }} onClick={handleLoadMore}>
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
        products={dataProducts}
        varians={dataVarians}
        quantitys={dataQuantitys}
        handlePesananViaWhatsApp={() => setShowTerimaKasih(true)}
      />
      <TerimaKasihModal show={showTerimaKasih} onClose={() => setShowTerimaKasih(false)} />
      <ShareModal show={showShare} onClose={() => setShowShare(false)} link_wa={whatsApp} />
    </Fragment>
  );
}