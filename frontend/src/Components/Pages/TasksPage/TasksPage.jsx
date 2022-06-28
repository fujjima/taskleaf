import React, { useState, useRef, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  TableContainer,
  Table,
  Button,
  MenuItem,
  IconButton,
  Select,
  Card,
  List,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Timer from 'Components/Mols/Timer';
import { TaskContext } from 'Containers/TasksContainer';
import { CreateDialog } from './CreateDialog';
import { TagChips } from 'Components/Mols/TagChips';
import dayjs from 'dayjs';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  // 複数選択メニュー -------------------------------
  multipleMenu: {
    // backgroundColor: 'red',
  },
  hiddenMultipleMenu: {
    visibility: 'hidden',
  },
  multipleTrashIcon: {
    marginLeft: '13px',
  },
  // ---------------------------------------------
  statusMenu: {
    '& .MuiOutlinedInput-input': {
      paddingBottom: '7px',
      paddingTop: '7px',
    },
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
  // ---------------------------------------------
  // ドラッグ内要素
  list: {
    maxWidth: '300px',
    marginLeft: '10px',
    backgroundColor: 'whitesmoke',
    padding: '20px'
  },
  card: {
    width: '100%',
    marginBottom: '10px',
    minHeight: '30px'
  },
  // ---------------------------------------------
  addButton: {
    width: '100%'
  },
}));

// NOTE: 記録→他タスク記録 の処理のことを「記録切り替え」（switch_recording）と表現する
export const TasksPage = (props) => {
  const {
    lists,
    tasks,
    usableTags,
    taskLabel,
    setTasks,
    updateTask,
    createTask,
    deleteTask,
    updateTags,
    updateTasksOrder,
  } = useContext(TaskContext);
  const classes = useStyles();
  const history = useHistory();

  const timerRef = useRef();
  const isMounted = useRef(false);

  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);

  const [listId, setListId] = useState(null);

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
  const selected = () => {
    return checkedIds.size > 0;
  };

  const displayTags = (task) => {
    const tags = task.tags;

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
    const ids = checkedIds || openMenuId;
    deleteTask(ids);
    setCheckedIds(new Set());
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

  // TODO: 横方向に動かした場合の挙動について
  const handleDragEnd = (result) => {
    // TODO: tasksはlist内にネストされる構造になったのでそれに伴う変更
    // list内の街頭のtasksを抽出する
    const { index, droppableId } = result.source
    const newTasks = lists.find(list => list.id == droppableId)?.tasks
    const [orderedItem] = newTasks.splice(index, 1);
    newTasks.splice(index, 0, orderedItem);

    // NOTE: back側からのレスポンスを待っている間のラグがあるため、tasksの配列の更新を行なっている
    setTasks(newTasks)
    // console.log(newTasks, 'aaaa')
    updateTasksOrder({ tasks: newTasks, listId: droppableId });
  }

  // ダイアログ関連

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  // TODO: タスク生成に必要なパラメータとしてposition（これは強制的に最後にしていいかもしれない）
  //  と listの値が必要
  //  listについては、タスク追加ボタンを押した際のリストIDを取得できるようにしておくことで対応したい
  const handleSubmit = (e, params) => {
    // TODO: タスク生成時にpositionはリスト内の最後に設定しておく
    e.preventDefault();
    createTask(params);
    setDialogOpen(false);
  };

  // render

  // const renderToolBar = () => { };

  const renderSelectStatusMenu = (task) => {
    return (
      <Select
        id="demo-simple-select-filled"
        value={task.status}
        variant="outlined"
        className={classes.statusMenu}
        onChange={(e) => {
          updateTask({ id: task.id, status: e.target.value });
          e.stopPropagation();
        }}
      >
        <MenuItem value="waiting">未着手</MenuItem>
        <MenuItem value="working">作業中</MenuItem>
        <MenuItem value="completed">完了</MenuItem>
        <MenuItem value="pending">保留</MenuItem>
      </Select>
    );
  };

  const getItemStyle = (isDragging, draggableStyle) => { }

  const renderTableBody = () => {
    // NOTE: 複数リストについて
    // ref) https://www.codedaily.io/tutorials/Multi-List-Drag-and-Drop-With-react-beautiful-dnd-Immer-and-useReducer
    // TODO: リスト全体のスタイルについて
    return lists.map((list, idx) => {
      const { tasks } = list
      return (
        <List className={classes.list} name={list.name}>
          {/* TODO: 可変 */}
          {/* TODO: スタイルの適用 */}
          <div>{list.name}</div>
          <DragDropContext onDragEnd={handleDragEnd}>
            {/* TODO: 移動先のリスト情報の取得方法について（具体的にはlistのidの取得をしたい） */}
            <Droppable droppableId={list.id} key="selected">
              {(provided, snapshot) => (
                // TODO: そのうち、リスト内の子要素の総計の高さに応じてドラッグ可能範囲も可変にできるようにしておく
                // TODO: 各リストに対して、「その範囲に入ったら、リスト間の移動を行う」という閾値を指定しておく
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, idx) => {
                    return (
                      <Draggable key={task.id} draggableId={`g-${task.id}`} index={idx}>
                        {(provided) => {
                          return (
                            <div>
                              {/* FIXME: Card内のスタイリングについては、material-uiの5系から入ったsxを使うようにしたい */}
                              {/* ref) https://mui.com/system/the-sx-prop/ */}
                              {/* TODO: オンカーソル時は背景色を変更する */}
                              {/* inline styleの当て方について  */}
                              {/* ref) https://github.com/atlassian/react-beautiful-dnd/blob/master/docs/api/draggable.md#extending-draggablepropsstyle */}
                              <Card variant="outlined" className={classes.card} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                {task.name}
                              </Card>
                            </div>
                          )
                        }}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Button
            className={classes.addButton}
            onClick={(e) => {
              // TODO: リストのIDを指定する
              setListId()
              setDialogOpen(!dialogOpen)
            }}
            variant="outlined"
            startIcon={<AddIcon />}
          >
            タスクの追加
          </Button>
        </List>
      )
    })
  };


  return (
    <div className={classes.root}>
      <TableContainer>
        <div
          className={cn(classes.multipleMenu, {
            [classes.hiddenMultipleMenu]: !selected(),
          })}
        >
          <IconButton
            className={classes.multipleTrashIcon}
            size="large"
            disableRipple
            onClick={() => executeDelete()}
          >
            <DeleteIcon />
          </IconButton>
        </div>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size={'medium'}
          aria-label="enhanced table"
        >
          {renderTableBody()}
        </Table>
      </TableContainer>
      <CreateDialog
        open={dialogOpen}
        onClose={handleDialogClose}
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
