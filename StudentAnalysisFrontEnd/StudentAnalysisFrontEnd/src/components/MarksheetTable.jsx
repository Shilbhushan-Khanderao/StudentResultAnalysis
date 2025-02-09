import React, { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const MAX_MARKS = { TH: 40, IA: 20, Lab: 40, TOT: 100 }; // Define maximum marks

const MarksheetTable = () => {
    const [marksheet, setMarksheet] = useState([]);

    useEffect(() => {
        fetchMarksheet().then(setMarksheet);
    }, []);

    const subjects = marksheet.length > 0 ? Object.keys(marksheet[0]).filter(key => key !== "Student ID" && key !== "Student Name") : [];

    // Function to check failing condition
    const isFail = (score, type) => type !== "TOT" && type !== "TH" && score < (MAX_MARKS[type] * 0.4); // Less than 40% of max marks

    return (
        <TableContainer component={Paper} sx={{ maxWidth: "95%", margin: "auto", marginTop: 4, border: "2px solid #000" }}>
            <Typography variant="h6" align="center" gutterBottom sx={{ padding: 2, fontWeight: "bold" }}>
                Integrated Marksheet
            </Typography>
            <Table>
                <TableHead>
                    {/* Main Subject Header Row */}
                    <TableRow sx={{ backgroundColor: "#FFD700", border: "2px solid black" }}>
                        <TableCell sx={{ border: "2px solid black", fontWeight: "bold", textAlign: "center" }}>Student ID</TableCell>
                        <TableCell sx={{ border: "2px solid black", fontWeight: "bold", textAlign: "center" }}>Student Name</TableCell>
                        {subjects.map((subject) => (
                            <TableCell key={subject} colSpan={4} align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>
                                {subject}
                            </TableCell>
                        ))}
                    </TableRow>
                    
                    {/* Sub Headers for TH, IA, Lab, TOT */}
                    <TableRow sx={{ backgroundColor: "#FFA500", border: "2px solid black" }}>
                        {["Student ID", "Student Name", ...subjects.flatMap(() => ["TH", "IA", "Lab", "TOT"])].map((header, index) => (
                            <TableCell key={index} align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>
                                {header}
                            </TableCell>
                        ))}
                    </TableRow>

                    {/* Maximum Marks Row (Below the Header Row) */}
                    <TableRow sx={{ backgroundColor: "#FFC107", border: "2px solid black" }}>
                        <TableCell sx={{ border: "2px solid black", fontWeight: "bold", textAlign: "center" }}>Marks ={">"}</TableCell>
                        <TableCell sx={{ border: "2px solid black" }}></TableCell>
                        {subjects.map((subject, index) => (
                            <React.Fragment key={subject + index}>
                                <TableCell align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>{MAX_MARKS.TH}</TableCell>
                                <TableCell align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>{MAX_MARKS.IA}</TableCell>
                                <TableCell align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>{MAX_MARKS.Lab}</TableCell>
                                <TableCell align="center" sx={{ border: "2px solid black", fontWeight: "bold" }}>{MAX_MARKS.TOT}</TableCell>
                            </React.Fragment>
                        ))}
                    </TableRow>
                </TableHead>
                
                <TableBody>
                    {marksheet.map((student, index) => (
                        <TableRow key={index} sx={{ border: "2px solid black" }}>
                            <TableCell sx={{ border: "2px solid black", fontWeight: "bold" }}>{student["Student ID"]}</TableCell>
                            <TableCell sx={{ border: "2px solid black", fontWeight: "bold" }}>{student["Student Name"]}</TableCell>
                            {subjects.map((subject, subIndex) => (
                                <React.Fragment key={subject + subIndex}>
                                    {["TH", "IA", "Lab", "TOT"].map((type) => (
                                        <TableCell
                                            key={type}
                                            align="center"
                                            sx={{
                                                border: "2px solid black",
                                                color: isFail(student[subject]?.[type], type) ? "red" : "black",
                                                fontWeight: isFail(student[subject]?.[type], type) ? "bold" : "normal",
                                                backgroundColor: isFail(student[subject]?.[type], type) ? "#FFCCCC" : "transparent"
                                            }}
                                        >
                                            {student[subject]?.[type] || "-"}
                                        </TableCell>
                                    ))}
                                </React.Fragment>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default MarksheetTable;
