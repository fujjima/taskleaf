import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import dayjs from 'dayjs';
import NumberFormat from 'react-number-format';
import { makeStyles } from '@material-ui/core';

// タスク編集、タスク作成画面（タスク一覧ではTimerが担当）

const NumberFormatCustom = (props) => {
  const { value, inputRef, onChange, ...other } = props;

  return (
    // TODO: 値の入力制限用関数の用意
    // 制限しない場合は、換算処理を入れる（12:62:30→13:2:30のように）
    // 12:30:30のように入力した状態で12を消すと、30:30:ssのようになるので、
    // HH:30:30のような入力状態になるようにしたい
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      // onValueChange={(values) => {
      //   onChange({
      //     target: {
      //       value: values.value,
      //     },
      //   });
      // }}
      isNumericString
      defaultValue={value}
      format="##:##:##"
      mask={['H', 'm', 's']}
    />
  );
};

NumberFormatCustom.propTypes = {
  time: PropTypes.instanceOf(dayjs).isRequired,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export const TimeField = (props) => {
  const handleChange = () => { };

  return (
    <TextField
      name="elapsedTime"
      label="経過時間"
      value={props.time.format('HH:mm:ss')}
      onChange={(e) => handleChange(e)}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
      InputLabelProps={{ shrink: true }}
    />
  );
};

TimeField.propTypes = {
  time: PropTypes.instanceOf(dayjs).isRequired,
};
