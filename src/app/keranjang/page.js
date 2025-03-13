'use client';
import React, { useState, useEffect, Fragment, useMemo } from 'react';
import './keranjang.scss';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import {
  getListKeranjangs,
  removeFromCart,
  updateCartQuantity,
  removeSelectedItemsFromCart,
  restoreToCart
} from '@/app/redux/action/keranjangs/creator';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// modals
import FormWhatsAppModal from '@/app/modals/formWhatsApp';
import TerimaKasihModal from '@/app/modals/terimaKasih';
import PembatasanPesananModal from '@/app/modals/pembatasanPesanan';
import KonfirProdukModal from '@/app/modals/konfirmProduk';
import KonfirmSemuaProdukModal from '@/app/modals/konfirmSemuaProduk';

import { formatPhoneNumber, groupDataByLinkWa } from '@/app/helper/utils';

const KeranjangPage = () => {
  const keranjangsLists = useSelector((state) => state?.keranjangs?.keranjangsList || []);
  const keranjangsList = groupDataByLinkWa(keranjangsLists);
  const dispatch = useDispatch();
  const domain = process.env.NEXT_PUBLIC_DOMAIN; // Access the environment variables

  // State untuk pilih semua checkbox
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showFormWhatsApp, setShowFormWhatsApp] = useState(false);
  const [showTerimaKasih, setShowTerimaKasih] = useState(false);
  const [showPembatasanPesanan, setShowPembatasanPesanan] = useState(false);
  const [showHapusProduk, setShowHapusProduk] = useState(false);
  const [showMengembaliProduk, setShowMengembaliProduk] = useState(false);
  const [showKonfirmSemuaProduk, setShowKonfirmSemuaProduk] = useState(false);
  const [deletedItem, setDeletedItem] = useState(null);

  // Handle "Pilih Semua"
  const toggleSelectAll = () => {
    if (
      selectedItems.length === keranjangsList.reduce((acc, group) => acc + group.product.length, 0)
    ) {
      setSelectedItems([]); // Hapus semua pilihan
    } else {
      const allProducts = keranjangsList.flatMap((group) => group.product); // Ambil semua produk dari semua grup
      setSelectedItems(allProducts); // Pilih semua produk
    }
  };

  // Setiap checkbox "Kontak WA" harus dicentang jika semua produk dalam grupnya telah dipilih.
  const isGroupSelected = (group) => {
    return group.product.every((item) => selectedItems.some((selected) => selected.id === item.id));
  };

  const toggleSelectGroup = (group) => {
    setSelectedItems((prev) => {
      const allSelected = isGroupSelected(group);

      if (allSelected) {
        // Hapus semua produk dalam grup dari selectedItems
        return prev.filter((item) => !group.product.some((prod) => prod.id === item.id));
      } else {
        // Tambahkan semua produk yang belum dipilih
        const newItems = group.product.filter(
          (item) => !prev.some((selected) => selected.id === item.id)
        );
        return [...prev, ...newItems];
      }
    });
  };

  // Handle perubahan checkbox per item
  const toggleSelectItem = (produk) => {
    setSelectedItems((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === produk.id);

      if (isAlreadySelected) {
        return prev.filter((item) => item.id !== produk.id); // Hapus item jika sudah dipilih
      } else {
        return [...prev, produk]; // Tambahkan item jika belum dipilih
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

  const handleDeleteItem = async (id, variantId) => {
    const itemToDelete = keranjangsList
      .flatMap((group) => group.product)
      .find((item) => item.id === id && item.variant?.id === variantId);

    if (itemToDelete) {
      setDeletedItem(itemToDelete); // Simpan item sebelum dihapus
      dispatch(removeFromCart(id, variantId));
      setShowHapusProduk(true);
    }
  };
  const handleBatalDeleteItem = async () => {
    if (deletedItem) {
      dispatch(restoreToCart(deletedItem));
      setDeletedItem(null); // Kosongkan item yang dihapus setelah dipulihkan
      setShowHapusProduk(false);
      setShowMengembaliProduk(true);
    }
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
    setShowKonfirmSemuaProduk(true);
  };
  const handleOkRemoveSelectedItems = () => {
    if (selectedItems.length === 0) return;

    // Ambil hanya ID yang akan dihapus
    const selectedIds = selectedItems.map((item) => item.id);

    // Dispatch penghapusan berdasarkan ID
    dispatch(removeSelectedItemsFromCart(selectedIds));

    // Perbarui selectedItems agar tetap sinkron dengan Redux state
    setSelectedItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setShowKonfirmSemuaProduk(false);
  };

  const handleLanjutForm = async () => {
    const uniqueNumbers = new Set(selectedItems?.map((item) => item.link_wa));

    if (uniqueNumbers.size > 1) {
      setShowPembatasanPesanan(true);
      return;
    }
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
                Keranjang <span className="amount">({keranjangsLists?.length})</span>
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
                          checked={
                            selectedItems.length ===
                            keranjangsList.reduce((acc, group) => acc + group.product.length, 0)
                          }
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
                  keranjangsList?.map((items, index) => (
                    <Fragment key={index || items?.id}>
                      <div className="keranjang-item">
                        <div className="d-flex align-items-center mb-3">
                          <input
                            type="checkbox"
                            className="checkbox-custom"
                            checked={isGroupSelected(items)}
                            onChange={() => toggleSelectGroup(items)}
                          />
                          <div>
                            <b>No WA: {formatPhoneNumber(items?.link_wa)}</b>
                          </div>
                        </div>
                        {items?.product
                          ?.filter((item) => !item.deleted)
                          ?.map((item, idx) => (
                            <div key={idx || item?.id} className="keranjang-item-body mb-4">
                              <div>
                                <input
                                  type="checkbox"
                                  checked={selectedItems.some(
                                    (selected) => selected.id === item.id
                                  )}
                                  onChange={() => toggleSelectItem(item)}
                                  className="checkbox-custom"
                                />
                              </div>
                              <img
                                src={
                                  item?.images?.startsWith('/assets/images/')
                                    ? domain + item.images
                                    : item?.images || 'https://placehold.co/1024x1024'
                                }
                                alt={item.name}
                                className="item-image"
                              />
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
                                  <div style={{ color: '#a0a0a0' }}>
                                    {item.variant?.jumlah} {item.variant?.nama_berat}
                                  </div>
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
                                        handleQuantityChange(
                                          item.id,
                                          item?.variant?.id,
                                          item.quantity - 1
                                        )
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
                                        handleQuantityChange(
                                          item.id,
                                          item?.variant?.id,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </Fragment>
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
      <PembatasanPesananModal
        show={showPembatasanPesanan}
        onClose={() => setShowPembatasanPesanan(false)}
      />
      <KonfirProdukModal
        show={showHapusProduk}
        message={`1 produk telah dihapus.`}
        handleBtn={handleBatalDeleteItem}
        btnTitle="Batal"
        onClose={() => setShowHapusProduk(false)}
      />
      <KonfirProdukModal
        show={showMengembaliProduk}
        message={`Berhasil mengembalikan 1 barang`}
        handleBtn={() => setShowMengembaliProduk(false)}
        btnTitle="Ok"
        onClose={() => setShowMengembaliProduk(false)}
      />
      <KonfirmSemuaProdukModal
        selectItem={selectedItems?.length}
        show={showKonfirmSemuaProduk}
        onClose={() => setShowKonfirmSemuaProduk(false)}
        handleOk={handleOkRemoveSelectedItems}
      />
    </Fragment>
  );
};

export default KeranjangPage;
