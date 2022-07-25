import React, { useState } from 'react';
import DayJsUtils from '@date-io/dayjs';
import { makeStyles } from '@material-ui/core';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { Dayjs } from 'dayjs';
import ja from 'dayjs/locale/ja';

const useStyles = (props) =>
  makeStyles({
    ...props,
  });

class ExtendedUtils extends DayJsUtils {
  getCalendarHeaderText(date: Dayjs): string {
    return date.format('YYYY年 MMM');
  }

  getDatePickerHeaderText(date: Dayjs): string {
    return date.format('MMMM DD日');
  }
}

// TODO: DateField自体に型付けができないかを検討する
// type PropTypes
export const DateField = (props) => {
  const classes = useStyles(props);
  const { name, pdate, onClose, ...options } = props;
  const [date, setDate] = useState<Dayjs>(pdate);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (e) => {
    setOpen(false);
    onClose(e, { [name]: date });
  };

  return (
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale={ja}>
      <KeyboardDatePicker
        disableToolbar
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
          onClose: (e) => handleClose(e),
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
