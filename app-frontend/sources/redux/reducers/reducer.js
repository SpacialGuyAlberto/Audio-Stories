// Importar los reducers individuales
import audiobooksReducer from './audiobooks';
import categoriesReducer from './categories';
import authReducer from './auth';
import storyReducer from './story';

// ... Otros reducers si existen ...

// Combinar los reducers en un reducer raíz
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  audiobooks: audiobooksReducer,
  auth: authReducer,
  categories: categoriesReducer,
  story: storyReducer,
});

export default rootReducer;
