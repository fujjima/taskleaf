import React from 'react';
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
import { withStyles } from '@material-ui/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
// import { } from '@material-ui/core/colors';
// TODO: import時のパス参照を行いやすくする
import { connect } from '../../../Lib/Connect';
import Formatter from '../../../Util/Formatter';
import Timer from '../../Mols/Timer';

const sytles = {
  root: {
    width: '100 %',
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  // paper: {
  //   marginTop: '100px',
  //   // 子要素を縦に並べる ----------
  //   display: 'flex',
  //   flexDirection: 'column',
  //   // --------------------------
  //   alignItems: 'center',
  // },
  table: {
    margin: '12px',
    // TODO: hooksを使用してmaterial ui標準のpaletteを使いたい
    // backgroundColor: grey[300],
  },
  form: {
    width: '100 %',
    marginTop: '12px',
  },
  submit: {
    margin: '36px 0 24px',
  },
};

class TasksPage extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    history: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      recordingTaskId: null,
    };
    // timer内のstateのtimeを取得したいがために追加
    this.timerRef = React.createRef();
  }

  componentDidMount() {
    this.fetchData();
  }

  // TODO: 上位コンポーネント内でfetchしたい
  fetchData = async () => {
    const tasks = await connect.getTasks();
    this.setState(() => ({
      tasks: tasks,
    }));
  };

  // TODO: recordingTaskIdが切り替わった時の対応
  // TODO: こいつが処理をした際に、画面のリロードが入る
  // 成功時のレスポンスは不要なため、画面のリロード等を挟まずに停止させたい
  updateTime = (id, time) => {
    connect.updateTask({
      id: id,
      elapsed_time: time,
    });
  };

  // util

  rowCount = () => {
    const { tasks } = this.state;
    return Object.values(tasks).size;
  };

  isRecording = (id) => {
    const { recordingTaskId } = this.state;
    return recordingTaskId === id;
  };

  headerCells = () => {
    return ['タスク名', 'タグ', '詳細', '締め切り日', '経過時間', '', ''];
  };

  handleRecording = (id) => {
    this.updateTime(id, this.timerRef.current.state.time);
    this.setState({ recordingTaskId: null });
  };

  // render

  // タスクの複数選択時に、選択したタスクをまとめて削除、編集といったことをツールバー上で行いたい時など
  // renderToolBar = () => { };

  renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              // 選択状態：全タスクが選択状態になっている
              // 未選択状態：一つでも未選択のタスクがある
              checked={this.rowCount() > 0 && numSelected === this.rowCount()}
              // trueになった際、全リストを選択状態にする
              // falseになった際、全リストを未選択状態にする
              // onChange={onSelectAllClick}
              inputProps={{ 'aria-label': 'select all desserts' }}
            />
          </TableCell>
          {this.headerCells().map((hcell) => (
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

  renderTableBody = () => {
    const { tasks, recordingTaskId } = this.state;
    const { history } = this.props;
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
                // TODO: 開始地点が常にtopなのは仕様なのか
                history.push(`tasks/${task.id}`, { task: task });
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
                  ref={this.timerRef}
                />
              </TableCell>
              <TableCell width="10%">
                {this.isRecording(task.id) ? (
                  <StopIcon
                    key={`stop-icon-${task.id}`}
                    onClick={() => {
                      this.handleRecording(task.id);
                    }}
                  />
                ) : (
                    <PlayArrowIcon
                      key={`play-icon-${task.id}`}
                      onClick={() =>
                        this.setState({
                          recordingTaskId: task.id,
                        })
                      }
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

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            {this.renderTableHead()}
            {this.renderTableBody()}
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(sytles)(TasksPage);
