import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TextField } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
    {
      accessorKey: "Student Name",
      header: "Student Name",
      muiTableBodyCellProps: { align: "left" },
    },
    ...subjects.flatMap((sub) => [
      { accessorKey: `${sub}_TH`, header: `${sub} TH` },
      { accessorKey: `${sub}_IA`, header: `${sub} IA` },
      { accessorKey: `${sub}_Lab`, header: `${sub} LAB` },
      { accessorKey: `${sub}_TOT`, header: `${sub} TOT` },
    ]),
    { accessorKey: "Total", header: "Total" },
    { accessorKey: "Percentage", header: "%" },
    { accessorKey: "GAC", header: "GAC" },
    { accessorKey: "Project", header: "Project" },
    { accessorKey: "Rank", header: "Rank" },
  ];

  const table = useMaterialReactTable({
    columns,
    data: marksheet,
    enableColumnFilters: true,
    enableSorting: true,
    enablePagination: true,
    enableRowSelection: true,
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
    <div style={{ maxWidth: "95%", margin: "auto", marginTop: 20 }}>
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

      <MaterialReactTable
        columns={columns}
        data={marksheet}
        enablePagination={false}
      />
    </div>
  );
};

export default MarksheetTable;
