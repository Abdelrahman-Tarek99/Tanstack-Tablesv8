import { DateTime } from "luxon";
import { useMemo } from "react";
import "./App.css";
import mData from "./MOCK_DATA .json";
import BasicTable from "./components/BasicTable";

function App() {
  const data = useMemo(() => mData, []);

  // /** @type import('@tanstack/react-table').ColumnDef<any> */
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
      footer: "ID",
      enableColumnFilter: false,
    },
    {
      header: "Name",
      columns: [
        {
          header: "First",
          accessorKey: "first_name",
          footer: "First name",
          enableColumnFilter: true,
        },
        {
          header: "Last",
          accessorKey: "last_name",
          footer: "Last name",
          enableColumnFilter: false,
        },
      ],
    },
    // {
    //   header: 'Name',
    //   accessorFn: row => `${row.first_name} ${row.last_name}`,
    // },
    // {
    //   header: 'First name',
    //   accessorKey: 'first_name',
    //   footer: 'First name',
    // },
    // {
    //   header: 'Last name',
    //   accessorKey: 'last_name',
    //   footer: 'Last name',
    // },
    {
      header: "Email",
      accessorKey: "email",
      footer: "Email",
      enableColumnFilter: false,
    },
    {
      header: "Gender",
      accessorKey: "gender",
      footer: "Gender",
      enableColumnFilter: false,
    },
    {
      header: "Date of birth",
      accessorKey: "dob",
      footer: "Date of birth",
      enableColumnFilter: false,

      cell: (info) =>
        DateTime.fromISO(info.getValue()).toLocaleString(DateTime.DATE_MED),
    },
  ];

  return (
    <>
      <h1>React-table</h1>
      <BasicTable data={data} columns={columns} />
    </>
  );
}

export default App;
