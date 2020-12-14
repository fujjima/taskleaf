import React, { useState, createContext } from 'react';
import { TaskPage } from '../Components/Pages/TasksPage/TaskPage';

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
// destroytask

export const TaskContainer = (props) => {
  const [task, setTask] = useState(initialState(props));

  // idはURLから取得でも良い気はする
  // 対象タスクの属性と新しいvalueのkvsのセットを送ればいいだけ
  const updateTask = (params) => {
    const url = 'http://localhost:3000/api/tasks/239';
    const options = {
      mode: 'cors',
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      // ここで{ 変更対象のカラム: 変更内容 }の形式にする
      body: JSON.stringify({
        id: task.id,
        task: { ...params },
      }),
    };

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        if ('errors' in data) {
          return alert('error');
        }
        // taskにセット
        console.log(data);
      })
      .catch((err) => {
        return err;
      });
  };

  // タスクの取得が完了するまではloading画面を出す
  return (
    <TaskContext.Provider value={{ task, updateTask }}>
      <TaskPage />
    </TaskContext.Provider>
  );
};
