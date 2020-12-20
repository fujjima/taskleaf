import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { TaskPage } from '../Components/Pages/TasksPage/TaskPage';

// export const TaskContext = createContext();

export const TaskContainer = (props) => {
  const { id } = useParams();
  const url = `http://localhost:3000/api/tasks/${id}`;
  const [task, setTask] = useState({});

  // TODO: 文と式における関数のルールの確認
  useEffect(() => {
    const getData = async () => {
      const result = await getTask();
      // ここでstateが更新されているから、再度レンダリングが走るのでは？
      setTask(...result.task);
    };
    getData();
  }, [task]);

  async function getTask() {
    const options = {
      mode: 'cors',
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    return fetch(url, options)
      .then((response) => {
        // この時点ではサーバがヘッダをレスポンスしている状態
        // 組み込みのresponseオブジェクトにアクセスする形となっている
        if (!response.ok) {
          throw new Error();
        }
        // ここでpromiseを返しているよ
        // ここでは、レスポンスの本文が帰ってくることを期待しているよ
        return response.json();
      })
      .then((data) => {
        if ('errors' in data) {
          return alert('error');
        }
        return data;
      })
      .catch((err) => {
        return err;
      });
  }

  // TODO: URLの共通化についてまじで考える
  const updateTask = (params) => {
    const options = {
      mode: 'cors',
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
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
        setTask(data.task);
      })
      .catch((err) => {
        return err;
      });
  };

  // destroytask

  // ここでtasksとtaskの出し分けを行う？
  // taskscontainerにtaskpageとtaskpageが紐づく感じ
  return (
    <TaskContext.Provider value={{ task, updateTask }}>
      <TaskPage />
    </TaskContext.Provider>
  );
};
