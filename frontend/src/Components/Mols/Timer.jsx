import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import PropTypes from 'prop-types';
import Formatter from '../../Util/Formatter';

// XXX: 本コンポーネントは時間の表示、記録（時間の加算）を行う
let Timer = (props, ref) => {
  //
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

  // 親コンポーネントからtimeを見るためのメソッドを生やしている
  // timerが停止された際、計測された時間は最終的にDBに保存される値になることが予想されるため秒数に変換している
  useImperativeHandle(ref, () => {
    return {
      time: time.asSeconds(),
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
    setTime((time) => time.add(1, 'seconds'));
  };

  return <strong>{time.format('HH:mm:ss')}</strong>;
};

Timer = forwardRef(Timer);
export default Timer;

Timer.propTypes = {
  time: PropTypes.number,
  taskId: PropTypes.number,
  recordingTaskId: PropTypes.number,
};
