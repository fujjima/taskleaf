import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  InputBase,
} from '@material-ui/core';
import Formatter from '../../../Util/Formatter';
import { TaskContext } from '../../../Containers/TasksContainer';

const useStyles = makeStyles({
  root: {
    // width: '100%',
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    overflowX: 'hidden',
  },
  table: {
    margin: '12px',
  },
  label: { width: '20%' },
  editable: {},
});

export const TaskPage = (props) => {
  const classes = useStyles();
  const { task, updateTask } = useContext(TaskContext);

  // mapにすることで、[].map(i => i.item)など、オブジェクトの内部の要素に対してアクセスしようとした際に単純に[]を返すことでエラーを防止する
  const taskElements = [
    { label: 'タスク名', attribute: 'name', value: task.name },
    { label: '詳細', attribute: 'description', value: task.description },
    {
      label: '締め切り日',
      attribute: 'finishedAt',
      value: Formatter.toDate(task.finished_at),
    },
    {
      label: '経過時間',
      attribute: 'elapsedTime',
      value: Formatter.toElapsedTime(task.elapsed_time),
    },
  ];

  // const isEdiable = (item) => {
  //   return editable === item.attribute;
  // };

  const handleBlur = (label) => {
    const value = event.target.value;
    updateTask({ [label]: value });
  };

  // ただし、締め切り日、経過時間に関しては直接入力ではなく、カレンダー表示とする
  // クリックされた要素の属性を見て判定する

  // handler

  const TableBody = () => {
    return taskElements.map((item) => (
      <TableRow key={item.attribute}>
        <TableCell
          colSpan={1}
          component="th"
          scope="row"
          className={classes.label}
        >
          {item.label}
        </TableCell>
        <TableCell className={classes.editable}>
          <InputBase
            className={classes.input}
            defaultValue={item.value}
            inputProps={{ 'aria-label': 'naked' }}
            onBlur={() => handleBlur(item.attribute)}
          />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className={classes.root}>
      <TableContainer className={classes.container}>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="simple table"
        >
          {TableBody()}
        </Table>
      </TableContainer>
    </div>
  );
};

// TODO: contextで受け取れる値についてproptypesを指定できるか
// TaskPage.propTypes = {
//   task: PropTypes.object.isRequired,
// };
