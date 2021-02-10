import React, { useState, useEffect, createContext } from 'react';
import { ReportsPage } from 'Components/Pages/ReportsPage/ReportsPage';

export const ReportsContainer = () => {
  const getUrl = `http://localhost:3000/api/reports`;
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const getData = async () => {
      const result = await getReports();
      if (result.reports) {
        setReports(result.reports);
      }
    };
    getData();
  }, []);

  function getReports() {
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

  return <ReportsPage reports={reports} />;
};
