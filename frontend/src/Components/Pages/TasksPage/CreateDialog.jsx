import React, { useState, useContext } from 'react';
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
import { TaskContext } from '../../../Containers/TasksContainer';
import Task from '../../../Models/Task';
import { DateField } from '../../Mols/DateField';

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

export const CreateDialog = (props) => {
  const { createTask } = useContext(TaskContext);
  const classes = useStyles();
  const [item, setItem] = useState(new Task());

  const handleChange = (e) => {
    setItem(item.set(e.target.name, e.target.value));
  };

  const handleDateChange = (value) => {
    if (!value) return;

    // value = { finishedAt: dayjs }の想定
    setItem(item.merge(value));
  };

  const handleSubmit = (e) => {
    props.onSubmit(e, item);
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
            value={item.name}
            {...(!item.name
              ? { error: true, helperText: 'タスク名を入力してください' }
              : { error: false })}
            onChange={(e) => handleChange(e)}
          />
          <TextField
            name="description"
            label="詳細"
            placeholder="タスクに関する詳細"
            margin="normal"
            rows={3}
            multiline
            value={item.description}
            variant="outlined"
            onChange={(e) => handleChange(e)}
          />
          <DateField
            pdate={item.finishedAt}
            className={classes.input}
            name={item.finishedAt}
            onClose={handleDateChange}
            label="締め切り日"
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          {/* 時間入力形式を考える */}
          {/* 完全に手動（経過時間）を入力させるか、start〜endを入力させるか */}
          {/* 手動の場合、○時間○分○秒を入力させる*/}
          <TextField
            name="elapsedTime"
            label="経過時間"
            margin="normal"
            variant="outlined"
            value={item.elapsedTime}
            defaultValue={0}
            onChange={(e) => handleChange(e)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            className={classes.subscribeButton}
            onClick={props.onClose}
            size="large"
          >
            キャンセル
          </Button>
          <Button
            color="primary"
            className={classes.subscribeButton}
            type="submit"
            size="large"
            disabled={!item.name}
          >
            作成
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

CreateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
