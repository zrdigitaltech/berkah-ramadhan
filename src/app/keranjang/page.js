'use client';
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import './keranjang.scss';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import {
  getListKeranjangs,
  removeFromCart,
  updateCartQuantity,
  removeSelectedItemsFromCart
} from '@/app/redux/action/keranjangs/creator';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// modals
import FormWhatsAppModal from '@/app/modals/formWhatsApp';
import TerimaKasihModal from '@/app/modals/terimaKasih';

const KeranjangPage = () => {
  const keranjangsList = useSelector((state) => state?.keranjangs?.keranjangsList || []);
  const dispatch = useDispatch();

  // State untuk pilih semua checkbox
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showFormWhatsApp, setShowFormWhatsApp] = useState(false);
  const [showTerimaKasih, setShowTerimaKasih] = useState(false);

  // Handle "Pilih Semua"
  const toggleSelectAll = () => {
    if (selectedItems.length === keranjangsList.length) {
      setSelectedItems([]); // Hapus semua pilihan
    } else {
      setSelectedItems(keranjangsList); // Pilih semua dengan menyimpan seluruh objek produk
    }
  };

  // Handle perubahan checkbox per item
  const toggleSelectItem = (produk) => {
    setSelectedItems((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === produk.id);
      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== produk.id); // Hapus jika sudah ada
      } else {
        return [...prev, produk]; // Tambahkan jika belum ada
      }
    });
  };

  const fetchKeranjangList = async () => {
    setIsLoading(true);
    try {
      await dispatch(getListKeranjangs()); // Pastikan ini benar-benar async
    } catch (error) {
      console.error('Error fetching keranjang:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = (id, variantId) => {
    dispatch(removeFromCart(id, variantId));

    // Hapus item berdasarkan id
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, variantId, newQuantity) => {
    if (newQuantity < 1) return; // Pastikan quantity tidak kurang dari 1

    dispatch(updateCartQuantity(id, variantId, newQuantity));

    // Perbarui jumlah item yang dipilih
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Fungsi untuk menghapus item yang dipilih
  const handleRemoveSelectedItems = () => {
    if (selectedItems.length === 0) return;

    // Ambil hanya ID yang akan dihapus
    const selectedIds = selectedItems.map((item) => item.id);

    // Dispatch penghapusan berdasarkan ID
    dispatch(removeSelectedItemsFromCart(selectedIds));

    // Perbarui selectedItems agar tetap sinkron dengan Redux state
    setSelectedItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
  };

  const handleLanjutForm = async () => {
    setShowFormWhatsApp(true);
  };

  useEffect(() => {
    fetchKeranjangList();
  }, []);

  // **Filter hanya item yang dipilih**
  const selectedKeranjangs = useMemo(() => {
    return selectedItems; // Tidak perlu filter lagi, karena sudah menyimpan seluruh objek
  }, [selectedItems]);

  // **Perhitungan total harga berdasarkan item yang dipilih**
  const totalHarga = useMemo(() => {
    return selectedKeranjangs.reduce(
      (acc, item) => acc + (item.variant?.harga || 0) * (item.quantity || 1),
      0
    );
  }, [selectedKeranjangs]);

  // **Perhitungan hemat (harga normal - harga diskon) berdasarkan item yang dipilih**
  const totalHemat = useMemo(() => {
    return selectedKeranjangs.reduce(
      (acc, item) =>
        acc +
        ((item.variant?.harga_normal || 0) - (item.variant?.harga || 0)) * (item.quantity || 1),
      0
    );
  }, [selectedKeranjangs]);

  return (
    <Fragment>
      <section className="keranjang">
        <div className="container">
          {isLoading ? (
            <div className="mb-4">
              <Skeleton height={30} />
            </div>
          ) : (
            keranjangsList &&
            keranjangsList?.length > 0 && (
              <h2 className="heading-2">
                Keranjang <span className="amount">({keranjangsList?.length})</span>
              </h2>
            )
          )}

          <div className="keranjang-wrapper">
            <Fragment>
              {/* Daftar Produk */}
              <div className="keranjang-items">
                {/* Pilih Semua & Hapus */}
                {isLoading ? (
                  <div>
                    <Skeleton height={30} />
                  </div>
                ) : (
                  keranjangsList?.length > 0 && (
                    <div className="d-flex justify-content-between align-items-center keranjang-items-semua">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={selectedItems?.length === keranjangsList?.length}
                          onChange={toggleSelectAll}
                          className="checkbox-custom"
                        />{' '}
                        <b>Pilih Semua</b>
                      </label>
                      {selectedItems?.length > 0 && (
                        <span className="remove-selected-btn" onClick={handleRemoveSelectedItems}>
                          Hapus
                        </span>
                      )}
                    </div>
                  )
                )}
                {isLoading ? (
                  Array(2)
                    .fill()
                    .map((_, idx) => (
                      <div key={idx}>
                        <Skeleton height={100} />
                      </div>
                    ))
                ) : keranjangsList && keranjangsList?.length > 0 ? (
                  keranjangsList?.map((item, idx) => (
                    <div className="keranjang-item" key={idx || item.id}>
                      <div>
                        <input
                          type="checkbox"
                          // checked={selectedItems.includes(item.id)}
                          checked={selectedItems.some((selected) => selected.id === item.id)}
                          onChange={() => toggleSelectItem(item)}
                          className="checkbox-custom"
                        />
                      </div>
                      <img src={item.images} alt={item.name} className="item-image" />
                      <div className="w-100 h-100 text-truncate">
                        <div className="item-info text-truncate">
                          <div className="text-truncate">
                            <h4 className="item-name text-truncate" title={item.name}>
                              {item.name}
                            </h4>
                          </div>
                          <div>
                            <p className="item-price mb-0">
                              Rp{' '}
                              {item.variant?.harga
                                ? item.variant.harga.toLocaleString('id-ID')
                                : '0'}
                            </p>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between ml-4">
                          <div style={{ color: '#a0a0a0' }}>{item.variant?.nama_berat}</div>
                          <div>
                            <small className="item-price-normal">
                              Rp{' '}
                              {item.variant?.harga_normal
                                ? item.variant.harga_normal.toLocaleString('id-ID')
                                : '0'}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end align-items-center">
                          <div className="mr-4 d-flex align-items-center">
                            <svg
                              className="nest-icon "
                              width="26"
                              height="26"
                              fill="currentColor"
                              viewBox="0 0 26 26"
                              data-testid="cartBtnDelete"
                              onClick={() => handleDeleteItem(item?.id, item?.variant?.id)}
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M20 5.25h-5.24a.7.7 0 0 0 .05-.25 2.76 2.76 0 0 0-5.52 0 .7.7 0 0 0 .05.25H4a.75.75 0 0 0 0 1.5h1.25V20A1.76 1.76 0 0 0 7 21.75h10A1.76 1.76 0 0 0 18.75 20V6.75H20a.75.75 0 1 0 0-1.5ZM10.79 5a1.26 1.26 0 1 1 2.52 0 .996.996 0 0 0 0 .25h-2.57a.7.7 0 0 0 .05-.25Zm6.46 15a.25.25 0 0 1-.25.25H7a.25.25 0 0 1-.25-.25V6.75h10.5V20ZM10 17.74a.75.75 0 0 0 .75-.75V10.1a.75.75 0 1 0-1.5 0V17a.74.74 0 0 0 .75.74Zm4.349-.054a.74.74 0 0 1-.289.054.75.75 0 0 1-.75-.74v-6.9a.75.75 0 1 1 1.5 0v6.89a.741.741 0 0 1-.461.696Z"
                              ></path>
                            </svg>
                          </div>

                          <div className="quantity-container m-0">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(item.id, item?.variant?.id, item.quantity - 1)
                              }
                            >
                              −
                            </button>
                            <input
                              className="quantity-input"
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  item?.variant?.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                handleQuantityChange(item.id, item?.variant?.id, item.quantity + 1)
                              }
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-cart">
                    <p className="empty-cart-message">Oops! Keranjangmu masih kosong.</p>
                    <Link href="/" className="shop-now-button" onClick={() => setIsCartOpen(false)}>
                      Mulai Belanja
                    </Link>
                  </div>
                )}
              </div>

              {/* Ringkasan Pembelian */}
              {isLoading ? (
                <div className="cart-summary" style={{ padding: 0 }}>
                  <Skeleton height={140} />
                </div>
              ) : (
                <div className="cart-summary">
                  <h3>Ringkasan Pembelian</h3>
                  <p className="d-flex justify-content-between">
                    <b>Total</b>
                    <strong className="text-primary">
                      Rp {totalHarga.toLocaleString('id-ID')}
                    </strong>
                  </p>
                  <p className="d-flex justify-content-between">
                    <b>Hemat</b>
                    <strong className="harga-normal">
                      Rp {totalHemat.toLocaleString('id-ID')}
                    </strong>
                  </p>

                  <button
                    className="btn btn-primary"
                    disabled={totalHarga === 0}
                    onClick={handleLanjutForm}
                  >
                    Lanjut ke Form Pesanan{' '}
                    {selectedItems?.length > 0 && '(' + selectedItems?.length + ')'}
                  </button>
                </div>
              )}
            </Fragment>
          </div>
        </div>
      </section>
      {/* Modals */}
      <FormWhatsAppModal
        show={showFormWhatsApp}
        onClose={() => setShowFormWhatsApp(false)}
        products={selectedItems}
        handlePesananViaWhatsApp={() => {
          setShowTerimaKasih(true);
          setSelectedItems([]);
        }}
      />
      <TerimaKasihModal show={showTerimaKasih} onClose={() => setShowTerimaKasih(false)} />
    </Fragment>
  );
};

export default KeranjangPage;
