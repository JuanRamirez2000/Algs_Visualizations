"use client";

import Link from "next/link";
import { RadioGroup } from "@headlessui/react";
import { algorithms } from "./_data/algorithms";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function AlgorithmSelection() {
  const searchParams = useSearchParams();
  const selectedAlgorithim = searchParams.get("algorithm");
  const selectedLocation = searchParams.get("location");
  const selectedRange = searchParams.get("range");

  return (
    <RadioGroup
      className="flex flex-col flex-wrap gap-3 items-center w-1/2 max-w-64"
      value={selectedAlgorithim}
    >
      <RadioGroup.Label className="text-3xl">Algorithms</RadioGroup.Label>
      <div className="w-full grid grid-cols-2 gap-4">
        {algorithms.map((algorithm) => (
          <RadioGroup.Option
            value={algorithm.abbreviation}
            key={algorithm.abbreviation}
            className="transition-all rounded-lg hover:scale-105 w-full
          bg-zinc-600 ui-active:bg-sky-600 ui-checked:bg-sky-600"
          >
            <Link
              href={`/?location=${selectedLocation}&range=${selectedRange}&algorithm=${algorithm.abbreviation}`}
              className="flex flex-row items-center justify-between text-center px-4 py-3"
            >
              {algorithm.abbreviation}
              <CpuChipIcon className="h-7 w-7 hidden ui-checked:block" />
            </Link>
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
