import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import { InputBase, makeStyles, TextField } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';
// import Formatter from '../../../Util/Formatter';

// widthなど
const useStyles = (props) =>
  makeStyles({
    ...props,
  });

class ExtendedUtils extends DayJsUtils {
  getCalendarHeaderText(date) {
    return date.format('YYYY年 MMM');
  }

  getDatePickerHeaderText(date) {
    return date.format('MMMM DD日');
  }
}

export const DateField = (props, { options }) => {
  const classes = useStyles(props);
  const { date } = props;

  // 入力日 <= 締め切り日のバリデーション
  const validateDate = () => { };

  const handleDateChange = () => {
    // props関数を実行する
  };

  return (
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale={ja}>
      <KeyboardDatePicker
        // TODO: 年を跨ぐ際に面倒なのでtoolbarはあっていもいいかも
        // TODO: キーボードでの入力を禁止する
        disablePast
        allowKeyboardControl={false}
        variant="inline"
        inputVariant="outlined"
        format="YYYY / MM / DD (dd)"
        margin="none"
        value={date}
        {...options}
        onChange={handleDateChange}
        InputProps={{ readOnly: true }}
        okLabel="決定"
        cancelLabel="キャンセル"
        // 締め切り日がない時にメッセージを出させない
        error={false}
        helperText={''}
      />
    </MuiPickersUtilsProvider>
  );
};

DateField.propTypes = {
  date: PropTypes.instanceOf(dayjs).isRequired,
};
