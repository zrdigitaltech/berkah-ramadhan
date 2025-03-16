import { actionType } from '@/app/redux/action/keranjangs/type';

// Fungsi untuk mengambil data dari localStorage
const getCartFromLocalStorage = () => {
  try {
    const cart = localStorage.getItem('keranjangs');
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart from localStorage:', error);
    return [];
  }
};

// Fungsi untuk menyimpan data ke localStorage
const saveCartToLocalStorage = (cart) => {
  try {
    localStorage.setItem('keranjangs', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Ambil daftar keranjang dari localStorage dan simpan ke Redux
export const getListKeranjangs = () => {
  return (dispatch) => {
    const cart = getCartFromLocalStorage();
    dispatch(saveListKeranjangs(cart));
  };
};

// Simpan daftar keranjang ke Redux
export const saveListKeranjangs = (payload) => {
  saveCartToLocalStorage(payload);
  return {
    type: actionType.loadKeranjangs,
    payload: payload
  };
};

export const resetKeranjangInLocalStorage = () => {
  try {
    // Hapus data keranjang dari localStorage
    localStorage.removeItem('keranjangs');
  } catch (error) {
    console.error('Error resetting cart in localStorage:', error);
  }
};

// Tambah produk ke keranjang
export const addToCart = (product, variant, quantity) => {
  return (dispatch, getState) => {
    const state = getState();
    const cart = state.keranjangs?.keranjangsList ? [...state.keranjangs.keranjangsList] : [];

    // Buat ID unik dengan kombinasi product ID dan variant ID
    const uniqueId = `${product.id}-${variant.id}`;

    // Cari apakah produk dengan ID unik sudah ada
    const existingIndex = cart.findIndex((item) => item.id === uniqueId);

    if (existingIndex !== -1) {
      // Jika sudah ada, update jumlahnya
      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity: cart[existingIndex].quantity + quantity
      };
    } else {
      // Jika tidak ada, tambahkan sebagai item baru
      cart.push({
        ...product,
        id: uniqueId, // Gunakan ID unik
        variant,
        quantity
      });
    }

    dispatch(saveListKeranjangs(cart));
  };
};

// Hapus item dari keranjang
export const removeFromCart = (productId, variantId) => {
  return (dispatch, getState) => {
    let cart = getState().keranjangs.keranjangsList.filter(
      (item) => !(item.id === productId && item.variant.id === variantId)
    );
    dispatch(saveListKeranjangs(cart));
  };
};

// Action untuk mengembalikan item ke cart
export const restoreToCart = (product) => {
  return (dispatch, getState) => {
    let cart = [...getState().keranjangs.keranjangsList, product];
    dispatch(saveListKeranjangs(cart));
  };
};

// Update jumlah item did keranjang
export const updateCartQuantity = (productId, variantId, newQuantity) => {
  return (dispatch, getState) => {
    let cart = [...getState().keranjangs.keranjangsList];

    const itemIndex = cart.findIndex(
      (item) => item.id === productId && item.variant.id === variantId
    );

    if (itemIndex !== -1 && newQuantity > 0) {
      cart[itemIndex] = { ...cart[itemIndex], quantity: newQuantity };
    } else {
      cart = cart.filter((item) => !(item.id === productId && item.variant.id === variantId));
    }

    dispatch(saveListKeranjangs(cart));
  };
};

// Hapus item berdasarkan select
export const removeSelectedItemsFromCart = (selectedItems) => {
  return (dispatch, getState) => {
    const cart = getState().keranjangs.keranjangsList.filter(
      (item) => !selectedItems.includes(item.id)
    );

    dispatch(saveListKeranjangs(cart));
  };
};

// Kosongkan keranjang
export const clearCart = () => {
  return (dispatch) => {
    dispatch(saveListKeranjangs([]));
  };
};
