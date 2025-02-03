import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Chart = ({ type, data, options }) => {
    const ChartType = type === 'bar' ? Bar : Line;
    return <ChartType data={data} options={options} />;
};

export default Chart;
