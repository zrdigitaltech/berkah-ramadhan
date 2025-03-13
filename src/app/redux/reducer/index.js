import { combineReducers } from 'redux';

// Import reducers yang diperlukan
import { productsReducer } from '@/app/redux/reducer/products/reducer';
import { testimoniReducer } from '@/app/redux/reducer/testimoni/reducer';
import { floatingWhatsappReducer } from '@/app/redux/reducer/floatingWhatsapp/reducer';
import { kategorisReducer } from '@/app/redux/reducer/kategoris/reducer';
import { keranjangsReducer } from '@/app/redux/reducer/keranjangs/reducer';

// Combine semua reducers menjadi satu
const rootReducer = combineReducers({
  products: productsReducer,
  testimoni: testimoniReducer,
  floatingWhatsapp: floatingWhatsappReducer,
  kategoris: kategorisReducer,
  keranjangs: keranjangsReducer
});

export default rootReducer;
