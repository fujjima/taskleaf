import React, { useState, useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
// import { TaskContext } from 'Containers/TasksContainer';
import { Task, TaskTypes } from 'Models/Task';
import { DateField } from 'Components/Mols/DateField';
// import TimeField from 'Components/Mols/TimeField';
// import Formatter from '../../../Util/Formatter';

const useStyles = makeStyles((theme) => ({
  dialog: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogContent: {
    width: '500px',
    display: 'flex',
    flexDirection: 'column',
  },
}));

// TODO: propsの型定義をしておく
// CreateDialog.propTypes = {
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   onSubmit: PropTypes.func.isRequired,
// };

export const CreateDialog = (props) => {
  const classes = useStyles();
  const timeRef = useRef();
  // TODO: itemの型はTask型で縛る。
  const [task, setTask] = useState(new Task());

  const isEmptyObj = (obj): boolean => Object.keys(obj).length === 0

  const handleChange = (e, params: Partial<TaskTypes> = {}) => {
    // TODO: setStateの際にいちいちインスタンスを生成することの是非について
    if(!isEmptyObj(params)){
      for( const [key, value] of Object.entries(params)){
        setTask(new Task({ ...task, ...{ [key]: value } }));
      }
    }else{
      setTask(new Task({ ...task, ...{ [e.target.name]: e.target.value } }));
    }
  };

  // const handleDateChange = (value) => {
  //   if (!value) return;

  //   // value = { finishedAt: dayjs }
  //   setTask(item.merge(value));
  // };

  const handleSubmit = (e) => {
    // const newTask = item.merge({
    //   workingTime: Formatter.toSecond(timeRef.current.newTaskWorkingTime),
    // });
    props.onSubmit(e, task);
  };

  return (
    <Dialog
      className={classes.dialog}
      open={props.open}
      onClose={props.onClose}
    >
      <DialogTitle>タスク作成</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className={classes.dialogContent}>
          <TextField
            name="name"
            label="タスク名"
            margin="normal"
            size="small"
            variant="outlined"
            required
            // XXX:
            // value値はstateとして管理することをreactが推奨している
            // onchangeにはsetstateする関数を設定する
            // TODO: 入力値をstate管理する
            value={task.name}
            {...(!task.name
              ? { error: true, helperText: 'タスク名を入力してください' }
              : { error: false })}
            onChange={e => handleChange(e)}
          />
          <TextField
            name="description"
            label="詳細"
            placeholder="タスクに関する詳細"
            margin="normal"
            rows={3}
            multiline
            value={task.description}
            variant="outlined"
            onChange={(e) => handleChange(e)}
          />
          <DateField
            name="finishedAt"
            pdate={task.finishedAt}
            // className={classes.input}
            // name={task.finishedAt}
            // 日時フィールドを閉じた際に、変更された日時を受け取りたい
            onClose={handleChange}
            label="締め切り日"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          {/* FIXME: 時間の編集フィールドを修正したらここも直す */}
          {/* <TimeField time={item.workingTime.format('HH:mm:ss')} ref={timeRef} /> */}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            // className={classes.subscribeButton}
            onClick={props.onClose}
            size="large"
          >
            キャンセル
          </Button>
          <Button
            color="primary"
            // className={classes.subscribeButton}
            type="submit"
            size="large"
            disabled={!task.name}
          >
            作成
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
