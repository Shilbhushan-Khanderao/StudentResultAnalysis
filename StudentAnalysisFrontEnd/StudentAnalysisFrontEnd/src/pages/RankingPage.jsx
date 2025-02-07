import React, { useEffect, useState } from "react";
import {
  getIALabRanks,
  getTHIALabRanks,
  calculateRanks,
} from "../api/rankings";
import Table from "../components/Table";
import Alert from "../components/Alert";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";

const RankingPage = () => {
  const [rankings, setRankings] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [rankType, setRankType] = useState("IA_LAB"); // Default rank type

  useEffect(() => {
    fetchRankings();
  }, [rankType]);

  const fetchRankings = async () => {
    try {
      let data;
      if (rankType === "IA_LAB") {
        data = await getIALabRanks();
      } else {
        data = await getTHIALabRanks();
      }
      setRankings(data);
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
        <ToggleButton value="IA_LAB">IA + LAB Rank</ToggleButton>
        <ToggleButton value="TH_IA_LAB">TH + IA + LAB Rank</ToggleButton>
      </ToggleButtonGroup>

      <Button
        variant="contained"
        color="primary"
        className="mb-3"
        onClick={handleCalculateRanks}
      >
        Calculate Rankings
      </Button>

      <Table
        columns={[
          { field: "rank", headerName: "Rank", width: 100 },
          { field: "oldRank", headerName: "Old Rank", width: 100 },
          { field: "studentName", headerName: "Student Name", width: 250 },
          { field: "percentage", headerName: "Percentage", width: 150 },
        ]}
        rows={rankings.map((ranking) => ({
          id: ranking.id, // Ensure unique ID
          rank: ranking.currentRank,
          oldRank: ranking.oldRank,
          studentName: ranking.student.name,
          percentage: ranking.percentage.toFixed(2) + "%",
        }))}
      />
    </div>
  );
};

export default RankingPage;
