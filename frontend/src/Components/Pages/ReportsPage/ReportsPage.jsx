import React, { useState, useRef, useContext, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import PropTypes from 'prop-types';
import dayjs, { duration } from 'dayjs';
import { TasksPage } from '../TasksPage/TasksPage';
import Formatter from 'Util/Formatter';

export const ReportsPage = (props) => {
  const reports = props.reports;

  // [{recordedAt: MM/DD, taskname1: HH:mm:ss, taskname2: HH:mm:ss}]
  const chartDatas = () => {
    let chartData = _.cloneDeep(reports);
    const test = chartData.map((h) => {
      // {}内の数字の型は問答無用でdayjs、keyがrecordedAtならdate型、もしくは単にparseしたもの
      for (let key in h) {
        h[key] = Number.isFinite(h[key])
          ? Formatter.fromSecondToHour(h[key])
          : dayjs(h[key]);
      }
    });
    return test;
  };

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

  const tagName = () => { };

  const generataColor = () => {
    let randomColor = '#';
    for (let i = 0; i < 6; i++) {
      randomColor += ((16 * Math.random()) | 0).toString(16);
    }
    return randomColor;
  };

  return (
    <BarChart width={1000} height={500} data={reports}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="recordedAt"
        tickFormatter={(recordedAt) => dayjs(recordedAt).format('M/D')}
      />
      {/* オンカーソル時の表示については taskName: HH:mm:ss */}
      <YAxis domain={[0, 86400]} ticks={ticks} tickFormatter={toHour} />
      {/* {chartDatas()} */}

      <Tooltip
        formatter={(value) => dayjs.duration(value * 1000).format('H:mm:ss')}
      />
      <Legend />
      {taskNames().map((tn, idx) => {
        return (
          <Bar key={idx} dataKey={tn} stackId="a" fill={generataColor()}></Bar>
        );
      })}
    </BarChart>
  );
};

TasksPage.propTypes = {
  reports: PropTypes.array,
};
