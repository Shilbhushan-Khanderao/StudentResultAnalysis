import React, { useState, useEffect } from "react";
import { getRankingHistory, getRankComparison } from "../api/rankings";
import { Line } from "react-chartjs-2";
import { FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { getStudents } from "../api/students";

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
    const data = await getRankingHistory(selectedStudent);
    console.log("rankingHistoryData - ", data);
    setRankingHistory(data);
  };

  const fetchRankComparison = async () => {
    if (!selectedStudent) return;
    const data = await getRankComparison(selectedStudent);
    console.log("RankComparison - ", data);
    setComparisonData(data);
  };

  const rankingChartData = {
    labels: rankingHistory.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Ranking Over Time",
        data: rankingHistory.map((entry) => entry.newRank),
        fill: false,
        borderColor: "blue",
        tension: 0.2,
      },
    ],
  };

  const comparisonChartData = {
    labels: comparisonData.map((entry) => new Date(entry.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: "Old Rank",
        data: comparisonData.map((entry) => entry.oldRank),
        borderColor: "red",
        fill: false,
        tension: 0.2,
      },
      {
        label: "New Rank",
        data: comparisonData.map((entry) => entry.newRank),
        borderColor: "green",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2>Student Ranking Analysis</h2>

      <FormControl fullWidth>
        <InputLabel>Select Student</InputLabel>
        <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.name} ({student.rollNumber})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={fetchRankingHistory} className="mt-3">
        Show Ranking History
      </Button>

      <Button variant="contained" color="secondary" onClick={fetchRankComparison} className="mt-3 ml-2">
        Compare Rankings
      </Button>

      {rankingHistory.length > 0 && <Line data={rankingChartData} />}
      {comparisonData.length > 0 && <Line data={comparisonChartData} />}
    </div>
  );
};

export default RankingHistoryPage;
