import React, { useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import dayjs from 'dayjs';
import MaskedInput from 'react-text-mask';

const NumberFormatCustom = (props) => {
  const { ...options } = props;

  return (
    <MaskedInput
      mask={[/\d/, /\d/, ':', /[0-5]/, /\d/, ':', /[0-5]/, /\d/]}
      {...options}
    />
  );
};

NumberFormatCustom.propTypes = {
  onChange: PropTypes.func.isRequired,
};

let TimeField = (props, ref) => {
  const { ...options } = props;
  const [elapsedTime, setElapsedTime] = useState(props.time);

  useImperativeHandle(ref, () => {
    return {
      newTaskElapsedTime: elapsedTime,
    };
  });

  const handleChange = ({ target }) => {
    const { value } = target;
    setElapsedTime(value);
  };

  return (
    <TextField
      name="elapsedTime"
      label="作業時間"
      value={elapsedTime}
      onChange={handleChange}
      placeholder="HH:MM:SS"
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
      InputLabelProps={{ shrink: true }}
      {...options}
    />
  );
};

TimeField = forwardRef(TimeField);
export default TimeField;

TimeField.propTypes = {
  time: PropTypes.instanceOf(dayjs).isRequired,
};
