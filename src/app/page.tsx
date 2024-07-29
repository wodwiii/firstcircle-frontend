import Image from "next/image";
import Table from "./Table/table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-[10vw]">
      <Table/>
    </main>
  );
}
