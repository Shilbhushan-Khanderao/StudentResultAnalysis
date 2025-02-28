import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Button, TextField, CircularProgress } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const subjects = ["CPP", "OOPJ", "ADS", "DBT", "COSSDM", "WPT", "WJP", "MS_NET"];

const MarksheetTable = () => {
  const [marksheet, setMarksheet] = useState([]);
  const [mainTitle, setMainTitle] = useState("PG-DAC | CDAC MUMBAI");
  const [subTitle, setSubTitle] = useState("Integrated Marksheet");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMarksheet().then((data) => {
      console.log("Fetched Raw Marksheet Data:", data);
      const sanitizedData = sanitizeMarksheetData(data);
      setMarksheet(sanitizedData);
    });
  }, []);

  // Function to sanitize and flatten the fetched data
  const sanitizeMarksheetData = (data) => {
    return data.map((student) => {
      const sanitizedStudent = {
        "Student ID": student["Student ID"],
        "Student Name": student["Student Name"],
      };

      // Flatten the subject scores
      subjects.forEach((sub) => {
        if (student[sub]) {
          sanitizedStudent[`${sub}_TH`] = student[sub].TH ?? "-";
          sanitizedStudent[`${sub}_IA`] = student[sub].IA ?? "-";
          sanitizedStudent[`${sub}_Lab`] = student[sub].Lab ?? "-";
          sanitizedStudent[`${sub}_TOT`] = student[sub].TOT ?? "-";
        } else {
          sanitizedStudent[`${sub}_TH`] = "-";
          sanitizedStudent[`${sub}_IA`] = "-";
          sanitizedStudent[`${sub}_Lab`] = "-";
          sanitizedStudent[`${sub}_TOT`] = "-";
        }
      });

      return sanitizedStudent;
    });
  };

  const columns = [
    { accessorKey: "Student ID", header: "Student ID" },
    { accessorKey: "Student Name", header: "Student Name", muiTableBodyCellProps: { align: "left" } },
    ...subjects.flatMap((sub) =>
      ["TH", "IA", "Lab", "TOT"].map((type) => ({
        accessorKey: `${sub}_${type}`,
        header: `${sub} ${type}`,
      }))
    ),
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
    setLoading(true);
    const doc = new jsPDF("landscape", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
  
    doc.setFontSize(18);
    doc.text(mainTitle, pageWidth / 2, 30, { align: "center" });
    doc.setFontSize(12);
    doc.text(subTitle, pageWidth / 2, 50, { align: "center" });
  
    // ✅ Identify active subjects (Only include subjects that have marks)
    const activeSubjects = subjects.filter((sub) =>
      marksheet.some((student) =>
        ["TH", "IA", "Lab", "TOT"].some((type) => student[`${sub}_${type}`] !== "-" && student[`${sub}_${type}`] !== undefined)
      )
    );
  
    console.log("Active Subjects:", activeSubjects);
  
    // ✅ First Header Row (Subjects with Merged Cells)
    const firstHeaderRow = [
      { content: "Student ID", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      { content: "Student Name", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      ...activeSubjects.map((sub) => ({
        content: sub,
        colSpan: 4, // Ensures TH, IA, LAB, TOT fit under each subject
        styles: { halign: "center", fillColor: [200, 200, 255], textColor: 0, fontStyle: "bold" },
      })),
      { content: "TOTAL", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      { content: "%", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      { content: "GAC", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      { content: "Project", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
      { content: "Rank", rowSpan: 2, styles: { halign: "center", fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" } },
    ];
  
    // ✅ Second Header Row (Correct Order of Subheaders)
    const secondHeaderRow = [
      "",
      "",
      ...activeSubjects.flatMap(() =>
        ["TH", "IA", "LAB", "TOT"].map((type) => ({
          content: type,
          styles: { halign: "center", fillColor: [220, 220, 220], textColor: 0 }, // Light gray for subheaders
        }))
      ),
      "",
      "",
      "",
      "",
      "",
    ];
  
    // ✅ Prepare Body Data (Ensure the Correct Order for Marks)
    const bodyRows = marksheet.map((student) => [
      student["Student ID"],
      student["Student Name"],
      ...activeSubjects.flatMap((sub) =>
        ["TH", "IA", "LAB", "TOT"].map((type) => student[`${sub}_${type}`] ?? "-") // Ensure the correct order
      ),
      student["Total"] ?? "-",
      student["Percentage"] ?? "-",
      student["GAC"] ?? "-",
      student["Project"] ?? "-",
      student["Rank"] ?? "-",
    ]);
  
    // ✅ Generate PDF Table
    autoTable(doc, {
      head: [firstHeaderRow, secondHeaderRow],
      body: bodyRows,
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 4, // Increased padding for better readability
        halign: "center",
        valign: "middle",
        lineWidth: 0.5,
        lineColor: [0, 0, 0], // Black borders for all cells
      },
      headStyles: {
        fillColor: [41, 128, 185], // Blue Headers
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [245, 245, 245] }, // Light gray for alternate rows
      columnStyles: {
        1: { halign: "left" }, // Align Student Name to the left
      },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(
          `Page ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });
  
    // ✅ Save the PDF
    doc.save(`Integrated_Marksheet_${new Date().toISOString().slice(0, 10)}.pdf`);
    setLoading(false);
  };
  

  const exportToExcel = () => {
    setLoading(true);
    const excelData = marksheet.map((student) => {
      let row = {
        "Student ID": student["Student ID"],
        "Student Name": student["Student Name"],
      };
      subjects.forEach((sub) => {
        ["TH", "IA", "Lab", "TOT"].forEach((type) => {
          row[`${sub} - ${type}`] = student[`${sub}_${type}`] ?? "-";
        });
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
    XLSX.writeFile(workbook, `Integrated_Marksheet_${new Date().toISOString().slice(0, 10)}.xlsx`);
    setLoading(false);
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
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : "Export to PDF"}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={exportToExcel}
        style={{ margin: "5px" }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={20} /> : "Export to Excel"}
      </Button>

      {marksheet.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold" }}>
        Loading or No Data Available
      </p>
      ) : (
        <MaterialReactTable columns={columns} data={marksheet} enablePagination={false} />
      )}
    </div>
  );
};

export default MarksheetTable;
