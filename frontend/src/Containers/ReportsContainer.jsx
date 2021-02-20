import React, { useState, useEffect, createContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { ReportsPage } from 'Components/Pages/ReportsPage/ReportsPage';

export const ReportsContainer = (props) => {
  const history = useHistory();
  const url = `${API_URL}${props.location.pathname}`;

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await getReports();
      if (result.reports) {
        setReports(result.reports);
      }
    };
    getData();
    // TODO: URLのクエリ部分を見る,期間選択状態ならそのままクエリを追加された状態でいいのでは
    history.push({ pathname: '/reports' });
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

    return fetch(url, options)
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

  const changePeriod = (params) => {
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

    const urlParams = location.search;
    const qs = urlParams || '';

    return fetch(`${url}${qs}`, options)
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
        setReports(data.reports);
      })
      .catch((err) => {
        return err;
      });
  };

  return <ReportsPage reports={reports} changePeriod={changePeriod} />;
};
