import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../Reducers/rootReducer';

// configureStore()でreducerを渡すことによりStore内でstateの更新を行えるようにする
const store = configureStore({
  reducer: rootReducer,
});

export default store;
