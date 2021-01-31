import React, { useState, useEffect, useRef, forwardRef } from 'react';
import PropTypes from 'prop-types';
import Formatter from 'Util/Formatter.jsx';

let Timer = (props, ref) => {
  const [time, setTime] = useState(() => {
    return props.time || null;
  });
  const [timerId, setTimerId] = useState(null);
  const prevRecordingTaskId = usePrevious(props.recordingTaskId);

  function usePrevious(value) {
    const prevRef = useRef(null);
    useEffect(() => {
      prevRef.current = value;
    });
    return prevRef.current;
  }

  // FIXME: 停止ボタンの押下が時間ピッタリとかでないと、たまに1秒進んでたりする
  useEffect(() => {
    const { taskId, recordingTaskId } = props;
    if (taskId && taskId === recordingTaskId) {
      setTimerId(setInterval(addSecond, 1000));
    } else if (!recordingTaskId || prevRecordingTaskId !== recordingTaskId) {
      clearTimeout(timerId);
    } else return;
  }, [props.recordingTaskId]);

  const addSecond = () => {
    setTime((time) => time + 1);
  };

  return <strong>{Formatter.fromSecondToHour(time)}</strong>;
};

Timer = forwardRef(Timer);
export default Timer;

Timer.propTypes = {
  time: PropTypes.number,
  taskId: PropTypes.number,
  recordingTaskId: PropTypes.number,
};
