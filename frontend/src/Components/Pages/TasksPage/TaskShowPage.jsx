import React, { useContext } from 'react';
import { BrowseRouter as Router, Route, Redirect } from 'react-router-dom';
import { TaskContext } from '../../../Containers/TaskShowContainer';

// CSS in JSを使用するため、関数型を使ってみる
export const TaskShowPage = (props) => {
  const task = useContext(TaskContext);
  // taskの変更→非同期でfetchする→メッセージ出す→ローカルのstateが変更される→画面リロードが走る？？？？？
  // 上記のような変更があった際に、画面の再レンダリングを走らせることなくstateの更新が行えるかについて
  const sayhi = () => {
    console.log(task);
  };

  // handler

  // header

  // table

  return <div>hello</div>;
};

// proptypes
