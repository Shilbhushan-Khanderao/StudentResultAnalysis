import React, { useState, useEffect } from "react";
import { getColumns } from "../config/MarksheetTableConfig";
import { exportToPdf,exportSubjectMarksheetToPdf, exportBatchMarksheetToExcel, exportSubjectMarksheetToExcel } from "../utils/exportUtils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TextField} from "@mui/material";

const MarksheetTable = ({ data, isSubjectWise }) => {
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");
  const [columns, setColumns] = useState([]);

  if (!data || data.length === 0) return <p>No data available.</p>;
  
  useEffect(() => {
    setColumns(getColumns(data));
  }, [data]); 

  const handlePdfExport = () => {
    if (isSubjectWise) {
      exportSubjectMarksheetToPdf(data, mainTitle, subTitle);
    } else {
      exportToPdf(data, mainTitle, subTitle);
    }
  };

  const handleExcelExport = () => {
    if (isSubjectWise) {
      exportSubjectMarksheetToExcel(data);
    } else {
      exportBatchMarksheetToExcel(data);
    }
  };
  

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
        onClick={handlePdfExport}
        style={{ margin: "5px" }}
      >
        Export to PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExcelExport}
        style={{ margin: "5px" }}
      >
        Export to Excel
      </Button>

      <MaterialReactTable table={table} />
    </div>
  );
};

export default MarksheetTable;
