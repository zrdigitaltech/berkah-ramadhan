import { initialState } from '@/app/redux/action/keranjangs/state';
import { actionType } from '@/app/redux/action/keranjangs/type';

export const keranjangsReducer = (state = initialState, action) => {
  switch (action.type) {
    // Read
    case actionType.loadKeranjangs:
      state = {
        ...state,
        keranjangsList: action.payload
      };
      return state;

    case actionType.loadKeranjangsResetData:
      return initialState;

    default:
      return state;
  }
};

export default keranjangsReducer;
