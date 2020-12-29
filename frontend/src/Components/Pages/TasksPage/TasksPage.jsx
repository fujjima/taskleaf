import React, { useState, useRef, useContext } from 'react';
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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
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
}));

export const TasksPage = (props) => {
  const { tasks, updateTask } = useContext(TaskContext);
  const [recordingTaskId, setRecordingTaskId] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  const timerRef = useRef();

  const rowCount = () => {
    return Object.values(tasks).size;
  };

  const isRecording = (id) => {
    return recordingTaskId === id;
  };

  const headerCells = () => {
    return ['タスク名', 'タグ', '詳細', '締め切り日', '経過時間', '', ''];
  };

  const handleRecording = (e, id) => {
    // timerコンポーネントは時間の表示、記録（時間の加算）を担っているため、このコンポーネントに時間の加算機能を持たせるのはよろしくない
    updateTask({ id: id, elapsedTime: timerRef.current.time });
    setRecordingTaskId(null);
    e.stopPropagation();
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
          {headerCells().map((hcell) => (
            <TableCell
              key={hcell.id}
              align={hcell.numeric ? 'right' : 'left'}
            // sortDirection={orderBy === headCell.id ? order : false}
            >
              {hcell}
            </TableCell>
          ))}
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
                {Formatter.toDate(task.finished_at)}
              </TableCell>
              <TableCell width="10%">
                <Timer
                  time={task.elapsed_time}
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
    </div>
  );
};

TasksPage.propTypes = {
  history: PropTypes.object,
};

TasksPage.contextTypes = {
  tasks: PropTypes.object,
};
