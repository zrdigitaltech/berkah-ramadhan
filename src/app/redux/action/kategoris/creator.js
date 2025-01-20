import { actionType } from '@/app/redux/action/kategoris/type';

// Data Json
import DataKategoris from './data-kategoris.json';

// Read
export const getListKategoris = () => {
  return (dispatch) => {
    const sortedData = DataKategoris.sort((a, b) => a.name.localeCompare(b.name)); // Sort by name alphabetically
    return dispatch(saveListKategoris(sortedData));
  };
};

// Read
export const saveListKategoris = (payload) => {
  return {
    type: actionType.loadKategoris,
    payload: payload
  };
};
