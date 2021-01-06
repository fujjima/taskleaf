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
import Formatter from '../../../../Util/Formatter';
import { TaskContext } from '../../../../Containers/TasksContainer';

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
        value: Formatter.toDate(task.finishedAt),
      },
      {
        label: '経過時間',
        attribute: 'elapsedTime',
        value: Formatter.toElapsedTime(task.elapsedTime),
      },
    ];
  };

  const handleBlur = (label) => {
    const value = event.target.value;
    updateTask({ [label]: value });
  };

  // handler

  const TableBody = () => {
    return taskElements().map((item) => (
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

TaskPage.propTypes = {
  task: PropTypes.object.isRequired,
};
