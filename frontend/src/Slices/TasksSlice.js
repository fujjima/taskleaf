import { createSlice } from '@reduxjs/toolkit';

// tasks内には、tasksliceで管理されているtaskが入ってくる予定
const initialState = { tasks: [] };

const TasksSlice = createSlice({
  name,
  initialState,
  reducers: {
    create: () => {},
    update: () => {},
    destroy: () => {},
  },
});

export const { create, update, destroy } = TasksSlice.actions;

export default TasksSlice;
