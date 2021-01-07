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
  IconButton,
  Menu,
  MenuItem,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Formatter from '../../../Util/Formatter';
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
}));

const useInput = (initialValue = {}) => {
  const [value, setValue] = useState(_.head(_.values(initialValue)));
  return {
    value,
    area: _.head(_.keys(initialValue)),
    onChange: (e) => {
      setValue(e.target.value);
    },
  };
};

// 必要ならtask行はTaskRowとして分ける

export const TasksPage = (props) => {
  const { tasks, taskLabel, updateTask, createTask } = useContext(TaskContext);
  const [checkedIds, setCheckedIds] = useState([]);
  const [recordingTaskId, setRecordingTaskId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const classes = useStyles();
  const history = useHistory();
  const timerRef = useRef();

  const [menuOpenId, setMenuOpenId] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const nameInput = useInput({ name: '' });
  const detailInput = useInput({ description: '' });
  const finishedAtInput = useInput({ finishedAt: null });
  const elapsedTimeInput = useInput({ elapsedTime: 0 });

  const headerCells = [...taskLabel.values()];

  // TODO: 仮にtaskモデル上で扱うフィールドが増えた場合に、inputers, ~Inputの二つを手動で増やさないといけない、というのは非常に分かりづらい
  const inputers = [nameInput, detailInput, finishedAtInput, elapsedTimeInput];

  // utils

  const rowCount = () => {
    return tasks.size;
  };

  const isRecording = (id) => {
    return recordingTaskId === id;
  };

  // handler

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    let params = {};

    // fieldを別コンポーネントにした場合、子のfield内のvalue（state）にアクセスする、という考え方になる？
    inputers.forEach((i) => {
      params[i.area] = i.value;
    });
    createTask(params);
    setOpen(false);
    e.stopPropagation();
  };

  const handleAllCheck = (e) => {
    // 配下の全てのチェックボックスの状態を反転させる
    e.stopPropagation();
  };

  const handleCheck = (e) => {
    e.stopPropagation();
  };

  const handleRecording = (e, id) => {
    // timerコンポーネントは時間の表示、記録（時間の加算）を担っているため、このコンポーネントに時間の加算機能を持たせるのはよろしくない
    updateTask({ id: id, elapsedTime: timerRef.current.time });
    setRecordingTaskId(null);
    e.stopPropagation();
  };

  // render

  // const renderToolBar = () => { };

  const renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              className={classes.checkBox}
              // 選択状態：全タスクが選択状態になっている
              // 未選択状態：一つでも未選択のタスクがある
              // checked={rowCount() > 0 && numSelected === rowCount()}
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
                  checked={false}
                  onClick={handleCheck}
                />
              </TableCell>
              <TableCell width="20%">{task.name}</TableCell>
              <TableCell width="15%">{task.tag}</TableCell>
              <TableCell width="25%">{task.description}</TableCell>
              <TableCell width="10%">
                {/* TODO: そのうち締め切り日でのソートとかをしたくなるはず */}
                {task.finishedAt ? Formatter.toDate(task.finishedAt) : ''}
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
              <TableCell width="5%">
                <MoreVertIcon
                  onClick={(e) => {
                    setMenuOpenId(task.id);
                    e.stopPropagation();
                  }}
                />
              </TableCell>
              {/* {renderMenu()} */}
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
      <CreateDialog open={dialogOpen} handleClose={handleClose} />
    </div>
  );
};

TasksPage.propTypes = {
  history: PropTypes.object,
};

TasksPage.contextTypes = {
  tasks: ImmutablePropTypes.list,
};
