import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducers/rootReducer';

// configureStore()でreducerを渡すことによりStore内でstateの更新が行えるようになる
const store = configureStore({
  reducer: rootReducer,
});

export default store;
