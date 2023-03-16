import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { faker } from '@faker-js/faker';
import { UserAgentProps } from '@/services/interface';
import moment from 'moment';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '유저 최근 글 방문 데이터',
      },
    },
    ticks: {
      // forces step size to be 50 units
      stepSize: 1
    }
};

const Chart = ({ agent }: { agent: UserAgentProps[] }) => {

  function getCurrentWeek() {
    const day = new Date();
    const sunday = day.getTime() - 86400000 * day.getDay();

    day.setTime(sunday);

    const result = [day.toISOString().slice(0, 10)];

    for (let i = 1; i < 7; i++) {
      day.setTime(day.getTime() + 86400000);
      result.push(day.toISOString().slice(0, 10));
    }

    return result;
  }

  const getWeek = getCurrentWeek();

  // console.log(getWeek.map(item => agent.filter(data => moment(data.updatedAt).format("YYYY-MM-DD") === item).length))

  const [userData] = useState({
    labels: getWeek,
    datasets: [{
      label: "User Data",
      data: getWeek.map(item => agent.filter(data => moment(data.updatedAt).format("YYYY-MM-DD") === item).length)
    }]
  })

    return <Line options={options} data={userData} />;
}

export default Chart;