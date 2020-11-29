import React from 'react';
import PropTypes from 'prop-types';
import Formatter from '../../Util/Formatter';

export default class Timer extends React.Component {
  // TODO: taskIdがnullを経由せずに切り替わった場合（他タスクが記録開始された場合）
  // TODO: 記録中、タスク一覧画面の他のコンポーネントで更新された場合に変な干渉が起きないか
  static propTypes = {
    recordingTaskId: PropTypes.number,
    taskId: PropTypes.number,
    time: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      time: props.time || null,
    };
  }

  componentDidUpdate(prevProps) {
    // propsのrecordingTaskIdの変更前と変更後の値を取得したい
    const { taskId, recordingTaskId } = this.props;
    if (taskId && taskId === recordingTaskId) {
      this.timer = setTimeout(() => this.addSecond(), 1000);
    } else if (
      !recordingTaskId ||
      prevProps.recordingTaskId !== recordingTaskId
    ) {
      clearTimeout(this.timer);
    }
  }

  addSecond = () => {
    const { time } = this.state;
    return this.setState({ time: time + 1 });
  };

  render() {
    const { time } = this.state;
    console.log(this.timer);
    return <strong>{Formatter.toElapsedTime(time)}</strong>;
  }
}
