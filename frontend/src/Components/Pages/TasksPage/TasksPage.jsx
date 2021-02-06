import React, { useState, useRef, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  TableContainer,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Table,
  Checkbox,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Timer from 'Components/Mols/Timer';
import { TaskContext } from 'Containers/TasksContainer';
import { CreateDialog } from './CreateDialog';
import { TagChips } from 'Components/Mols/TagChips';
import dayjs from 'dayjs';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  table: {},
  form: {
    width: '100 %',
    marginTop: '12px',
  },
  submit: {
    margin: '36px 0 24px',
  },
  addButton: {
    marginLeft: '30px',
    marginBottom: '30px',
  },
  hiddenMultipleMenu: {
    visibility: 'hidden',
  },
  multipleMenu: {},
  checkBox: {
    marginLeft: '0.5em',
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
  recordingIcon: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  menuButton: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  deleteItem: {
    color: 'red',
  },
}));

// TODO: 巨大になってしまったので、テーブル行、start/stopIcon、Timer周りをそのうち分離する
// 下記のように、記録→他タスク記録 の処理のことを「記録切り替え」（switch_recording）とする
// recordingTaskIdが入っている状態で他のstartIconがクリックされる：(+ clearTimeoutの実施)、recordingTaskIdのセット、setIntervalの作成
export const TasksPage = (props) => {
  const {
    tasks,
    usableTags,
    taskLabel,
    updateTask,
    createTask,
    deleteTask,
    updateTags,
  } = useContext(TaskContext);
  const classes = useStyles();
  const history = useHistory();

  const timerRef = useRef();
  const isMounted = useRef(false);

  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);

  // 記録中タスク判定用
  const [recordingTaskId, setRecordingTaskId] = useState(null);

  // その他
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const prevStartAt = usePrevious(startAt);
  const prevRecordingTaskId = usePrevious(recordingTaskId);

  useEffect(() => {
    if (isMounted.current) {
      // 切り替え時のみ（通常の記録→停止は含めない）
      if (
        prevRecordingTaskId &&
        recordingTaskId &&
        prevRecordingTaskId !== recordingTaskId
      ) {
        setEndAt(() => {
          const endAt = dayjs().format('YYYY/MM/DD HH:mm:ss');
          updateTask({
            id: prevRecordingTaskId,
            times: { startAt: prevStartAt, endAt },
          });
          return endAt;
        });
      } else return;
    } else {
      isMounted.current = true;
    }
  }, [recordingTaskId]);

  function usePrevious(value) {
    const prevRef = useRef(null);
    useEffect(() => {
      prevRef.current = value;
    });
    return prevRef.current;
  }

  // utils

  const headerCells = [...taskLabel.values()];

  const isOpened = !_.isNull(openMenuId);

  const rowCount = () => {
    return tasks.size;
  };

  const selected = () => {
    return checkedIds.size > 0;
  };

  const isRecording = (id) => {
    return recordingTaskId === id;
  };

  const displayTags = (task) => {
    const tags = task.tags;
    if (tags.size === 0) return tags;

    return (
      <TagChips
        taskId={task.id}
        tags={tags}
        tagChange={handleTagChange}
        usableTags={usableTags}
        size="small"
      />
    );
  };

  const executeDelete = () => {
    deleteTask(openMenuId);
  };

  // handler

  // メニューボタン開閉切り替え
  const handleOpenMenu = (e, id) => {
    setAnchorEl(e.currentTarget);
    setOpenMenuId(id);
    e.stopPropagation();
  };

  const handleTagChange = (taskId, tags) => {
    updateTags({ id: taskId, tagIds: tags });
  };

  const handleCheck = (e, id) => {
    setCheckedIds((prev) => {
      prev.has(id) ? prev.delete(id) : prev.add(id);
      return new Set(prev);
    });
    e.stopPropagation();
  };

  const handleAllCheck = (e) => {
    const checked = e.target.checked;
    setCheckedIds((prev) => {
      if (checked) {
        prev = tasks.map((t) => t.id).toJS();
      } else {
        prev.clear();
      }
      return new Set(prev);
    });
    e.stopPropagation();
  };

  const handleStart = (e, id) => {
    // バックに送信する際に何故かGMTになってしまうため、文字列をフォーマットして格納している
    setStartAt(dayjs().format('YYYY/MM/DD HH:mm:ss'));
    setRecordingTaskId(id);
    e.stopPropagation();
  };

  // stopIconがクリックされる：endAtのセット、recordingTaskIdを削除、clearTimeoutの実施
  const handleStop = (e, id) => {
    setEndAt(() => {
      const endAt = dayjs().format('YYYY/MM/DD HH:mm:ss');
      updateTask({ id: id, times: { startAt, endAt } });
      return endAt;
    });

    setStartAt(null);
    setRecordingTaskId(null);
    e.stopPropagation();
  };

  // ダイアログ関連

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (e, params) => {
    e.preventDefault();
    createTask(params);
    setDialogOpen(false);
  };

  // render

  // const renderToolBar = () => { };

  const renderMenu = () => {
    return (
      <Menu
        open={isOpened}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        onClick={(e) => {
          setAnchorEl(null);
          setOpenMenuId(null);
          e.stopPropagation();
        }}
      >
        <MenuItem>複製</MenuItem>
        <MenuItem onClick={executeDelete} className={classes.deleteItem}>
          削除
        </MenuItem>
      </Menu>
    );
  };

  const renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              disableRipple
              className={classes.checkBox}
              checked={rowCount() > 0 && checkedIds.size === rowCount()}
              inputProps={{ 'aria-label': 'select all desserts' }}
              onClick={handleAllCheck}
            />
          </TableCell>
          {headerCells.map((hcell, idx) => (
            <TableCell
              key={idx}
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
        {tasks.map((task) => {
          return (
            <TableRow
              hover
              role="checkbox"
              tabIndex={-1}
              key={task.id}
              onClick={() => {
                history.push(`tasks/${task.id}`);
              }}
            >
              <TableCell padding="checkbox" width="10%">
                <Checkbox
                  disableRipple
                  className={classes.checkBox}
                  checked={checkedIds.has(task.id)}
                  onClick={(e) => handleCheck(e, task.id)}
                />
              </TableCell>
              <TableCell width="20%">{task.name}</TableCell>
              <TableCell width="15%">{displayTags(task)}</TableCell>
              <TableCell width="25%">{task.description}</TableCell>
              <TableCell width="10%">
                {/* TODO: 締め切り日でのソート */}
                {task.finishedAt.isValid()
                  ? task.finishedAt.format('YYYY/MM/DD')
                  : ''}
              </TableCell>
              <TableCell width="10%">
                <Timer
                  time={task.workingTime}
                  taskId={task.id}
                  recordingTaskId={recordingTaskId}
                  ref={timerRef}
                />
              </TableCell>
              <TableCell width="5%">
                {isRecording(task.id) ? (
                  <IconButton
                    size="small"
                    disableRipple
                    className={classes.recordingIcon}
                    key={`stop-icon-${task.id}`}
                    onClick={(e) => {
                      handleStop(e, task.id);
                    }}
                  >
                    <StopIcon />
                  </IconButton>
                ) : (
                    <IconButton
                      size="small"
                      disableRipple
                      className={classes.recordingIcon}
                      key={`play-icon-${task.id}`}
                      onClick={(e) => {
                        handleStart(e, task.id);
                      }}
                    >
                      <PlayArrowIcon />
                    </IconButton>
                  )}
              </TableCell>
              <TableCell width="5%">
                <IconButton
                  className={classes.menuButton}
                  size="small"
                  disableRipple
                  onClick={(e) => handleOpenMenu(e, task.id)}
                >
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          );
        })}
        {renderMenu()}
      </TableBody>
    );
  };

  return (
    <div className={classes.root}>
      <TableContainer>
        <Button
          className={classes.addButton}
          onClick={() => setDialogOpen(!dialogOpen)}
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
        >
          タスクの追加
        </Button>
        <div
          className={
            selected() ? classes.multipleMenu : classes.hiddenMultipleMenu
          }
        >
          <IconButton
            size="large"
            disableRipple
          // onClick={(e) => handleOpenMenu(e, task.id)}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            size="large"
            disableRipple
          // onClick={(e) => handleOpenMenu(e, task.id)}
          >
            <EditIcon />
          </IconButton>
        </div>
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
      {/* <CreateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
      /> */}
    </div>
  );
};

TasksPage.propTypes = {
  history: PropTypes.object,
};

TasksPage.contextTypes = {
  tasks: ImmutablePropTypes.list,
};
