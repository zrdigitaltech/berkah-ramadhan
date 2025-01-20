import { actionType } from '@/app/redux/action/products/type';

// Data Json
import DataProducts from './data-products.json';

// Read
export const getListProducts = () => {
  return (dispatch) => {
    return dispatch(saveListProducts(DataProducts));
  };
};

// Read
export const saveListProducts = (payload) => {
  return {
    type: actionType.loadProducts,
    payload: payload
  };
};
