import React from "react";
import { DataGrid } from "@mui/x-data-grid";
const Table = ({ columns, rows }) => (
  <div style={{ height: 400, width: "100%" }}>
    <DataGrid rows={rows} columns={columns} />
  </div>
);

export default Table;
