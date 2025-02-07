import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartComponent = ({ type, data, options }) => {
  const ChartType = type === "bar" ? Bar : Line;
  return <ChartType data={data} options={options} />;
};

export default ChartComponent;
