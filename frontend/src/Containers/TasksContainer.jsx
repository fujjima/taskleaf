import React, { useState, useEffect, createContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Task } from 'Models/Task';
import { Tag } from 'Models/Tag';
import { TaskPage } from 'Components/Pages/TasksPage/TaskPage/TaskPage';
import { TasksPage } from 'Components/Pages/TasksPage/TasksPage';
import { FETCH_GET_OPTIONS, FETCH_POST_OPTIONS, FETCH_PATCH_OPTIONS, FETCH_DELETE_OPTIONS } from 'Types/FetchOption';

export const taskLabel = new Map([
  ['name', 'タスク名'],
  ['tag', 'タグ'],
  ['description', '詳細'],
  ['status', '状態'],
  ['finisihedAt', '締め切り日'],
  ['workingTime', '作業時間'],
]);

export const TaskContext = createContext();

export const TasksContainer = () => {
  const { id } = useParams();
  const location = useLocation();
  const url = `${API_URL}${location.pathname}`;

  const [tasks, setTasks] = useState([]);
  const [usableTags, setUsableTags] = useState([]);

  useEffect(() => {
    const getData = async () => {
      // TODO: 詳細画面をモーダルに移行した際は、url取得等はしなくても問題なさそう？？
      const result = await getTasks();
      if (!id) {
        setTasks((prev) => {
          return [...prev, ...result?.tasks?.map((r) => new Task(r))];
        });
      } else {
        setTasks(prev => {
          return [...prev, new Task(result.task)]
        });
      }

      if (result.usableTags) {
        setUsableTags((prev) => {
          return [prev, ...result.usableTags.map((r) => new Tag(r))]
        });
      }
    };
    getData();
  }, []);

  function getTasks() {
    return fetch(url, FETCH_GET_OPTIONS)
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
    const options = {
      ...FETCH_POST_OPTIONS,
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
          return prev.unshift(new Task(data.task));
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTask = (params) => {
    const taskId = id || params.id;
    const url = `${url}/${taskId}`;
    const options = {
      ...FETCH_PATCH_OPTIONS,
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
            new Task(data.task)
          );
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const deleteTask = (ids) => {
    const paramsIds = _.isArray(ids) ? ids : Array.from(ids);
    const options = {
      ...FETCH_DELETE_OPTIONS,
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
    const url = `${url}/${taskId}`;
    const options = {
      ...FETCH_PATCH_OPTIONS,
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
            IList(data.task.tags.map((r) => new Tag(r)))
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
        <TaskPage task={tasks.find(t => t.id === parseInt(id, 10))} />
      ) : (
        <TasksPage />
      )}
    </TaskContext.Provider>
  );
};
