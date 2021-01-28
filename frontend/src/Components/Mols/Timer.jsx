import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import Formatter from 'Util/Formatter.jsx';

let Timer = (props, ref) => {
  const [time, setTime] = useState(() => {
    return props.time || null;
  });
  // startAt,endAtは別管理（作業記録終了時にはこのhashを送信する）
  const [timerId, setTimerId] = useState(null);
  const prevRecordingTaskId = usePrevious(props.recordingTaskId);

  function usePrevious(value) {
    const prevRef = useRef(null);
    useEffect(() => {
      prevRef.current = value;
    });
    return prevRef.current;
  }

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

  return <strong>{Formatter.fromSecondToHour(time)}</strong>;
};

Timer = forwardRef(Timer);
export default Timer;

Timer.propTypes = {
  time: PropTypes.number,
  taskId: PropTypes.number,
  recordingTaskId: PropTypes.number,
};
