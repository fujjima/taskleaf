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
  // http://localhost:3000 までを取得してそこにapi配下のURLを追加する
  const getUrl = `http://localhost:3000/api/tasks`;
  const [tasks, setTasks] = useState(IList());

  useEffect(() => {
    const getData = async () => {
      const result = await getTasks();
      setTasks(() => {
        return tasks.push(...result.map((r) => Task.fromJS(r)));
      });
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
        task: { ...params.toJS() },
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
        setTasks(tasks.unshift(Task.fromJS(data.task)));
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

  const deleteTask = (id) => {
    const url = `http://localhost:3000/api/tasks/${id}`;
    const options = {
      mode: 'cors',
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
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
        setTasks(tasks.filterNot((t) => t.id === id));
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <TaskContext.Provider
      value={{ tasks, taskLabel, createTask, updateTask, deleteTask }}
    >
      {id ? (
        <TaskPage task={tasks.find((t) => t.id === parseInt(id, 10))} />
      ) : (
          <TasksPage />
        )}
    </TaskContext.Provider>
  );
};
