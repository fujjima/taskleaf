import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DayJsUtils from '@date-io/dayjs';
import { makeStyles } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';

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

export const DateField = (props) => {
  const classes = useStyles(props);
  const { pdate, onClose, ...options } = props;
  const [date, setDate] = useState(pdate);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose && onClose({ finishedAt: date });
  };

  return (
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale={ja}>
      <KeyboardDatePicker
        open={open}
        disablePast
        variant="inline"
        inputVariant="outlined"
        format="YYYY / MM / DD (dd)"
        value={date}
        onChange={(date) => setDate(date)}
        // テキストエリアクリック時にカレンダーを開くための設定-----
        KeyboardButtonProps={{
          onFocus: () => setOpen(true),
        }}
        PopoverProps={{
          disableRestoreFocus: true,
          onClose: handleClose,
        }}
        // ------------------------------------------------
        InputProps={{
          onFocus: () => {
            setOpen(true);
          },
        }}
        // バリデーションメッセージを表示させない
        error={false}
        helperText={''}
        {...options}
      />
    </MuiPickersUtilsProvider>
  );
};

DateField.propTypes = {
  pdate: PropTypes.instanceOf(dayjs).isRequired,
  onClose: PropTypes.func,
};
