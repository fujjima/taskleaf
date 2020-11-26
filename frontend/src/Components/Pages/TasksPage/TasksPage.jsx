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
  Paper,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { purple } from '@material-ui/core/colors';
// TODO: import時のパス参照を行いやすくする
import { connect } from '../../../Lib/Connect';

const sytles = {
  root: {
    width: '100 %',
    marginTop: '100px',
    // 子要素を縦に並べる ----------
    display: 'flex',
    flexDirection: 'column',
    // --------------------------
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
    // backgroundColor: purple[400],
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
  constructor(props) {
    // TODO: propsの型チェック機構を追加したい
    super(props);
    this.state = {
      tasks: [],
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // TODO: pageを呼ぶ上位のコンポーネント内でfetchするようにしたい
  fetchData = async () => {
    const tasks = await connect.getTasks();
    this.setState(() => ({
      tasks: tasks,
    }));
  };

  // util

  rowCount = () => {
    const { tasks } = this.state;
    return Object.values(tasks).size;
  };

  headerCells = () => {
    return ['タスク名', 'タグ', '詳細', '経過時間', '締め切り日', 'アクション'];
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
              // 数値であれば見やすくするために右揃えにする
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
    const { tasks } = this.state;
    return (
      <TableBody>
        {Object.values(tasks).map((task) => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={false}
                // inputProps={{ 'aria-labelledby': labelId }}
                />
              </TableCell>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.tag}</TableCell>
              <TableCell>{task.description}</TableCell>
              {/* 経過時間のフォーマット */}
              <TableCell>{task.elapsed_time}</TableCell>
              {/* 締め切り日のフォーマット */}
              <TableCell>{task.finished_at}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  render() {
    const { classes } = this.props;
    const { tasks } = this.state;
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

TasksPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sytles)(TasksPage);
