import React, { useState, useRef, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Checkbox,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
// import { } from '@material-ui/core/colors';
import Formatter from '../../../Util/Formatter';
import Timer from '../../Mols/Timer';
import { TaskContext } from '../../../Containers/TasksContainer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100 %',
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {
    margin: '12px',
    // backgroundColor: grey[300],
  },
  form: {
    width: '100 %',
    marginTop: '12px',
  },
  submit: {
    margin: '36px 0 24px',
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

// 期待する引数：{ label(インスタンスの属性): value }
const useInput = (initialValue = {}) => {
  const [value, setValue] = useState(_.head(_.values(initialValue)));
  return {
    // nameInput = {area: name, value: 'テストタスク', onChange: () => {}}のように一個ずつ作成する
    value,
    area: _.head(_.keys(initialValue)),
    onChange: (e) => {
      setValue(e.target.value);
    },
  };
};

export const TasksPage = (props) => {
  const { tasks, taskLabel, updateTask, createTask } = useContext(TaskContext);
  const [recordingTaskId, setRecordingTaskId] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const timerRef = useRef();

  const nameInput = useInput({ name: '' });
  const detailInput = useInput({ description: '' });
  const finishedAtInput = useInput({ finishedAt: null });
  const elapsedTimeInput = useInput({ elapsedTime: 0 });

  const headerCells = _.values(taskLabel);

  const inputers = [nameInput, detailInput, finishedAtInput, elapsedTimeInput];

  // utils

  const rowCount = () => {
    return Object.values(tasks).size;
  };

  const isRecording = (id) => {
    return recordingTaskId === id;
  };

  // handler

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    let params = {};

    inputers.forEach((i) => {
      params[i.area] = i.value;
    });
    createTask(params);
    setOpen(false);
    // e.preventDefault();
    e.stopPropagation();
  };

  const handleRecording = (e, id) => {
    // timerコンポーネントは時間の表示、記録（時間の加算）を担っているため、このコンポーネントに時間の加算機能を持たせるのはよろしくない
    updateTask({ id: id, elapsedTime: timerRef.current.time });
    setRecordingTaskId(null);
    e.stopPropagation();
  };

  // render

  const renderModal = () => {
    return (
      <Dialog className={classes.dialog} open={open} onClose={handleClose}>
        <DialogTitle>タスク作成</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent className={classes.dialogContent}>
            {/* タスク名は空欄を許容しない */}
            {/* デフォルト：タスク名（空欄）、詳細（空欄）、締め切り日（空欄）、経過時間（0秒）*/}
            {/* ひとまず、まだタグはないのでタグ分の設定項目は削除しておく */}
            <TextField
              size="small"
              label="タスク名"
              variant="outlined"
              margin="normal"
              {...nameInput}
            />
            <TextField
              label="詳細"
              placeholder="タスクに関する詳細"
              rows={3}
              multiline
              variant="outlined"
              margin="normal"
              {...detailInput}
            />
            <TextField
              label="締め切り日"
              type="date"
              defaultValue={Formatter.todayString()}
              margin="normal"
              {...finishedAtInput}
            />
            <TextField
              label="経過時間"
              variant="outlined"
              margin="normal"
              defaultValue={0}
              {...elapsedTimeInput}
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
            {/* 経過時間は、○日○時間○分○秒のようなフォーマットにした方がいいかもしれない */}
            {/* タスク編集ページの経過時間の編集のところと同じような仕様にしておきたい */}
            <Button
              color="primary"
              className={classes.subscribeButton}
              type="submit"
              size="large"
            >
              作成
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };

  const renderToolBar = () => { };

  const renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              // 選択状態：全タスクが選択状態になっている
              // 未選択状態：一つでも未選択のタスクがある
              checked={rowCount() > 0 && numSelected === rowCount()}
              // onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {headerCells.map((hcell) => (
            <TableCell
              key={hcell.id}
              align={hcell.numeric ? 'right' : 'left'}
            // sortDirection={orderBy === headCell.id ? order : false}
            >
              {hcell}
            </TableCell>
          ))}
          <TableCell>{''}</TableCell>
          <TableCell>{''}</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  const renderTableBody = () => {
    return (
      <TableBody>
        {Object.values(tasks).map((task) => {
          return (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key
              onClick={() => {
                history.push(`tasks/${task.id}`);
              }}
            >
              <TableCell padding="checkbox" width="10%">
                <Checkbox
                  checked={false}
                // inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
              <TableCell width="20%">{task.name}</TableCell>
              <TableCell width="15%">{task.tag}</TableCell>
              <TableCell width="25%">{task.description}</TableCell>
              <TableCell width="10%">
                {Formatter.toDate(task.finishedAt)}
              </TableCell>
              <TableCell width="10%">
                <Timer
                  time={task.elapsedTime}
                  taskId={task.id}
                  recordingTaskId={recordingTaskId}
                  ref={timerRef}
                />
              </TableCell>
              <TableCell width="10%">
                {isRecording(task.id) ? (
                  <StopIcon
                    key={`stop-icon-${task.id}`}
                    onClick={(e) => {
                      handleRecording(e, task.id);
                    }}
                  />
                ) : (
                    <PlayArrowIcon
                      key={`play-icon-${task.id}`}
                      onClick={(e) => {
                        setRecordingTaskId(task.id);
                        e.stopPropagation();
                      }}
                    />
                  )}
              </TableCell>
              <TableCell width="10%">テスト</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  return (
    <div className={classes.root}>
      <TableContainer>
        <Button
          onClick={() => setOpen(!open)}
          variant="outlined"
          color="primary"
          className={classes.button}
          startIcon={<AddIcon />}
        >
          タスクの追加
        </Button>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table"
        >
          {renderTableHead()}
          {renderTableBody()}
        </Table>
      </TableContainer>
      {renderModal()}
    </div>
  );
};

TasksPage.propTypes = {
  history: PropTypes.object,
};

TasksPage.contextTypes = {
  tasks: PropTypes.object,
};
