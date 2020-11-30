import React from 'react';
import PropTypes from 'prop-types';
import Formatter from '../../Util/Formatter';

export default class Timer extends React.Component {
  // TODO: 記録中、タスク一覧画面の他のコンポーネントで更新された場合に変な干渉が起きないか
  static propTypes = {
    time: PropTypes.number,
    taskId: PropTypes.number,
    recordingTaskId: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      time: props.time || null,
    };
  }

  componentDidUpdate(prevProps) {
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
    this.setState({ time: time + 1 });
  };

  render() {
    const { time } = this.state;
    return <strong>{Formatter.toElapsedTime(time)}</strong>;
  }
}
