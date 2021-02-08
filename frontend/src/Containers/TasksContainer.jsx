import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import Task from 'Models/Task';
import Tag from 'Models/Tag';
import { TaskPage } from 'Components/Pages/TasksPage/TaskPage/TaskPage';
import { TasksPage } from 'Components/Pages/TasksPage/TasksPage';

export const taskLabel = new Map([
  ['name', 'タスク名'],
  ['tag', 'タグ'],
  ['description', '詳細'],
  ['status', '状態'],
  ['finisihedAt', '締め切り日'],
  ['workingTime', '経過時間'],
]);

export const TaskContext = createContext();

export const TasksContainer = () => {
  const { id } = useParams();
  // TODO:
  // http://localhost:3000 までを取得してそこにapi配下のURLを追加する
  const getUrl = `http://localhost:3000/api/tasks`;
  const [tasks, setTasks] = useState(IList());
  const [usableTags, setUsableTags] = useState(IList());

  useEffect(() => {
    const getData = async () => {
      const result = await getTasks();
      if (result.tasks) {
        setTasks(() => {
          return tasks.push(...result.tasks.map((r) => Task.fromJS(r)));
        });
      }
      if (result.usableTags) {
        setUsableTags((prev) => {
          return prev.push(...result.usableTags.map((r) => Tag.fromJS(r)));
        });
      }
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
        setTasks((prev) => {
          return prev.unshift(Task.fromJS(data.task));
        });
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
        setTasks((prev) => {
          return prev.set(
            prev.findIndex((t) => parseInt(taskId, 10) === t.id),
            Task.fromJS(data.task)
          );
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const deleteTask = (ids) => {
    const paramsIds = _.isArray(ids) ? ids : Array.from(ids);
    const url = `http://localhost:3000/api/tasks`;
    const options = {
      mode: 'cors',
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ id: paramsIds }),
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
        setTasks(tasks.filterNot((t) => paramsIds.includes(t.id)));
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTags = (params) => {
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
        task: params,
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
        setTasks((prev) => {
          const task = prev.find((t) => parseInt(taskId, 10) === t.id);
          const newTask = task.set(
            'tags',
            IList(data.task.tags.map((r) => Tag.fromJS(r)))
          );

          return prev.set(
            prev.findIndex((t) => parseInt(taskId, 10) === t.id),
            newTask
          );
        });
      })
      .catch((err) => {
        return err;
      });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        usableTags,
        taskLabel,
        createTask,
        updateTask,
        deleteTask,
        updateTags,
      }}
    >
      {id ? (
        <TaskPage task={tasks.find((t) => t.id === parseInt(id, 10))} />
      ) : (
          <TasksPage />
        )}
    </TaskContext.Provider>
  );
};
