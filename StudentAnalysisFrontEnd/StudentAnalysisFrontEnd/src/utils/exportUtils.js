import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { subjects } from "../config/MarksheetTableConfig";

export const exportToPdf = (marksheet, mainTitle, subTitle) => {
  const doc = new jsPDF("landscape", "pt", "a4");
  doc.setFontSize(18);
  doc.text(mainTitle, doc.internal.pageSize.getWidth() / 2, 30, { align: "center" });
  doc.setFontSize(12);
  doc.text(subTitle, doc.internal.pageSize.getWidth() / 2, 50, { align: "center" });

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
      lineWidth: 0.5, 
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      lineColor: [0, 0, 0],
      lineWidth: 0.5, 
    },
    bodyStyles: {
      lineColor: [0, 0, 0], 
    },
    tableLineColor: [0, 0, 0], 
    tableLineWidth: 0.5, 
    columnStyles: {
      1: { halign: "left" },
    },
  });


  doc.save("Integrated_Marksheet.pdf");
};

export const exportToExcel = () => {
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

    const merges = [];

    let colIndex = 2;
    subjects.forEach(() => {

      merges.push({
        s: { r: 0, c: colIndex },
        e: { r: 0, c: colIndex + 3 },
      });
      colIndex += 4;
    });

    worksheet["!merges"] = merges;

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet");

    XLSX.writeFile(workbook, "Integrated_Marksheet.xlsx");
  };
