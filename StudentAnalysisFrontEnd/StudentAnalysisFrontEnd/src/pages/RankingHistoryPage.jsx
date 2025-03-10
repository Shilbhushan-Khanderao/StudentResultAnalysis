import React, { useState, useEffect } from "react";
import { getRankingHistory, getRankComparison } from "../api/rankings";
import { Line } from "react-chartjs-2";
import {
  MenuItem,
  Button,
  TextField,
} from "@mui/material";
import { getStudents } from "../api/students";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RankingHistoryPage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [rankingHistory, setRankingHistory] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);

  useEffect(() => {
    // Fetch students list for dropdown
    getStudents().then(setStudents);
  }, []);

  const fetchRankingHistory = async () => {
    if (!selectedStudent) return;
    try {
      const data = await getRankingHistory(selectedStudent);
      console.log("Ranking History = ", data);
      setRankingHistory(data);
    } catch (error) {
      console.error("Error fetching ranking history:", error);
    }
  };

  const fetchRankComparison = async () => {
    if (!selectedStudent) return;
    try {
      const data = await getRankComparison(selectedStudent);
      console.log("Rank Comparison = ", data);
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching rank comparison:", error);
    }
  };

  const rankingChartData = {
    labels: rankingHistory.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Ranking Over Time",
        data: rankingHistory.map((entry) => entry.newRank),
        fill: false,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.5)",
        tension: 0.2,
      },
    ],
  };

  const comparisonChartData = {
    labels: comparisonData.map((entry) =>
      new Date(entry.timestamp).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Old Rank",
        data: comparisonData.map((entry) => entry.oldRank),
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.5)",
        fill: false,
        tension: 0.2,
      },
      {
        label: "New Rank",
        data: comparisonData.map((entry) => entry.newRank),
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2>Student Ranking Analysis</h2>
      <TextField
        select
        label="Select Student"
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
        variant="outlined"
        style={{ margin: "5px", width: "200px" }}
      >
        {students.map((student) => (
          <MenuItem key={student.id} value={student.id}>
            {student.name} ({student.rollNumber})
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchRankingHistory}
        className="mt-3"
      >
        Show Ranking History
      </Button>

      <Button
        variant="contained"
        color="secondary"
        onClick={fetchRankComparison}
        className="mt-3 ms-2"
      >
        Compare Rankings
      </Button>

      {rankingHistory.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Ranking History</h4>
          <Line data={rankingChartData} />
        </div>
      )}
      {comparisonData.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h4>Rank Comparison</h4>
          <Line data={comparisonChartData} />
        </div>
      )}
    </div>
  );
};

export default RankingHistoryPage;
