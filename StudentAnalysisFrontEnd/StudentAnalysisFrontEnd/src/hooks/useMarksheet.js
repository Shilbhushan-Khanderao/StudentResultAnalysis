import { useEffect, useState } from "react";
import { fetchMarksheet, fetchMarksheetForSubjects } from "../api/marks";
import { getBatches } from "../api/batches";
import { getSubjects } from "../api/subjects";
import { subjectsList } from "../config/MarksheetTableConfig";

export const useMarksheet = (batchId) => {
  const [marksheet, setMarksheet] = useState([]);
  const [batches, setBatches] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    getBatches().then(setBatches);
    getSubjects().then(setSubjects);
  }, []);

  const fetchBatchMarksheet = async (batchId) => {
    if (!batchId) return;
    try {
      await fetchMarksheet(batchId).then((data) => {
        console.log("Whole Marksheet Data", data);
        const flattenedData = data.map((student) => {
          const flatStudent = {
            "Student ID": student["Student ID"],
            "Student Name": student["Student Name"],
          };

          subjectsList.forEach((sub) => {
            if (student[sub]) {
              flatStudent[`${sub}_TH`] = student[sub].TH || "-";
              flatStudent[`${sub}_IA`] = student[sub].IA || "-";
              flatStudent[`${sub}_Lab`] = student[sub].Lab || "-";
              flatStudent[`${sub}_TOT`] = student[sub].TOT || "-";
            }
          });

          flatStudent["Total"] = student.Total || 0;
          flatStudent["Percentage"] = student.Percentage || "0.00";
          flatStudent["GAC"] = student.GAC || "-";
          flatStudent["Project"] = student.Project || "-";
          flatStudent["Rank"] = student.Rank || "-";

          return flatStudent;
        });
        console.log("Flattened Marksheet Data", flattenedData);
        setMarksheet(flattenedData);
      });
    } catch (error) {
      console.error("Error fetching batch marksheet:", error);
    }
  };

  const fetchSubjectMarksheet = async (batchId, subjectIds) => {
    if (!batchId || subjectIds.length === 0) return;
    try {
      const data = await fetchMarksheetForSubjects(batchId, subjectIds);
      console.log("Subject-Wise API Response:", data);

      const availableSubjects = Object.keys(data[0]).filter(
        (key) => key !== "Student ID" && key !== "Student Name" && key !== "Total" && key !== "Percentage" && key !== "GAC" && key !== "Project" && key !== "Rank"
      );
  
      const flattenedData = data.map((student) => {
        const flatStudent = {
          "Student ID": student["Student ID"],
          "Student Name": student["Student Name"],
        };
  
        availableSubjects.forEach((sub) => {
          if (student[sub]) {
            flatStudent[`${sub}_TH`] = student[sub].TH || "-";
            flatStudent[`${sub}_IA`] = student[sub].IA || "-";
            flatStudent[`${sub}_Lab`] = student[sub].Lab || "-";
            flatStudent[`${sub}_TOT`] = student[sub].TOT || "-";
          }
        });
  
        flatStudent["Total"] = student.Total || 0;
        flatStudent["Percentage"] = student.Percentage || "0.00";
        flatStudent["GAC"] = student.GAC || "-";
        flatStudent["Project"] = student.Project || "-";
        flatStudent["Rank"] = student.Rank || "-";
  
        return flatStudent;
      });
  
      console.log("Flattened Subject-Wise Marksheet Data", flattenedData);
      setMarksheet(flattenedData);
    } catch (error) {
      console.error("Error fetching subject-wise marksheet:", error);
    }
  };

  return {
    marksheet,
    batches,
    subjects,
    fetchBatchMarksheet,
    fetchSubjectMarksheet,
  };
};
