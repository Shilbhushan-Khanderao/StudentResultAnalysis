import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Button } from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const MarksheetTable = () => {
    const [marksheet, setMarksheet] = useState([]);

    useEffect(() => {
        fetchMarksheet().then(setMarksheet);
    }, []);

    const getAvailableSubjects = () => {
        const subjects = ["CPP", "OOPJ", "ADS", "DBT", "COSSDM", "WPT", "WJP", ".NET"];
        return subjects.filter(sub =>
            marksheet.some(student => student[sub] && (
                student[sub].TH || student[sub].IA || student[sub].Lab || student[sub].TOT
            ))
        );
    };

    const exportToPdf = () => {
        const doc = new jsPDF("landscape", "pt", "a4");

        doc.setFontSize(18);
        doc.text("Integrated Marksheet", 300, 30);
        doc.setFontSize(10);
        doc.text("PG-DAC AUGUST 2024 | CDAC MUMBAI", 300, 45);

        const subjects = getAvailableSubjects();

        const headRows = [
            ["Student ID", "Student Name", ...subjects.map(sub => ({ content: sub, colSpan: 4, styles: { halign: 'center', fillColor: [200, 200, 255] }})), "TOTAL", "%", "GAC", "Project", "Rank"],
            ["", "", ...subjects.flatMap(() => ["TH", "IA", "LAB", "TOT"]), "", "", "", "", ""]
        ];

        const bodyRows = marksheet.map(student => [
            student["Student ID"], student["Student Name"],
            ...subjects.flatMap(sub => [
                student[sub]?.TH ?? "-", student[sub]?.IA ?? "-", student[sub]?.Lab ?? "-", student[sub]?.TOT ?? "-"
            ]),
            student["Total"] ?? "-", student["Percentage"] ?? "-", student["GAC"] ?? "-", student["Project"] ?? "-", student["Rank"] ?? "-"
        ]);

        autoTable(doc, {
            head: headRows,
            body: bodyRows,
            startY: 60,
            styles: { fontSize: 7, cellPadding: 2, halign: 'center', lineWidth: 0.5, lineColor: [0, 0, 0] },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
            columnStyles: {
                1: { halign: 'left' }
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            didDrawPage: (data) => {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
            }
        });

        doc.save("Integrated_Marksheet.pdf");
    };

    const exportToExcel = () => {
        const subjects = getAvailableSubjects();

        const excelData = marksheet.map(student => {
            const row = {
                "Student ID": student["Student ID"],
                "Student Name": student["Student Name"],
            };

            subjects.forEach(sub => {
                row[`TH`] = student[sub]?.TH ?? "-";
                row[`IA`] = student[sub]?.IA ?? "-";
                row[`LAB`] = student[sub]?.Lab ?? "-";
                row[`TOT`] = student[sub]?.TOT ?? "-";
            });

            row["TOTAL"] = student["Total"] ?? "-";
            row["%"] = student["Percentage"] ?? "-";
            row["GAC"] = student["GAC"] ?? "-";
            row["Project"] = student["Project"] ?? "-";
            row["Rank"] = student["Rank"] ?? "-";

            return row;
        });

        const worksheet = XLSX.utils.json_to_sheet([]);

        // Add subject headers and subheaders in the Excel sheet
        const headerRow1 = ["Student ID", "Student Name", ...subjects.flatMap(sub => [sub, "", "", ""]), "TOTAL", "%", "GAC", "Project", "Rank"];
        const headerRow2 = ["", "", ...subjects.flatMap(() => ["TH", "IA", "LAB", "TOT"]), "", "", "", "", ""];

        XLSX.utils.sheet_add_aoa(worksheet, [headerRow1, headerRow2], { origin: "A1" });

        // Add data rows
        XLSX.utils.sheet_add_json(worksheet, excelData, { origin: -1, skipHeader: true });

        // Merge cells for subject names
        const merges = [];
        let colIndex = 2;
        subjects.forEach(() => {
            merges.push({ s: { r: 0, c: colIndex }, e: { r: 0, c: colIndex + 3 } });
            colIndex += 4;
        });

        worksheet['!merges'] = merges;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Marksheet");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Integrated_Marksheet.xlsx");
    };

    const columns = [
        { accessorKey: "Student ID", header: "Student ID" },
        { accessorKey: "Student Name", header: "Student Name", muiTableBodyCellProps: { align: 'left' } },
        ...getAvailableSubjects().flatMap(sub => [
            { accessorKey: `${sub}-TH`, header: "TH" },
            { accessorKey: `${sub}-IA`, header: "IA" },
            { accessorKey: `${sub}-Lab`, header: "LAB" },
            { accessorKey: `${sub}-TOT`, header: "TOT" }
        ]),
        { accessorKey: "Total", header: "Total" },
        { accessorKey: "%", header: "%" },
        { accessorKey: "GAC", header: "GAC" },
        { accessorKey: "Project", header: "Project" },
        { accessorKey: "Rank", header: "Rank", enableSorting: false, enableHiding: true }
    ];

    const table = useMaterialReactTable({
        columns,
        data: marksheet,
        enableColumnFilters: true,
        enableSorting: true,
        enablePagination: true,
        enableRowSelection: true,
    });

    return (
        <div style={{ maxWidth: "95%", margin: "auto", marginTop: 20 }}>
            <Button variant="contained" color="primary" onClick={exportToPdf} style={{ margin: "5px" }}>
                Export to PDF
            </Button>
            <Button variant="contained" color="secondary" onClick={exportToExcel} style={{ margin: "5px" }}>
                Export to Excel
            </Button>
            <MaterialReactTable table={table} />
        </div>
    );
};

export default MarksheetTable;
