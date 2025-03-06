import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import UploadMarks from "../components/UploadMarks";
import DeleteScores from "../components/DeleteScores";
import MarksheetTable from "../components/MarksheetTable";

const ScoreManagementPage = () => {
  const [tab, setTab] = useState(0);

  return (
    <div className="container">
      <Typography variant="h4" sx={{ textAlign: "center", my: 2 }}>
        Score Management
      </Typography>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="Upload Marks" />
        <Tab label="Delete Scores" />
        <Tab label="Generate Marksheet" />
      </Tabs>

      <Box mt={3}>
        {tab === 0 && <UploadMarks />}
        {tab === 1 && <DeleteScores />}
        {tab === 2 && <MarksheetTable />}
      </Box>
    </div>
  );
};

export default ScoreManagementPage;
