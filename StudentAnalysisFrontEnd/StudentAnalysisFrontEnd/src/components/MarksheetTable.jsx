import React, { useState } from "react";
import { useMarksheet } from "../hooks/useMarksheet";
import { getColumns } from "../config/MarksheetTableConfig";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

const MarksheetTable = () => {
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");
  const [batchId, setBatchId] = useState("");

  const { marksheet, batches } = useMarksheet(batchId);

  const table = useMaterialReactTable({
    columns: getColumns(),
    data: marksheet,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    muiTableProps: { sx: { border: "1px solid rgba(224, 224, 224, 1)" } },
  });

  return (
    <div style={{ maxWidth: "95%", margin: "auto", marginTop: 20 }}>
      <TextField
        select
        label="Select Batch"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
        variant="outlined"
        style={{ margin: "5px", width: "200px" }}
      >
        {batches.map((batch) => (
          <MenuItem key={batch.id} value={batch.id}>
            {batch.batchName}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Main Title"
        value={mainTitle}
        onChange={(e) => setMainTitle(e.target.value)}
        style={{ margin: "5px", width: "300px" }}
      />
      <TextField
        label="Sub Title"
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
        style={{ margin: "5px", width: "300px" }}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={() => exportToPdf(marksheet, mainTitle, subTitle)}
        style={{ margin: "5px" }}
      >
        Export to PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => exportToExcel(marksheet)}
        style={{ margin: "5px" }}
      >
        Export to Excel
      </Button>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default MarksheetTable;
