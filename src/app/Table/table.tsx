"use client";

import {
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Table as NTable } from "@nextui-org/table";
import { useEffect, useState } from "react";

interface Activity {
  activity: string;
  availability: number;
  type: string;
  participants: number;
  price: number;
  accessibility: string;
  duration: string;
  kidFriendly: boolean;
  link: string;
  key: string;
}

interface Column {
  key: keyof Activity;
  label: string;
}

const getKeyValue = (row: Activity, columnKey: keyof Activity) => {
  return row[columnKey];
};

export default function Table() {
  const [data, setData] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  const columns: Column[] = [
    { key: 'activity', label: 'Activity' },
    { key: 'availability', label: 'Availability' },
    { key: 'type', label: 'Type' },
    { key: 'participants', label: 'Participants' },
    { key: 'price', label: 'Price' },
    { key: 'accessibility', label: 'Accessibility' },
    { key: 'duration', label: 'Duration' },
    { key: 'kidFriendly', label: 'Kid Friendly' },
    { key: 'link', label: 'Link' },
    { key: 'key', label: 'Key' },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch('/api/fetch', { cache: 'no-store' });
      const act: Activity[] = await response.json();
      setData(act);
    } catch (error) {
      setError('Failed to fetch data. Too many request.');
      console.error('Error fetching data:', error);
    }
  };

  const downloadJSON = () => {
    if (data.length === 0) return;
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activities.json";
    link.click();
  };

  const downloadCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((column) => column.label).join(",");
    const values = data.map((item) =>
      columns.map((column) => JSON.stringify(item[column.key])).join(",")
    );
    const csv = [headers, ...values].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "activities.csv";
    link.click();
  };
  useEffect(() => {
    fetchData();
  }, []);

  const printToConsole = () => {
    console.log(data);
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center">THINGS TO DO WHEN BORED</h1>
      <NTable className="py-6" aria-label="Activities Table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.key}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {column.key === 'kidFriendly'
                    ? row[column.key] ? 'Yes' : 'No'
                    : getKeyValue(row, column.key)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </NTable>
      <div className="flex flex-row gap-4">
        <button
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={fetchData}
        >
          Fetch Activities
        </button>
        <button
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={downloadJSON}
          disabled={data.length === 0}
        >
          Download JSON
        </button>
        <button
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={downloadCSV}
          disabled={data.length === 0}
        >
          Download CSV
        </button>
        <button
          className="text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          onClick={printToConsole}
          disabled={data.length === 0}
        >
          Print to Console
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </>
  );
}
