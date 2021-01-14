import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  TableCell,
  TableRow,
  Table,
  InputBase,
} from '@material-ui/core';
import { TaskContext } from '../../../../Containers/TasksContainer';
import { DateField } from '../../../Mols/DateField';
import { TimeField } from '../../../Mols/TimeField';
import Task from '../../../../Models/Task';

const useStyles = makeStyles({
  root: {
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
  input: {
    width: '600px',
  },
});

export const TaskPage = (props) => {
  const classes = useStyles();
  const { updateTask } = useContext(TaskContext);

  const taskElements = () => {
    const { task } = props;
    if (!task) return [];
    return [
      { label: 'タスク名', attribute: 'name', value: task.name },
      { label: '詳細', attribute: 'description', value: task.description },
      {
        label: '締め切り日',
        attribute: 'finishedAt',
        value: task.finishedAt,
      },
      {
        label: '経過時間',
        attribute: 'elapsedTime',
        value: task.elapsedTime.format('HH:mm:ss'),
      },
    ];
  };

  const handleBlur = (val) => {
    // TODO: 子コンポーネントからの値はvalに入るが、俺しか分からんので直したい
    // このページ内でレンダリングされているコンポーネントからはeventが取得できる
    const name = event.target.name;
    const value = event.target.value;
    name ? updateTask({ [name]: value }) : updateTask(val);
  };

  const renderField = (item) => {
    if (item.attribute === 'finishedAt') {
      return (
        <DateField pdate={item.value} onClose={handleBlur} margin="none" />
      );
    }
    // if (item.attribute === 'elapsedTime') {
    //   return <TimeField />;
    // }
    return (
      <InputBase
        className={classes.input}
        defaultValue={item.value}
        name={item.attribute}
        inputProps={{ 'aria-label': 'naked' }}
        onBlur={handleBlur}
      />
    );
  };

  // handler

  const TableBody = () => {
    return taskElements().map((item, idx) => (
      <TableRow key={idx}>
        <TableCell
          colSpan={1}
          component="th"
          scope="row"
          className={classes.label}
        >
          {item.label}
        </TableCell>
        <TableCell className={classes.editable}>{renderField(item)}</TableCell>
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

TaskPage.propTypes = {
  task: PropTypes.instanceOf(Task),
};
