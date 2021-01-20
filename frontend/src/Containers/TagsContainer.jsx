import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { TagsPage } from 'Components/Pages/TagsPage/TagsPage';
import Tag from 'Models/Tag';

export const TagContext = createContext();

export const TagsContainer = () => {
  // TODO:
  const getUrl = `http://localhost:3000/api/tags`;
  const [tags, setTags] = useState(IList());

  useEffect(() => {
    const getData = async () => {
      const result = await getTags();
      if (result.tags) {
        setTags((prev) => {
          return prev.push(...result.tags.map((r) => Tag.fromJS(r)));
        });
      }
    };
    getData();
  }, []);

  function getTags() {
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

  const createTag = (params) => {
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

  const updateTag = (params) => {
    const tagId = params.id;
    const url = `http://localhost:3000/api/tags/${tagId}`;
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
        tag: params,
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
        setTags((prev) => {
          return prev.set(
            prev.findIndex((t) => parseInt(tagId, 10) === t.id),
            Tag.fromJS(data.tag)
          );
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const deleteTag = (id) => {
    const url = `http://localhost:3000/api/tags/${id}`;
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
        setTags(tags.filterNot((t) => t.id === id));
      })
      .catch((err) => {
        return err;
      });
  };

  // const updateTags = (params) => {
  //   const taskId = id || params.id;
  //   const url = `http://localhost:3000/api/tasks/${taskId}`;
  //   const options = {
  //     mode: 'cors',
  //     method: 'PATCH',
  //     credentials: 'include',
  //     headers: {
  //       'X-Requested-With': 'XMLHttpRequest',
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //     body: JSON.stringify({
  //       task: params,
  //     }),
  //   };

  //   fetch(url, options)
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error();
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       if ('errors' in data) {
  //         return alert('error');
  //       }
  //       setTasks((prev) => {
  //         const task = prev.find((t) => parseInt(taskId, 10) === t.id);
  //         const newTask = task.set(
  //           'tags',
  //           IList(data.task.tags.map((r) => Tag.fromJS(r)))
  //         );

  //         return prev.set(
  //           prev.findIndex((t) => parseInt(taskId, 10) === t.id),
  //           newTask
  //         );
  //       });
  //     })
  //     .catch((err) => {
  //       return err;
  //     });
  // };

  return (
    <TagContext.Provider
      value={{
        tags,
        createTag,
        updateTag,
        deleteTag,
      }}
    >
      <TagsPage />
    </TagContext.Provider>
  );
};
