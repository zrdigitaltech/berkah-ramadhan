import { actionType } from '@/app/redux/action/testimoni/type';

// Data Json
import DataTestimoni from './data-testimoni.json';

// Read
export const getListTestimoni = () => {
  return (dispatch) => {
    return dispatch(saveListTestimoni(DataTestimoni));
  };
};

// Read
export const saveListTestimoni = (payload) => {
  return {
    type: actionType.loadTestimoni,
    payload: payload
  };
};
