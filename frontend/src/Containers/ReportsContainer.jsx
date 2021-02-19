import React, { useState, useEffect, createContext } from 'react';
import { useParams } from 'react-router-dom';
import { ReportsPage } from 'Components/Pages/ReportsPage/ReportsPage';

export const ReportsContainer = (props) => {
  const getUrl = `http://localhost:3000/api//reports`;
  // const location = useLocation();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await getReports();
      if (result.reports) {
        setReports(result.reports);
      }
    };
    getData();
  }, []);

  const changePeriod = (params) => {
    // この際に、port部分を3000にしないとエラーになる
    const url = new URL(location);
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

    // TODO: 現在のURLをフルパスで取得するというのはグローバル的に使用したいメソッドだと思われるため、どこかで共通化しておきたい
    // /reports以下だけでもいけるか確認する
    console.log(url.href);
    debugger;
    return fetch(url.href, options)
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
  };

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

  return <ReportsPage reports={reports} changePeriod={changePeriod} />;
};
