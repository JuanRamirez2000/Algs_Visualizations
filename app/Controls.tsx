import Link from "next/link";
import {
  InformationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function Controls() {
  return (
    <div className="flex flex-row w-1/2 max-w-64 gap-4">
      <Link
        href={""}
        className="w-1/2 p-4 bg-zinc-600 rounded-lg transition-all hover:scale-105 hover:bg-sky-600  inline-flex flex-row items-center justify-center gap-4"
      >
        Info <InformationCircleIcon className="h-6 w-6" />
      </Link>
      <button className="w-1/2 p-4 bg-zinc-600 rounded-lg transition-all hover:scale-105 hover:bg-sky-600 inline-flex flex-row items-center justify-center gap-4">
        Run <SparklesIcon className="h-6 w-6" />
      </button>
    </div>
  );
}
