"use client";

import Link from "next/link";
import {
  ArrowUpRightIcon,
  CodeBracketSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import parseData from "../_helpers/parseOsm";
import { useSearchParams } from "next/navigation";

export default function Controls({
  traverseGraph,
}: {
  traverseGraph: () => void;
}) {
  const searchParams = useSearchParams();
  const algorithmSelected = searchParams.get("algorithm");

  return (
    <div className="flex flex-col w-full max-w-64 gap-4 justify-center items-center">
      <h2 className="text-3xl">Controls</h2>
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
        <Link
          href={""}
          className="w-28 p-4 bg-base-600 rounded-lg transition-all hover:scale-105 hover:bg-primary-600 inline-flex flex-row items-center justify-center gap-4"
        >
          Info <ArrowUpRightIcon className="h-5 w-5" />
        </Link>
        <button
          className="w-28 p-4 bg-base-600 rounded-lg transition-all hover:scale-105 hover:bg-primary-600 inline-flex flex-row items-center justify-center gap-4"
          onClick={() => parseData()}
        >
          Parse <CodeBracketSquareIcon className="h-6 w-6" />
        </button>
        <button
          className="w-28 p-4 bg-base-600 rounded-lg enabled:transition-all enabled:hover:scale-105 enabled:hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed inline-flex flex-row items-center justify-center gap-4"
          onClick={traverseGraph}
          disabled={!algorithmSelected}
        >
          Run <SparklesIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
