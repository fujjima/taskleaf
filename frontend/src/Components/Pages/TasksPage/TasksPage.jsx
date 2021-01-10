import React, { useState, useRef, useContext } from 'react';
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
import Timer from '../../Mols/Timer';
import { TaskContext } from '../../../Containers/TasksContainer';
import { CreateDialog } from './CreateDialog';

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

export const TasksPage = (props) => {
  const { tasks, taskLabel, updateTask, createTask, deleteTask } = useContext(
    TaskContext
  );
  const [checkedIds, setCheckedIds] = useState(new Set());
  const [recordingTaskId, setRecordingTaskId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const timerRef = useRef();

  const [openMenuId, setOpenMenuId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const headerCells = [...taskLabel.values()];

  // utils

  const isOpened = !_.isNull(openMenuId);

  const rowCount = () => {
    return tasks.size;
  };

  const isRecording = (id) => {
    return recordingTaskId === id;
  };

  // handler

  const toggleOpen = (event, id) => {
    setAnchorEl(event.currentTarget);
    setOpenMenuId(id);
    event.stopPropagation();
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = (e, params) => {
    e.preventDefault();
    createTask(params);
    setDialogOpen(false);
  };

  const handleDelete = (e) => {
    deleteTask(openMenuId);
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

  const handleRecording = (e, id) => {
    updateTask({ id: id, elapsedTime: timerRef.current.time });
    setRecordingTaskId(null);
    e.stopPropagation();
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
          horizontal: 'center',
        }}
        onClick={(e) => {
          setAnchorEl(null);
          setOpenMenuId(null);
          e.stopPropagation();
        }}
      >
        <MenuItem>複製</MenuItem>
        {/* 論理削除にするかどうかについて */}
        <MenuItem onClick={handleDelete} className={classes.deleteItem}>
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
              className={classes.checkBox}
              checked={rowCount() > 0 && checkedIds.size === rowCount()}
              inputProps={{ 'aria-label': 'select all desserts' }}
              onClick={handleAllCheck}
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
        {tasks.map((task) => {
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
                  className={classes.checkBox}
                  checked={checkedIds.has(task.id)}
                  onClick={(e) => handleCheck(e, task.id)}
                />
              </TableCell>
              <TableCell width="20%">{task.name}</TableCell>
              <TableCell width="15%">{task.tag}</TableCell>
              <TableCell width="25%">{task.description}</TableCell>
              <TableCell width="10%">
                {/* TODO: そのうち締め切り日でのソートとかをしたくなるはず */}
                {task.finishedAt}
              </TableCell>
              <TableCell width="10%">
                <Timer
                  time={task.elapsedTime}
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
                      handleRecording(e, task.id);
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
                        setRecordingTaskId(task.id);
                        e.stopPropagation();
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
                  onClick={(e) => toggleOpen(e, task.id)}
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
      <CreateDialog
        open={dialogOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

TasksPage.propTypes = {
  history: PropTypes.object,
};

TasksPage.contextTypes = {
  tasks: ImmutablePropTypes.list,
};
