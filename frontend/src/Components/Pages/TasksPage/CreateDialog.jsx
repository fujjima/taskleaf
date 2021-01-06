import React, { useState, useRef, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Formatter from '../../../Util/Formatter';
import { TaskContext } from '../../../Containers/TasksContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
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

// const useInput = (initialValue = {}) => {
//   const [value, setValue] = useState(_.head(_.values(initialValue)));
//   return {
//     value,
//     name: _.head(_.keys(initialValue)),
//     onChange: (e) => {
//       setValue(e.target.value);
//     },
//   };
// };

export const CreateDialog = (props) => {
  const { createTask } = useContext(TaskContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState(new Map());

  const handleChange = () => { };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => { };

  return (
    <Dialog className={classes.dialog} open={props.open} onClose={handleClose}>
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
          // {...nameInput}
          // {...(!nameInput.value
          //   ? { error: true, helperText: 'タスク名を入力してください' }
          //   : { error: false })}
          />
          <TextField
            name="description"
            label="詳細"
            placeholder="タスクに関する詳細"
            margin="normal"
            rows={3}
            multiline
            variant="outlined"
          />
          <TextField
            name="finishedAt"
            label="締め切り日"
            margin="normal"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="elapsedTime"
            label="経過時間"
            margin="normal"
            variant="outlined"
            defaultValue={0}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            className={classes.subscribeButton}
            onClick={handleClose}
            size="large"
          >
            キャンセル
          </Button>
          <Button
            color="primary"
            className={classes.subscribeButton}
            type="submit"
            size="large"
          // disabled={!nameInput.value}
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
};
