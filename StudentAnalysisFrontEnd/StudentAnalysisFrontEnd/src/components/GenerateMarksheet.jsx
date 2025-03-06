import React, { useState, useEffect } from "react";
import { fetchMarksheetForSubjects } from "../api/marks";
import { getBatches } from "../api/batches";
import { getSubjects } from "../api/subjects";
import { Typography, Box } from "@mui/material";

const GenerateMarksheet = () => {
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [marksheet, setMarksheet] = useState([]);

  useEffect(() => {
    getBatches().then(setBatches);
    getSubjects().then(setSubjects);
  }, []);

  const handleFetchMarksheet = async () => {
    const data = await fetchMarksheetForSubjects(
      selectedBatch,
      selectedSubjects
    );
    setMarksheet(data);
  };

  return (
    <Box>
      <Typography variant="h6">Generate Marksheet</Typography>
      <pre>{JSON.stringify(marksheet, null, 2)}</pre>
    </Box>
  );
};

export default GenerateMarksheet;
