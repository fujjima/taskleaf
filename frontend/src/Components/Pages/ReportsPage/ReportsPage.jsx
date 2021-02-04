import React, { useState, useRef, useContext, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import { Stack, Animation } from '@devexpress/dx-react-chart';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { duration } from 'dayjs';

export const ReportsPage = (props) => {
  const generateDateSet = () => {
    // from api
    // [{ recordedAt: re, item.id, item.name, workigTime }]
    // front data
    // [{ recordedAt: re, [item.name]:  }]
    return;
  };

  const energyConsumption = [
    {
      country: 'USA',
      datas: { hydro: 59.8, oil: 937.6, gas: 582 },
    },
    {
      country: 'China',
      datas: { hydro: 80, oil: 800.6, gas: 350 },
    },
    {
      country: 'Russia',
      datas: { hydro: 30, oil: 400, gas: 1200 },
    },
  ];

  return (
    <Chart data={energyConsumption}>
      <ArgumentAxis />
      <ValueAxis max={2400} />

      {/* デフォルトは直近一週間分 */}
      {/* BarSeries：縦軸に積み上げられる要素 */}
      {/* <BarSeries name={item.name} valueField={item.workingTime} argumentField={item.recorded_at} /> */}
      {energyConsumption.map((e) => {
        return (
          <>
            <BarSeries
              name="Hydro-electric"
              valueField="hydro"
              argumentField="country"
            />
            <BarSeries
              name="Oil"
              // key名？
              valueField="oil"
              argumentField="country"
            />
            <BarSeries
              name="Natural gas"
              valueField="gas"
              argumentField="country"
            />
          </>
        );
      })}
      <Animation />
      {/* <Legend position="bottom" rootComponent={Root} labelComponent={Label} /> */}
      <Legend position="bottom" />
      <Title text="作業時間" />
      {/* stacks：seriesに対して配列を指定すると、指定された要素が一つのグラフ内に積み上がる */}
      <Stack
        stacks={[
          {
            series: ['Hydro-electric', 'Oil', 'Natural gas'],
          },
        ]}
      />
    </Chart>
  );
};
