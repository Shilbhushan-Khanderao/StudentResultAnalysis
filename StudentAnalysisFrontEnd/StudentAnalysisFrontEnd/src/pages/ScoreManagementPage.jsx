import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import UploadMarks from "../components/UploadMarks";
import DeleteScores from "../components/DeleteScores";
import { useMarksheet } from "../hooks/useMarksheet";
import MarksheetTable from "../components/MarksheetTable";

const ScoreManagementPage = () => {
  const [tab, setTab] = useState(0);
  const {
    marksheet,
    batches,
    subjects,
    fetchBatchMarksheet,
    fetchSubjectMarksheet,
  } = useMarksheet();

  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  return (
    <div className="container">
      <Typography variant="h4" sx={{ textAlign: "center", my: 2 }}>
        Score Management
      </Typography>

      <Tabs value={tab} onChange={(e, val) => setTab(val)} centered>
        <Tab label="Upload Marks" />
        <Tab label="Upload Multiple Subjects" />
        <Tab label="Upload Project & GAC Grades" />
        <Tab label="Delete Scores" />
        <Tab label="Integrated Marksheet" />
        <Tab label="Subject Marksheet" />
      </Tabs>

      <Box mt={3}>
        <TextField
          select
          label="Select Batch"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {batches.map((batch) => (
            <MenuItem key={batch.id} value={batch.id}>
              {batch.batchName}
            </MenuItem>
          ))}
        </TextField>
        {tab === 0 && <UploadMarks type="marks" />}
        {tab === 1 && <UploadMarks type="multiple-marks" />}
        {tab === 2 && <UploadMarks type="project-gac" />}
        {tab === 3 && <DeleteScores />}
        {tab === 4 && (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => fetchBatchMarksheet(selectedBatch)}
            >
              Fetch Batch Marksheet
            </Button>
            {/* Display Marksheet */}
            {marksheet.length > 0 && <MarksheetTable data={marksheet} />}
          </>
        )}
        {tab === 5 && (
          <>
            {/* Subject Selection for Subject-Wise Marksheet */}
            <TextField
              select
              label="Select Subjects"
              value={selectedSubjects}
              onChange={(e) => setSelectedSubjects(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              SelectProps={{ multiple: true }}
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </TextField>

            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                fetchSubjectMarksheet(selectedBatch, selectedSubjects)
              }
            >
              Fetch Subject-Wise Marksheet
            </Button>
            {marksheet.length > 0 && (
              <MarksheetTable data={marksheet} isSubjectWise={tab === 5} />
            )}
          </>
        )}
      </Box>
    </div>
  );
};

export default ScoreManagementPage;
