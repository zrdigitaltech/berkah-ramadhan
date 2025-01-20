import { initialState } from '@/app/redux/action/kategoris/state';
import { actionType } from '@/app/redux/action/kategoris/type';

export const kategorisReducer = (state = initialState, action) => {
  switch (action.type) {
    // Read
    case actionType.loadKategoris:
      state = {
        ...state,
        kategorisList: action.payload
      };
      return state;
    case actionType.loadKategorisResetData:
      return initialState;
    default:
      return state;
  }
};

export default kategorisReducer;
