import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { subjectsList } from "../config/MarksheetTableConfig";

export const exportToPdf = (marksheet, mainTitle, subTitle) => {
  const doc = new jsPDF("landscape", "pt", "a4");
  doc.setFontSize(18);
  doc.text(mainTitle, doc.internal.pageSize.getWidth() / 2, 30, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text(subTitle, doc.internal.pageSize.getWidth() / 2, 50, {
    align: "center",
  });

  const headRows = [
    [
      "Student ID",
      "Student Name",
      ...subjectsList.map((sub) => ({
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
      ...subjectsList.flatMap(() => ["TH", "IA", "LAB", "TOT"]),
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
    ...subjectsList.flatMap((sub) => {
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

export const exportSubjectMarksheetToPdf = (marksheet, mainTitle, subTitle) => {
  if (!marksheet || marksheet.length === 0) {
    console.error("No data available for PDF export.");
    return;
  }

  const doc = new jsPDF("portrait", "pt", "a4");
  doc.setFontSize(18);
  doc.text(mainTitle, doc.internal.pageSize.getWidth() / 2, 30, {
    align: "center",
  });
  doc.setFontSize(12);
  doc.text(subTitle, doc.internal.pageSize.getWidth() / 2, 50, {
    align: "center",
  });

  // Extract selected subjects dynamically from the first student object
  const availableSubjects = [
    ...new Set(
      Object.keys(marksheet[0])
        .filter(
          (key) =>
            key.includes("_TH") ||
            key.includes("_IA") ||
            key.includes("_Lab") ||
            key.includes("_TOT")
        )
        .map((key) => key.split("_")[0])
    ),
  ];

  console.log(
    "Subjects included in Subject-Wise Marksheet:",
    availableSubjects
  );

  const headRows = [
    [
      "Student ID",
      "Student Name",
      ...availableSubjects.map((sub) => ({
        content: sub,
        colSpan: 4,
        styles: { halign: "center", fillColor: [200, 200, 255] },
      })),
    ],
    ["", "", ...availableSubjects.flatMap(() => ["TH", "IA", "LAB", "TOT"])],
  ];

  const bodyRows = marksheet.map((student) => [
    student["Student ID"],
    student["Student Name"],
    ...availableSubjects.flatMap((sub) => [
      student[`${sub}_TH`] ?? "-",
      student[`${sub}_IA`] ?? "-",
      student[`${sub}_Lab`] ?? "-",
      student[`${sub}_TOT`] ?? "-",
    ]),
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

  doc.save("Subject_Wise_Marksheet.pdf");
};

export const exportBatchMarksheetToExcel = (data) => {
  if (!data || data.length === 0) {
    console.error("No data available for Excel export.");
    return;
  }

  // Create the first header row with subjects and extra columns
  const headerRow1 = ["Student ID", "Student Name"];

  subjectsList.forEach((sub) => {
    headerRow1.push(sub, "", "", "");
  });

  // Add extra columns
  headerRow1.push("TOTAL", "%", "GAC", "Project", "Rank");

  // Create the second header row for sub-columns
  const headerRow2 = ["", ""]; // Empty cells for Student ID and Student Name

  subjectsList.forEach(() => {
    headerRow2.push("TH", "IA", "LAB", "TOT");
  });

  headerRow2.push("", "", "", "", ""); // Empty placeholders for extra columns

  // Create data rows
  const dataRows = data.map((student) => {
    const row = [student["Student ID"], student["Student Name"]];

    subjectsList.forEach((sub) => {
      const sanitizedSub = sub.replace(".", "_");
      row.push(
        student[`${sanitizedSub}_TH`] ?? "-",
        student[`${sanitizedSub}_IA`] ?? "-",
        student[`${sanitizedSub}_Lab`] ?? "-",
        student[`${sanitizedSub}_TOT`] ?? "-"
      );
    });

    // Add extra columns
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

  subjectsList.forEach(() => {
    for (let i = 0; i < 4; i++) {
      columnWidths.push({ wch: 8 });
    }
  });

  columnWidths.push(
    { wch: 10 }, // Total
    { wch: 8 }, // %
    { wch: 8 }, // GAC
    { wch: 10 }, // Project
    { wch: 8 } // Rank
  );

  worksheet["!cols"] = columnWidths;

  // Merge subject headers
  const merges = [];
  let colIndex = 2;
  subjectsList.forEach(() => {
    merges.push({
      s: { r: 0, c: colIndex },
      e: { r: 0, c: colIndex + 3 },
    });
    colIndex += 4;
  });

  worksheet["!merges"] = merges;

  // Create workbook and save
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Batch Marksheet");

  XLSX.writeFile(workbook, "Batch_Wise_Marksheet.xlsx");
};

export const exportSubjectMarksheetToExcel = (marksheet) => {
  if (!marksheet || marksheet.length === 0) {
    console.error("No data available for Excel export.");
    return;
  }

  // Extract subjects dynamically from data keys
  const availableSubjects = [
    ...new Set(
      Object.keys(marksheet[0])
        .filter(
          (key) =>
            key.includes("_TH") ||
            key.includes("_IA") ||
            key.includes("_Lab") ||
            key.includes("_TOT")
        )
        .map((key) => key.split("_")[0])
    ),
  ];

  console.log(
    "Subjects included in Subject-Wise Marksheet:",
    availableSubjects
  );

  // Create first header row
  const headerRow1 = ["Student ID", "Student Name"];
  availableSubjects.forEach((sub) => {
    headerRow1.push(sub, "", "", "");
  });

  // Create second header row (TH, IA, LAB, TOT)
  const headerRow2 = ["", ""];
  availableSubjects.forEach(() => {
    headerRow2.push("TH", "IA", "LAB", "TOT");
  });

  // Create data rows
  const dataRows = marksheet.map((student) => {
    const row = [student["Student ID"], student["Student Name"]];

    availableSubjects.forEach((sub) => {
      row.push(
        student[`${sub}_TH`] ?? "-",
        student[`${sub}_IA`] ?? "-",
        student[`${sub}_Lab`] ?? "-",
        student[`${sub}_TOT`] ?? "-"
      );
    });

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

  availableSubjects.forEach(() => {
    for (let i = 0; i < 4; i++) {
      columnWidths.push({ wch: 8 });
    }
  });

  worksheet["!cols"] = columnWidths;

  // Merge subject headers
  const merges = [];
  let colIndex = 2;
  availableSubjects.forEach(() => {
    merges.push({
      s: { r: 0, c: colIndex },
      e: { r: 0, c: colIndex + 3 },
    });
    colIndex += 4;
  });

  worksheet["!merges"] = merges;

  // Create workbook and save
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Subject Marksheet");

  XLSX.writeFile(workbook, "Subject_Wise_Marksheet.xlsx");
};
