import { initialState } from '@/app/redux/action/testimoni/state';
import { actionType } from '@/app/redux/action/testimoni/type';

export const testimoniReducer = (state = initialState, action) => {
  switch (action.type) {
    // Read
    case actionType.loadTestimoni:
      state = {
        ...state,
        testimoniList: action.payload
      };
      return state;
    case actionType.loadTestimoniResetData:
      return initialState;
    default:
      return state;
  }
};

export default testimoniReducer;
