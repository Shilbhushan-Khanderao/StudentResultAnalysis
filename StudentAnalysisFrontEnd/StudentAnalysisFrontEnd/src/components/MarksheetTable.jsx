import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Paper } from "@mui/material";

const MarksheetTable = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");

  useEffect(() => {
    fetchMarksheet().then((data) => {
      console.log("Fetched Marksheet:", data);

      // Sanitize keys if there are dots in them (e.g., MS.NET -> MS_NET)
      const sanitizedData = data.map((student) => {
        const sanitizedStudent = {};
        for (let key in student) {
          const sanitizedKey = key.replace(/\./g, "_");
          sanitizedStudent[sanitizedKey] = student[key];
        }
        return sanitizedStudent;
      });
      setMarksheet(sanitizedData);
    });
  }, []);

  const subjects = ["CPP", "OOPJ", "ADS", "DBT", "COSSDM", "WPT", "WJP", "MS_NET"];

  const columns = [
    { accessorKey: "Student ID", header: "Student ID" },
    { accessorKey: "Student Name", header: "Student Name" },
    {
      header: "Subjects",
      columns: subjects.flatMap((sub) => [
        { accessorKey: `${sub}_TH`, header: "TH" },
        { accessorKey: `${sub}_IA`, header: "IA" },
        { accessorKey: `${sub}_Lab`, header: "LAB" },
        { accessorKey: `${sub}_TOT`, header: "TOT" },
      ]),
    },
    { accessorKey: "Total", header: "TOTAL" },
    { accessorKey: "Percentage", header: "%" },
    { accessorKey: "GAC", header: "GAC" },
    { accessorKey: "Project", header: "Project" },
    { accessorKey: "Rank", header: "Rank" },
  ];
  

  const table = useReactTable({
    data: marksheet,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const exportToPdf = () => {
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.text(mainTitle, pageWidth / 2, 30, { align: "center" });
    doc.setFontSize(12);
    doc.text(subTitle, pageWidth / 2, 50, { align: "center" });

    const headRows = [
      [
        "Student ID",
        "Student Name",
        ...subjects.map((sub) => ({
          content: sub,
          colSpan: 4,
          styles: { halign: "center", fillColor: [200, 200, 255] },
        })),
        "TOTAL",
        "%",
        "GAC",
        "Project",
        "Rank",
      ],
      [
        "",
        "",
        ...subjects.flatMap(() => ["TH", "IA", "LAB", "TOT"]),
        "",
        "",
        "",
        "",
        "",
      ],
    ];

    const bodyRows = marksheet.map((student) => [
      student["Student ID"],
      student["Student Name"],
      ...subjects.flatMap((sub) => [
        student[`${sub}_TH`] ?? "-",
        student[`${sub}_IA`] ?? "-",
        student[`${sub}_Lab`] ?? "-",
        student[`${sub}_TOT`] ?? "-",
      ]),
      student["Total"] ?? "-",
      student["Percentage"] ?? "-",
      student["GAC"] ?? "-",
      student["Project"] ?? "-",
      student["Rank"] ?? "-",
    ]);

    autoTable(doc, {
      head: headRows,
      body: bodyRows,
      startY: 60,
      styles: { fontSize: 7, cellPadding: 2, halign: "center" },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save("Integrated_Marksheet.pdf");
  };

  const exportToExcel = () => {
    const excelData = marksheet.map((student) => {
      const row = {
        "Student ID": student["Student ID"],
        "Student Name": student["Student Name"],
      };

      subjects.forEach((sub) => {
        row[`${sub} - TH`] = student[`${sub}_TH`] ?? "-";
        row[`${sub} - IA`] = student[`${sub}_IA`] ?? "-";
        row[`${sub} - LAB`] = student[`${sub}_Lab`] ?? "-";
        row[`${sub} - TOT`] = student[`${sub}_TOT`] ?? "-";
      });

      row["TOTAL"] = student["Total"] ?? "-";
      row["%"] = student["Percentage"] ?? "-";
      row["GAC"] = student["GAC"] ?? "-";
      row["Project"] = student["Project"] ?? "-";
      row["Rank"] = student["Rank"] ?? "-";

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet");
    XLSX.writeFile(workbook, "Integrated_Marksheet.xlsx");
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", padding: 2 }}>
      <TextField
        label="Main Title"
        variant="outlined"
        value={mainTitle}
        onChange={(e) => setMainTitle(e.target.value)}
        style={{ margin: "5px", width: "300px" }}
      />
      <TextField
        label="Sub Title"
        variant="outlined"
        value={subTitle}
        onChange={(e) => setSubTitle(e.target.value)}
        style={{ margin: "5px", width: "300px" }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={exportToPdf}
        style={{ margin: "5px" }}
      >
        Export to PDF
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={exportToExcel}
        style={{ margin: "5px" }}
      >
        Export to Excel
      </Button>

      <TableContainer sx={{ maxHeight: 800, marginTop: 2 }}>
        <Table stickyHeader>
          <TableHead>
            {/* First Header Row (Main Categories) */}
            <TableRow sx={{ backgroundColor: "#2980b9", color: "white" }}>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>Student ID</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>Student Name</TableCell>
              {subjects.map((sub) => (
                <TableCell key={sub} colSpan={4} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>
                  {sub}
                </TableCell>
              ))}
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>TOTAL</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>%</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>GAC</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>Project</TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>Rank</TableCell>
            </TableRow>
            {/* Second Header Row (Sub Categories) */}
            <TableRow sx={{ backgroundColor: "#2980b9", color: "white" }}>
              {subjects.flatMap(() => ["TH", "IA", "LAB", "TOT"].map((type) => (
                <TableCell key={type} sx={{ textAlign: "center", fontWeight: "bold", color: "white", backgroundColor: "#2980b9" }}>
                  {type}
                </TableCell>
              )))}
            </TableRow>
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} sx={{ textAlign: "center" }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={table.getPrePaginationRowModel().rows.length} // Total rows count
        rowsPerPage={table.getState().pagination.pageSize} // Rows per page
        page={table.getState().pagination.pageIndex} // Current page
        onPageChange={(event, newPage) => table.setPageIndex(newPage)} // Set new page
        onRowsPerPageChange={(event) => table.setPageSize(Number(event.target.value))} // Set rows per page
      />
    </Paper>
  );
};

export default MarksheetTable;
