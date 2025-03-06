export const subjects = [
  "CPP",
  "OOPJ",
  "ADS",
  "DBT",
  "COSSDM",
  "WPT",
  "WJP",
  "MS.NET",
];

export const getColumns = () => [
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
