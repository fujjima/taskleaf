import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import {
  TableContainer,
  TableCell,
  TableRow,
  Table,
  InputBase,
  Select,
  MenuItem,
} from '@material-ui/core';
import { Task } from 'Models/Task';
import { TaskContext } from 'Containers/TasksContainer';
import { DateField } from 'Components/Mols/DateField';
import TimeField from 'Components/Mols/TimeField';
import { TagChips } from 'Components/Mols/TagChips';
import Formatter from 'Util/Formatter';

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
  statusMenu: {
    '& .MuiOutlinedInput-input': {
      paddingBottom: '7px',
      paddingTop: '7px',
    },
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
  const timeRef = useRef();
  const { updateTask, usableTags, updateTags } = useContext(TaskContext);

  // utils

  const taskElements = () => {
    const { task } = props;
    if (!task) return [];
    return [
      { label: 'タスク名', attribute: 'name', value: task.name },
      { label: 'タグ', attribute: 'tags', value: task.tags },
      { label: '詳細', attribute: 'description', value: task.description },
      { label: '状態', attribute: 'status', value: task.status },
      {
        label: '締め切り日',
        attribute: 'finishedAt',
        value: task.finishedAt,
      },
      {
        label: '経過時間',
        attribute: 'workingTime',
        value: Formatter.fromSecondToHour(task.workingTime),
      },
    ];
  };

  // handler

  const handleBlur = (val) => {
    // TODO: 子コンポーネントからの値はvalに入るが、俺しか分からんので直したい
    // このページ内でレンダリングされているコンポーネントからはeventが取得できる
    // TODO: タスク更新ができるようにする
    // タスク更新時、tasksのsetし直しが必要では？？
    const name = event.target.name;
    const value = event.target.value;
    name ? updateTask({ [name]: value }) : updateTask(val);
  };

  const handleTagChange = (taskId, tags) => {
    updateTags({ id: taskId, tagIds: tags });
  };

  // render

  const renderField = (item) => {
    switch (item.attribute) {
      case 'status':
        return (
          <Select
            id="demo-simple-select-filled"
            value={item.value}
            variant="outlined"
            className={classes.statusMenu}
            onChange={(e) => {
              updateTask({ id: props.task.id, status: e.target.value });
              e.stopPropagation();
            }}
          >
            <MenuItem value="waiting">未着手</MenuItem>
            <MenuItem value="working">作業中</MenuItem>
            <MenuItem value="completed">完了</MenuItem>
            <MenuItem value="pending">保留</MenuItem>
          </Select>
        );
      case 'finishedAt':
        return (
          <DateField pdate={item.value} onClose={handleBlur} margin="none" />
        );
      // FIXME: 経過時間の編集ができるようになったらreadonlyは消す
      case 'workingTime':
        return (
          <TimeField
            time={item.value}
            ref={timeRef}
            InputProps={{
              readOnly: true,
            }}
          />
        );
      case 'tags':
        return (
          <TagChips
            tags={item.value}
            usableTags={usableTags}
            tagChange={handleTagChange}
          />
        );
      default:
        return (
          <InputBase
            className={classes.input}
            defaultValue={item.value}
            name={item.attribute}
            inputProps={{ 'aria-label': 'naked' }}
            onBlur={handleBlur}
          />
        );
    }
  };

  const renderTableBody = () => {
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
          {renderTableBody()}
        </Table>
      </TableContainer>
    </div>
  );
};

TaskPage.propTypes = {
  task: PropTypes.instanceOf(Task),
};
