import { createSlice } from '@reduxjs/toolkit';

// TODO: ここのstateはuserというkey内に閉じ込めた方がいいのか
const initialState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

const UserSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    signin: (state) => {
      state.isLoggedIn = true;
    },
    signout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { signin, signout } = UserSlice.actions;

export default UserSlice;
