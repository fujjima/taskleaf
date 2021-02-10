import React, { useState, useRef, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import PropTypes from 'prop-types';
// import ImmutablePropTypes from 'react-immutable-proptypes';
import { duration } from 'dayjs';
import { TasksPage } from '../TasksPage/TasksPage';
import { Unstable_TrapFocus } from '@material-ui/core';

export const ReportsPage = (props) => {
  const reports = props.reports;

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
      <XAxis dataKey="recordedAt" />
      <YAxis />

      <Tooltip />
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
