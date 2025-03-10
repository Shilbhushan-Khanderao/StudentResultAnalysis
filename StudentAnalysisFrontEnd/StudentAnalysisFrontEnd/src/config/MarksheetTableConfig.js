export const subjectsList = [
  "CPP",
  "OOPJ",
  "ADS",
  "DBT",
  "COSSDM",
  "WPT",
  "WJP",
  "MS.NET",
];

export const getColumns = (data) => {
  if (!data || data.length === 0) return [];

  const baseColumns = [
    { accessorKey: "Student ID", header: "Student ID" },
    { accessorKey: "Student Name", header: "Student Name" },
  ];

  const subjectColumns = Object.keys(data[0])
    .filter((key) => key.includes("_TH") || key.includes("_IA") || key.includes("_Lab") || key.includes("_TOT"))
    .map((subject) => ({
      accessorKey: subject,
      header: subject.replace(/_/g, " "),
    }));

  const extraColumns = [
    { accessorKey: "Total", header: "Total" },
    { accessorKey: "Percentage", header: "%" },
    { accessorKey: "GAC", header: "GAC" },
    { accessorKey: "Project", header: "Project" },
    { accessorKey: "Rank", header: "Rank" },
  ];

  return [...baseColumns, ...subjectColumns, ...extraColumns];
};
