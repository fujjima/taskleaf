import { createSlice } from '@reduxjs/toolkit';

// TODO: ここのstateはuserというkey内に閉じ込めた方がいいのか
const storage = localStorage.getItem('user');
const initialState = storage
  ? JSON.parse(localStorage.getItem('user'))
  : {
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
      // TODO: そもそもlocalStorageを使わなくても良い方法を考える
      localStorage.setItem('user', JSON.stringify(state));
    },
    signout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    },
  },
});

export const { signin, signout } = UserSlice.actions;

export default UserSlice;
