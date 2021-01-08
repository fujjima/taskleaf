import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import Formatter from '../../Util/Formatter';

// XXX: 本コンポーネントは時間の表示、記録（時間の加算）を担当する
let Timer = (props, ref) => {
  const [time, setTime] = useState(props.time || null);
  const [timerId, setTimerId] = useState(null);
  const prevRecordingTaskId = usePrevious(props.recordingTaskId);

  function usePrevious(value) {
    const prevRef = useRef(null);
    useEffect(() => {
      prevRef.current = value;
    });
    return prevRef.current;
  }

  // 親コンポーネントからtimeを見るためのメソッドを生やしている
  useImperativeHandle(ref, () => {
    return {
      time: time,
    };
  });

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

  return <strong>{Formatter.toElapsedTime(time)}</strong>;
};

Timer = forwardRef(Timer);
export default Timer;

Timer.propTypes = {
  time: PropTypes.number,
  taskId: PropTypes.number,
  recordingTaskId: PropTypes.number,
};
