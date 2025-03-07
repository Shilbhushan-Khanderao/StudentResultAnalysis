import React, { useState } from "react";
import { useMarksheet } from "../hooks/useMarksheet";
import { getColumns } from "../config/MarksheetTableConfig";
import { exportToPdf, exportToExcel } from "../utils/exportUtils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TextField, MenuItem } from "@mui/material";

const MarksheetTable = ({ data }) => {
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");

  if (!data || data.length === 0) return <p>No data available.</p>;
  const columns = getColumns(data);

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    muiTableProps: { sx: { border: "1px solid rgba(224, 224, 224, 1)" } },
  });

  return (
    <div style={{ maxWidth: "95%", margin: "auto", marginTop: 20 }}>
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
        onClick={() => exportToPdf(data, mainTitle, subTitle)}
        style={{ margin: "5px" }}
      >
        Export to PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => exportToExcel(data)}
        style={{ margin: "5px" }}
      >
        Export to Excel
      </Button>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default MarksheetTable;
