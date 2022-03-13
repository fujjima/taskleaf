import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FormControl, TextField } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { makeStyles } from '@material-ui/core/styles';
import EventIcon from '@material-ui/icons/Event';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Calendar from 'react-calendar';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import PropTypes from 'prop-types';
import dayjs, { duration } from 'dayjs';
import ja from 'dayjs/locale/ja';
import Formatter from 'Util/Formatter';

const useStyles = makeStyles((theme) => ({
  calendar: {
    '& .react-calendar__month-view__days__day--neighboringMonth': {
      visibility: 'hidden',
    },
  },
}));

export const ReportsPage = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [open, setOpen] = useState(false);
  let history = useHistory();
  const reports = props.reports;
  const classes = useStyles();

  // const chartDatas = () => {
  //   let chartData = _.cloneDeep(reports);
  //   const test = chartData.map((h) => {
  //     for (let key in h) {
  //       h[key] = Number.isFinite(h[key])
  //         ? Formatter.fromSecondToHour(h[key])
  //         : dayjs(h[key]);
  //     }
  //   });
  //   return test;
  // };

  const dateRange = [startDate, endDate];

  const ticks = [0, 18000, 36000, 54000, 72000, 86400];

  const toHour = (time) => {
    const hour = Math.floor(time / 3600);
    return `${hour}H`;
  };

  const taskNames = () => {
    // if (division === 'tag') return;
    if (_.isNull(reports)) return [];

    const taskNames = reports.flatMap((r) => {
      return _.keys(r).filter((k) => k !== 'recordedAt');
    });
    return [...new Set(taskNames)];
  };

  const tagName = () => {};

  const generataColor = () => {
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
      randomColor += ((16 * Math.random()) | 0).toString(16);
    }
    return randomColor;
  };

  const handleClickAway = (e) => {
    const target = e.target?.dataset?.calendar;

    if (!target || target !== 'calendar') {
      setOpen(false);
      if (!(startDate && endDate)) return;

      // TODO: この辺りのURL操作はcontainerでやりたい
      history.push({
        pathname: '/reports',
        search: `?start=${dayjs(startDate).format('YYYY-MM-DD')}&end=${dayjs(
          endDate
        ).format('YYYY-MM-DD')}`,
      });
      props.changePeriod(dateRange);
    }
  };

  const dateRangePicker = () => {
    // TODO: クリック時のアニメーションを追加できたら追加する
    return (
      <>
        <TextField
          label="表示期間"
          // data-calendar="calendar"
          value={startDate && endDate ? `${startDate} ~ ${endDate}` : ''}
          onFocus={() => {
            setOpen(true);
          }}
          inputProps={{
            'data-calendar': 'calendar',
          }}
          InputProps={{
            // iconbuttonで囲む
            // クリックでカレンダーを開くようにする
            endAdornment: <EventIcon />,
          }}
        />
        {open && (
          <ClickAwayListener onClickAway={handleClickAway}>
            <Calendar
              className={classes.calendar}
              data-calendar="calendar"
              showDoubleView
              selectRange
              calendarType="US"
              showNeighboringMonth={false}
              value={dateRange}
              onChange={(date) => {
                setStartDate(date[0]);
                setEndDate(date[1]);
              }}
            />
          </ClickAwayListener>
        )}
      </>
    );
  };

  return (
    <>
      {dateRangePicker()}
      <BarChart width={1000} height={500} data={reports}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="recordedAt"
          tickFormatter={(recordedAt) => dayjs(recordedAt).format('M/D')}
        />
        <YAxis domain={[0, 86400]} ticks={ticks} tickFormatter={toHour} />

        <Tooltip
          formatter={(value) => dayjs.duration(value * 1000).format('H:mm:ss')}
        />
        <Legend />
        {taskNames().map((tn, idx) => {
          return (
            <Bar
              key={idx}
              dataKey={tn}
              stackId="a"
              fill={generataColor()}
            ></Bar>
          );
        })}
      </BarChart>
    </>
  );
};

ReportsPage.propTypes = {
  reports: PropTypes.array,
  changePeriod: PropTypes.func,
};
