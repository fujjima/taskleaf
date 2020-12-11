import React from 'react';
import { BrowseRouter as Router, Route, Redirect } from 'react-router-dom';

// CSS in JSを使用するため、関数型を使ってみる
export const TaskShowPage = (props) => {
  // 関数型におけるconstructorについて
  // reduxを使用している際の各コンポーネント内でのstate管理について
  // taskの変更→非同期でfetchする→メッセージ出す→ローカルのstateが変更される→画面リロードが走る？？？？？
  // 上記のような変更があった際に、画面の再レンダリングを走らせることなくstateの更新が行えるかについて
  return <div>hello</div>;
};

// proptypes
