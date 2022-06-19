import React, { useState, useEffect, createContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Task, TaskTypes } from 'Models/Task';
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
  ['workingTime', '経過時間'],
]);

// 
export const TaskContext = createContext(null);

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


  // TODO: 特定のクラスのインスタンスであることを確認しておく
  const createTask = (params: Partial<TaskTypes>) => {
    // TODO: インスタンスチェック機構をどこで行うかについて
    if(params instanceof Task){
      console.log('通ってほしい')
    }
    // TODO: タスクのorder, list情報も併せて送信したい
    const options = {
      ...FETCH_POST_OPTIONS,
      body: JSON.stringify({
        task: { ...params },
        // task: { ...params.toJS() },
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
        setTasks((prev): Task[] => {
          return [new Task(data.task), ...prev]
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTask = (params) => {
    const taskId = id || params.id;
    // 一覧、詳細ページの2画面で使用されるケースがあるため、URLを動的に生成している
    // TODO: 上記のように、動的にURLを発行しているケースが多くなってきたら定数化する
    const targetUrl = `${API_URL}/tasks/${taskId}`;
    const options = {
      ...FETCH_PATCH_OPTIONS,
      body: JSON.stringify({
        task: { ...params },
      }),
    };

    fetch(targetUrl, options)
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
        let newTask = new Task(data.task)
        setTasks((prev) => {
          let otherTasks = prev.filter(task => newTask.id !== task.id)
          return [...otherTasks, newTask]
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const deleteTask = (ids: number[]) => {
    const paramsIds = Array.isArray(ids) ? ids : Array.from(ids);
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
        setTasks(tasks.filter((t) => !paramsIds.includes(t.id)));
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTags = (params) => {
    const taskId = id || params.id;
    const targetUrl = `${url}/${taskId}`;
    const options = {
      ...FETCH_PATCH_OPTIONS,
      body: JSON.stringify({
        task: params,
      }),
    };

    fetch(targetUrl, options)
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
          const newTask = {...task, ...{ tags: data.task.tags.map((r) => new Tag(r)) }}

          return [...prev, new Task(newTask)]
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTasksOrder = (params) => {
    const test = params.map((task, idx) => {
      return {
        'taskId': task.id,
        'position': idx + 1
      }
    })

    // TODO: リストのidも受け取れるようにしたい
    const options = {
      ...FETCH_PATCH_OPTIONS,
      body: JSON.stringify({ 'order_params': test }),
    };

    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((data) => {
        if ('errors' in data) {
          // TODO: 万が一バック側からエラーが返された場合はタスク取得をリトライする
          return alert('error');
        }
      })
      .catch((err) => {
        return err;
      });
  }

  return (
    // tasksの変更を行うsetstate関数を渡す
    <TaskContext.Provider
      value={{
        tasks,
        usableTags,
        taskLabel,
        setTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTags,
        updateTasksOrder,
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
