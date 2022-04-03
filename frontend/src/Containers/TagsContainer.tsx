import React, { useState, useEffect, createContext } from 'react';
import { useLocation } from 'react-router-dom';

import { TagsPage } from 'Components/Pages/TagsPage/TagsPage';
import { Tag }  from 'Models/Tag';
import { FETCH_GET_OPTIONS, FETCH_POST_OPTIONS, FETCH_PATCH_OPTIONS, FETCH_DELETE_OPTIONS }  from 'Types/FetchOption';

// 
export const TagContext = createContext({});

export const TagsContainer = () => {
  const location = useLocation();
  const url = `${API_URL}${location.pathname}`;
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const getData = async () => {
      const result = await getTags();
      if (result.tags) {
        setTags(prev => [...prev, ...result.tags.map(r => new Tag(r))]);
      }
    };
    getData();
  }, []);

  function getTags() {
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

  const createTag = (params) => {
    const options = {
      ...FETCH_POST_OPTIONS,
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
          return [new Tag(data.tag), ...prev]
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const updateTag = (params) => {
    const tagId = params.id;
    const targetUrl = `${url}/${tagId}`;
    const options = {
      ...FETCH_PATCH_OPTIONS,
      body: JSON.stringify({
        tag: params,
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
        setTags((prev) => {
          return [...prev, new Tag(data.tag)]
        });
      })
      .catch((err) => {
        return err;
      });
  };

  const deleteTag = (id) => {
    const targetUrl = `${url}/${id}`;

    fetch(targetUrl, FETCH_DELETE_OPTIONS)
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
        setTags(tags.filter((t) => t.id !== id));
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
