import React, { useEffect, useState } from "react";
import {
  getBatchPerformance,
  getTopPerformers,
  getSubjectAverages,
} from "../api/analytics";
import Chart from "../components/Chart";
import Table from "../components/Table";
import Loader from "../components/Loader";
import Alert from "../components/Alert";

const AnalyticsDashboard = () => {
  const [batchPerformance, setBatchPerformance] = useState(null);
  const [topPerformers, setTopPerformers] = useState([]);
  const [subjectAverages, setSubjectAverages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchData, performersData, subjectData] = await Promise.all([
          getBatchPerformance(),
          getTopPerformers(1, 5), // Fetch top 5 performers for batch ID 1 (example)
          getSubjectAverages(),
        ]);
        setBatchPerformance(batchData);
        setTopPerformers(performersData);
        setSubjectAverages(subjectData);
      } catch (err) {
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="container mt-5">
      <h2>Analytics Dashboard</h2>

      {/* Batch Performance */}
      <div className="mb-5">
        <h4>Batch-Wise Performance</h4>
        {batchPerformance && (
          <Chart
            type="bar"
            data={{
              labels: Object.keys(batchPerformance),
              datasets: [
                {
                  label: "Average Marks",
                  data: Object.values(batchPerformance),
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        )}
      </div>

      {/* Top Performers */}
      <div className="mb-5">
        <h4>Top Performers</h4>
        <Table
          columns={[
            { field: "rank", headerName: "Rank", width: 100 },
            { field: "name", headerName: "Student Name", width: 250 },
            { field: "percentage", headerName: "Percentage", width: 150 },
          ]}
          rows={topPerformers.map((performer, index) => ({
            id: index + 1,
            rank: performer.rank,
            name: performer.student.name,
            percentage: performer.percentage,
          }))}
        />
      </div>

      {/* Subject-Wise Averages */}
      <div className="mb-5">
        <h4>Subject-Wise Averages</h4>
        {subjectAverages && (
          <Chart
            type="bar"
            data={{
              labels: Object.keys(subjectAverages),
              datasets: [
                {
                  label: "Average Marks",
                  data: Object.values(subjectAverages),
                  backgroundColor: "rgba(153, 102, 255, 0.6)",
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
