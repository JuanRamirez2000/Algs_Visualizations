import Link from "next/link";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <section className="w-full h-full bg-zinc-800 flex flex-col items-center text-zinc-100 py-20 gap-10">
      <h2 className="text-3xl">Locations</h2>
      <ul className="flex flex-col gap-3 items-center w-1/2 ">
        <li
          className={`transition-all rounded-lg hover:scale-105 ${
            searchParams.location === "los_angeles"
              ? "bg-sky-600"
              : "bg-zinc-600"
          }`}
        >
          <Link
            href={"/?location=los_angeles"}
            className="flex flex-row items-center justify-between text-center px-4 py-3"
          >
            Los Angeles
          </Link>
        </li>
        <li
          className={`transition-all rounded-lg hover:scale-105 ${
            searchParams.location === "san_francisco"
              ? "bg-sky-600"
              : "bg-zinc-600"
          }`}
        >
          <Link
            href={"/?location=san_francisco"}
            className="flex flex-row items-center justify-between text-center px-4 py-3 "
          >
            San Francisco
          </Link>
        </li>
        <li
          className={`transition-all rounded-lg hover:scale-105 ${
            searchParams.location === "new_york" ? "bg-sky-600" : "bg-zinc-600"
          }`}
        >
          <Link
            href={"/?location=new_york"}
            className="flex flex-row items-center justify-between text-center px-4 py-3 "
          >
            New York
          </Link>
        </li>
      </ul>
    </section>
  );
}
