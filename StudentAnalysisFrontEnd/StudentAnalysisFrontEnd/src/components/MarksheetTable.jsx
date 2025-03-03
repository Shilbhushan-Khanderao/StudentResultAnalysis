import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getBatches } from "../api/batches";

const MarksheetTable = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");


  // Define subjects outside useEffect to use consistently throughout the component
  const subjects = [
    "CPP",
    "OOPJ",
    "ADS",
    "DBT",
    "COSSDM",
    "WPT",
    "WJP",
    "MS.NET",
  ];

  useEffect(() => {
    // Fetch batches when the component loads
    getBatches().then(setBatches);
  }, []);

  useEffect(() => {
    if(batchId){
    fetchMarksheet(batchId).then((data) => {
      console.log("Fetched Marksheet:", data);

      // Flatten the nested structure to match our column definitions
      const flattenedData = data.map((student) => {
        // Create a new flattened object for the student
        const flatStudent = {
          "Student ID": student["Student ID"],
          "Student Name": student["Student Name"],
        };

        // Flatten subject data
        subjects.forEach((sub) => {
          // Check if the subject exists in the student data
          if (student[sub]) {
            flatStudent[`${sub.replace(".", "_")}_TH`] = student[sub].TH;
            flatStudent[`${sub.replace(".", "_")}_IA`] = student[sub].IA;
            flatStudent[`${sub.replace(".", "_")}_Lab`] = student[sub].Lab;
            flatStudent[`${sub.replace(".", "_")}_TOT`] = student[sub].TOT;
          }
        });

        // Calculate total and percentage if not already in the data
        if (!student.Total) {
          let total = 0;
          subjects.forEach((sub) => {
            if (student[sub] && student[sub].TOT) {
              total += student[sub].TOT;
            }
          });
          flatStudent["Total"] = total;
          flatStudent["Percentage"] = (
            (total / (subjects.length * 100)) *
            100
          ).toFixed(2);
        } else {
          flatStudent["Total"] = student.Total;
          flatStudent["Percentage"] = student.Percentage;
        }

        // Add other fields if they exist
        flatStudent["GAC"] = student.GAC || "";
        flatStudent["Project"] = student.Project || "";
        flatStudent["Rank"] = student.Rank || "";

        return flatStudent;
      });

      setMarksheet(flattenedData);
    });
  }
  }, [batchId]);

  // Create columns based on the same subjects array
  const columns = [
    { accessorKey: "Student ID", header: "Student ID" },
    {
      accessorKey: "Student Name",
      header: "Student Name",
      muiTableBodyCellProps: { align: "left" },
    },
    ...subjects.flatMap((sub) => {
      const sanitizedSub = sub.replace(".", "_");
      return [
        { accessorKey: `${sanitizedSub}_TH`, header: `${sub} TH` },
        { accessorKey: `${sanitizedSub}_IA`, header: `${sub} IA` },
        { accessorKey: `${sanitizedSub}_Lab`, header: `${sub} LAB` },
        { accessorKey: `${sanitizedSub}_TOT`, header: `${sub} TOT` },
      ];
    }),
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
    // Add table border styling
    muiTableProps: {
      sx: {
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
    muiTableHeadCellProps: {
      sx: {
        border: "1px solid rgba(224, 224, 224, 1)",
        fontWeight: "bold",
        backgroundColor: "#f5f5f5",
      },
    },
    muiTableBodyCellProps: {
      sx: {
        border: "1px solid rgba(224, 224, 224, 1)",
      },
    },
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
      ...subjects.flatMap((sub) => {
        const sanitizedSub = sub.replace(".", "_");
        return [
          student[`${sanitizedSub}_TH`] ?? "-",
          student[`${sanitizedSub}_IA`] ?? "-",
          student[`${sanitizedSub}_Lab`] ?? "-",
          student[`${sanitizedSub}_TOT`] ?? "-",
        ];
      }),
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
      styles: {
        fontSize: 7,
        cellPadding: 2,
        halign: "center",
        lineWidth: 0.5, // Add border width
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        lineColor: [0, 0, 0],
        lineWidth: 0.5, // Add border width
      },
      bodyStyles: {
        lineColor: [0, 0, 0], // Add border color
      },
      tableLineColor: [0, 0, 0], // Add table border color
      tableLineWidth: 0.5, // Add table border width
      columnStyles: {
        1: { halign: "left" }, // Align Student Name to the left
      },
    });

    doc.save("Integrated_Marksheet.pdf");
  };

  const exportToExcel = () => {
    // Create an array to hold our Excel data with the same structure as the PDF
    const headerRow1 = ["Student ID", "Student Name"];

    // Add subject headers with merged cells (represented by empty strings for Excel)
    subjects.forEach((sub) => {
      headerRow1.push(sub, "", "", "");
    });

    // Add the remaining headers
    headerRow1.push("TOTAL", "%", "GAC", "Project", "Rank");

    // Create the second header row
    const headerRow2 = [
      "", // Empty cells for Student ID and Student Name
      "",
    ];

    // Add the sub-headers for each subject
    subjects.forEach(() => {
      headerRow2.push("TH", "IA", "LAB", "TOT");
    });

    // Add empty cells for the remaining headers
    headerRow2.push("", "", "", "", "");

    // Create data rows
    const dataRows = marksheet.map((student) => {
      const row = [student["Student ID"], student["Student Name"]];

      // Add subject data
      subjects.forEach((sub) => {
        const sanitizedSub = sub.replace(".", "_");
        row.push(
          student[`${sanitizedSub}_TH`] ?? "-",
          student[`${sanitizedSub}_IA`] ?? "-",
          student[`${sanitizedSub}_Lab`] ?? "-",
          student[`${sanitizedSub}_TOT`] ?? "-"
        );
      });

      // Add remaining data
      row.push(
        student["Total"] ?? "-",
        student["Percentage"] ?? "-",
        student["GAC"] ?? "-",
        student["Project"] ?? "-",
        student["Rank"] ?? "-"
      );

      return row;
    });

    // Combine all rows for the worksheet
    const allRows = [headerRow1, headerRow2, ...dataRows];

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(allRows);

    // Set column widths
    const columnWidths = [
      { wch: 15 }, // Student ID
      { wch: 20 }, // Student Name
    ];

    // Add column widths for subjects (4 columns each)
    subjects.forEach(() => {
      for (let i = 0; i < 4; i++) {
        columnWidths.push({ wch: 8 });
      }
    });

    // Add column widths for remaining columns
    columnWidths.push(
      { wch: 10 }, // Total
      { wch: 8 }, // %
      { wch: 8 }, // GAC
      { wch: 10 }, // Project
      { wch: 8 } // Rank
    );

    worksheet["!cols"] = columnWidths;

    // Add merged cells for subject headers
    const merges = [];

    // Start with column C (index 2) for the first subject
    let colIndex = 2;
    subjects.forEach(() => {
      // Merge 4 cells horizontally for each subject header (in first row)
      merges.push({
        s: { r: 0, c: colIndex },
        e: { r: 0, c: colIndex + 3 },
      });
      colIndex += 4;
    });

    worksheet["!merges"] = merges;

    // Set cell styles (add borders to all cells)
    // Note: XLSX.js has limited styling capabilities compared to PDF

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet");

    // Apply some basic styling
    // Note: Excel styling is limited with XLSX.js
    // For more advanced styling, consider using ExcelJS library

    XLSX.writeFile(workbook, "Integrated_Marksheet.xlsx");
  };

  return (
    <div style={{ maxWidth: "95%", margin: "auto", marginTop: 20 }}>
      <FormControl style={{ margin: "5px", width: "200px" }}>
        <InputLabel>Select Batch</InputLabel>
        <Select
          value={batchId}
          onChange={(e) => setBatchId(e.target.value)}
        >
          {batches.map((batch) => (
            <MenuItem key={batch.id} value={batch.id}>
              {batch.batchName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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

      <MaterialReactTable table={table} />
    </div>
  );
};

export default MarksheetTable;
