import React, { useState, createContext } from 'react';
import { TaskShowPage } from '../Components/Pages/TasksPage/TaskShowPage';

export const TaskContext = createContext();

// props内にtaskがない場合→URL直叩きのケースかリロード→取得しに行く
const initialState = (props) => {
  if (props.location.state) {
    // TODO: リロード時のprop.locationがundefinedになっていないかを調べる
    return props.location.state.task;
  }
  return null;
};

// getTask
// updateTask
// destroytask

export const TaskShowContainer = (props) => {
  const [task, setTask] = useState(initialState(props));

  // タスクの取得が完了するまではloading画面を出す
  return (
    <TaskContext.Provider value={task}>
      <TaskShowPage />
    </TaskContext.Provider>
  );
};
