import { actionType } from '@/app/redux/action/products/type';

// Data Json
import DataProducts from './data-products.json';

// Function to generate a unique ID
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Read
export const getListProducts = () => {
  const productsWithIds = DataProducts.map((product, productIndex) => {
    // Add ID to the product
    product.id = generateUniqueId();

    // Add IDs to variants
    product.varian = product.varian.map((variant, variantIndex) => ({
      ...variant,
      id: generateUniqueId()
    }));

    return product;
  });
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
    const limitedProducts = shuffledProducts.slice(0, 10);

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
