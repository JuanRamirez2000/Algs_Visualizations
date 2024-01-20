"use client";

import Link from "next/link";
import {
  ArrowUpRightIcon,
  CodeBracketSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import parseData from "../helpers/parseOsm";

export default function Controls({
  traverseGraph,
}: {
  traverseGraph: () => void;
}) {
  return (
    <div className="flex flex-row w-full max-w-64 gap-4 justify-center">
      <Link
        href={""}
        className="w-1/2 p-4 bg-base-600 rounded-lg transition-all hover:scale-105 hover:bg-primary-600 inline-flex flex-row items-center justify-center gap-4"
      >
        Info <ArrowUpRightIcon className="h-5 w-5" />
      </Link>
      <button
        className="w-1/2 p-4 bg-base-600 rounded-lg transition-all hover:scale-105 hover:bg-primary-600 inline-flex flex-row items-center justify-center gap-4"
        onClick={() => parseData()}
      >
        Parse <CodeBracketSquareIcon className="h-6 w-6" />
      </button>
      <button
        className="w-1/2 p-4 bg-base-600 rounded-lg transition-all hover:scale-105 hover:bg-primary-600 inline-flex flex-row items-center justify-center gap-4"
        onClick={traverseGraph}
      >
        Run <SparklesIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
