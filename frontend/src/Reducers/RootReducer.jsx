import { combineReducers } from '@reduxjs/toolkit';
import UserSlice from '../Slices/UserSlice';

const rootReducer = combineReducers({
  user: UserSlice.reducer,
});

export default rootReducer;
