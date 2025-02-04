import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const Table = ({ columns, rows }) => {
return (
<div style={{ height: 400, width: "100%" }}>
<DataGrid
rows={rows}
columns={columns}
pageSize={5}
rowsPerPageOptions={[5, 10, 20]}
/>
</div>
);
};

export default Table;
