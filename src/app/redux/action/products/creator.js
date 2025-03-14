import { actionType } from '@/app/redux/action/products/type';

// Data Json
import DataProducts from './data-products.json';

// Function to generate a unique ID
import { generateUniqueId } from '@/app/helper/utils';

// Function to retrieve products from localStorage or generate new ones
const getStoredProducts = () => {
  const storedProducts = localStorage.getItem('products');
  return storedProducts ? JSON.parse(storedProducts) : null;
};

// Function to save products to localStorage
const saveProductsToLocalStorage = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const getListProducts = () => {
  let productsWithIds = getStoredProducts();

  // If there are no stored products, generate new ones
  if (!productsWithIds) {
    productsWithIds = DataProducts.map((product, idx) => {
      // Check if the product already has an ID

      product.id = idx + 1; // Add ID to the product

      // Add IDs to variants if not already present
      product.varian = product.varian.map((variant, idxs) => ({
        ...variant,
        id: idxs + 1
      }));

      return product;
    });

    // Save the products with IDs to localStorage
    saveProductsToLocalStorage(productsWithIds);
  }

  // Sort products: first available stock, then out of stock
  const sortedProducts = productsWithIds?.sort((a, b) => {
    const aInStock = a.varian?.some((v) => v.stok > 0); // Check if any variant has stock
    const bInStock = b.varian?.some((v) => v.stok > 0);

    if (aInStock && !bInStock) return -1; // a comes before b
    if (!aInStock && bInStock) return 1; // b comes before a
    return 0; // No change if both have same stock status
  });

  return (dispatch) => {
    return dispatch(saveListProducts(sortedProducts));
  };
};

export const getTerlarisProducts = () => {
  return (dispatch) => {
    // Make a copy of the DataProducts array
    const shuffledProducts = [...DataProducts].sort(() => Math.random() - 0.5);

    // Limit the result to 10 products
    const limitedProducts = shuffledProducts?.slice(0, 10);

    // Dispatch the action with the limited products
    return dispatch(saveTerlarisProducts(limitedProducts));
  };
};

// Read
export const saveListProducts = (payload) => {
  return {
    type: actionType.loadProducts,
    payload: payload
  };
};

// Read
export const saveTerlarisProducts = (payload) => {
  return {
    type: actionType.loadProductsTerlaris,
    payload: payload
  };
};
