import { useEffect, useState } from "react";
import { fetchMarksheet } from "../api/marks";
import { getBatches } from "../api/batches";
import { subjects } from "../config/MarksheetTableConfig";

export const useMarksheet = (batchId) => {
  const [marksheet, setMarksheet] = useState([]);
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    getBatches().then(setBatches);
  }, []);

  useEffect(() => {
    if (batchId) {
      fetchMarksheet(batchId).then((data) => {
        const flattenedData = data.map((student) => {

          const flatStudent = {
            "Student ID": student["Student ID"],
            "Student Name": student["Student Name"],
          };

          subjects.forEach((sub) => {
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

        setMarksheet(flattenedData);
      });
    }
  }, [batchId]);

  return { marksheet, batches };
};
