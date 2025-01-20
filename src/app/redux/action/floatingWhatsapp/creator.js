import { actionType } from '@/app/redux/action/floatingWhatsapp/type';

// Data Json
import DataFloatingWhatsapp from './data-floating-whatsapp.json';

// Read
export const getListFloatingWhatsapp = () => {
  return (dispatch) => {
    return dispatch(saveListFloatingWhatsapp(DataFloatingWhatsapp[0]));
  };
};

// Read
export const saveListFloatingWhatsapp = (payload) => {
  return {
    type: actionType.loadFloatingWhatsapp,
    payload: payload
  };
};
