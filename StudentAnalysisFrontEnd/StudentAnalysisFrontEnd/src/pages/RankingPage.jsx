import React, { useEffect, useState } from "react";
import {
  getLeaderboard,
  getBatchRankings,
  calculateRanks,
} from "../api/rankings";
import Table from "../components/Table";
import Alert from "../components/Alert";
import { Button, ToggleButton, ToggleButtonGroup, TextField } from "@mui/material";

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rankType, setRankType] = useState("leaderboard"); // Default ranking type
  const [batchId, setBatchId] = useState(""); // For batch-wise rankings

  useEffect(() => {
    fetchRankings();
  }, [rankType, batchId]);

  const fetchRankings = async () => {
    try {
      let data;
      if (rankType === "leaderboard") {
        data = await getLeaderboard(10); // Fetch top 10 students
      } else if (rankType === "batch" && batchId) {
        data = await getBatchRankings(batchId);
      }
      setRankings(data || []);
    } catch (err) {
      setError("Failed to fetch rankings.");
    }
  };

  const handleCalculateRanks = async () => {
    try {
      await calculateRanks();
      setMessage("Ranks calculated successfully.");
      fetchRankings();
    } catch (err) {
      setError("Failed to calculate rankings.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ranking Management</h2>
      {message && <Alert type="success" message={message} />}
      {error && <Alert type="error" message={error} />}

      {/* Toggle Buttons for Rank Type Selection */}
      <ToggleButtonGroup
        value={rankType}
        exclusive
        onChange={(event, newType) => {
          if (newType) setRankType(newType);
        }}
        aria-label="ranking type"
        className="mb-3"
      >
        <ToggleButton value="leaderboard">Leaderboard</ToggleButton>
        <ToggleButton value="batch">Batch-wise Ranking</ToggleButton>
      </ToggleButtonGroup>

      {/* Batch ID Input Field */}
      {rankType === "batch" && (
        <TextField
          label="Batch ID"
          variant="outlined"
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
          className="mb-3"
        />
      )}

      {/* Button to Calculate Rankings */}
      <Button
        variant="contained"
        color="primary"
        className="mb-3"
        onClick={handleCalculateRanks}
      >
        Calculate Rankings
      </Button>

      {/* Ranking Table */}
      <Table
        columns={[
          { field: "rank", headerName: "Rank", width: 100 },
          { field: "oldRank", headerName: "Old Rank", width: 100 },
          { field: "studentName", headerName: "Student Name", width: 250 },
          { field: "percentage", headerName: "Percentage", width: 150 },
        ]}
        rows={rankings.map((ranking, index) => ({
          id: ranking.id || index, // Ensure unique ID
          rank: ranking.currentRank,
          oldRank: ranking.oldRank ?? "-",
          studentName: ranking.student?.name || "Unknown",
          percentage: ranking.percentage ? `${ranking.percentage.toFixed(2)}%` : "-",
        }))}
      />
    </div>
  );
};

export default RankingPage;
