import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { TaskPage } from '../Components/Pages/TasksPage/TaskPage/TaskPage';
import { TasksPage } from '../Components/Pages/TasksPage/TasksPage';
import Task from '../Models/Task';

export const taskLabel = new Map([
  ['name', 'タスク名'],
  ['tag', 'タグ'],
  ['description', '詳細'],
  ['finisihedAt', '締め切り日'],
  ['elapsedTime', '経過時間'],
]);

export const TaskContext = createContext();

export const TasksContainer = () => {
  const { id } = useParams();
  // TODO:
  // http://localhost:3000までを取得して
  // そこにapi配下のURLを追加する
  const getUrl = `http://localhost:3000/api/tasks`;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await getTasks();
      setTasks(result);
    };
    getData();
  }, []);

  function getTasks() {
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

    return fetch(getUrl, options)
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
        return data;
      })
      .catch((err) => {
        return err;
      });
  }

  const createTask = (params) => {
    const url = `http://localhost:3000/api/tasks`;
    const options = {
      mode: 'cors',
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
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
        const newTasks = tasks.filter((t) => {
          return t.id !== parseInt(taskId);
        });
        // TODO: その際、タスク一覧のタスク表示欄が一度閉じないようにしたい
        setTasks([...newTasks, data.task]);
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTask = (params) => {
    const taskId = id || params.id;
    const url = `http://localhost:3000/api/tasks/${taskId}`;
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
        id: taskId,
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
        const newTasks = tasks.filter((t) => {
          return t.id !== parseInt(taskId);
        });
        setTasks([...newTasks, data.task]);
      })
      .catch((err) => {
        return err;
      });
  };

  // destroytask

  return (
    <TaskContext.Provider value={{ tasks, taskLabel, updateTask, createTask }}>
      {id ? (
        <TaskPage task={tasks.find((t) => t.id === parseInt(id, 10))} />
      ) : (
          <TasksPage />
        )}
    </TaskContext.Provider>
  );
};
