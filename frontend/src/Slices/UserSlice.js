import { createSlice } from '@reduxjs/toolkit';

// TODO: ここのstateはuserというkey内に閉じ込めた方がいいのか
const storage = localStorage.getItem('user');
const initialState = storage ? JSON.parse(localStorage.getItem('user')) : {};

// util

const fetchObj = (obj, target = []) => {
  let newObj = {};
  target.forEach((t) => {
    let v = obj[t];
    newObj[t] = v;
  });
  return newObj;
};

const UserSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    signin: (state, { payload }) => {
      const { user } = payload;
      // TODO: 仮にlocalstorageにuserが残っている場合に消しておく必要があるか
      state.isLoggedIn = true;
      const userInfo = fetchObj(user, ['name', 'email']);
      // TODO: そもそもlocalStorageを使わない方法を考えたい
      localStorage.setItem(
        'user',
        JSON.stringify(Object.assign(userInfo, state))
      );
      // TODO: return {}では何故駄目なのか
      return Object.assign(state, userInfo);
    },
    signout: (state) => {
      state.isLoggedIn = false;
      localStorage.removeItem('user');
    },
    // signinとの違いについて
    signup: (state, { payload }) => {
      const { user } = payload;
      state.isLoggedIn = true;
      const userInfo = fetchObj(user, ['name', 'email']);
      localStorage.setItem(
        'user',
        JSON.stringify(Object.assign(userInfo, state))
      );
      // TODO: return {}では何故駄目なのか
      return Object.assign(state, userInfo);
    },
  },
});

export const { signin, signout, signup } = UserSlice.actions;

export default UserSlice;
