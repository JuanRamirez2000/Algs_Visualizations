"use client";

import Link from "next/link";
import { RadioGroup } from "@headlessui/react";
import { algorithms } from "../_data/algorithms";
import { CpuChipIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function AlgorithmSelection() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const selectedAlgorithm = searchParams.get("algorithm");
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <RadioGroup
      className="flex flex-col flex-wrap gap-3 items-center w-1/2 max-w-64"
      value={selectedAlgorithm}
    >
      <RadioGroup.Label className="text-3xl">Algorithms</RadioGroup.Label>
      <div className="w-fit flex flex-col lg:grid lg:grid-cols-2 gap-4 items-center justify-center">
        {algorithms.map((algorithm) => (
          <RadioGroup.Option
            value={algorithm.abbreviation}
            key={algorithm.abbreviation}
            className="transition-all rounded-lg hover:scale-105 w-24
          bg-base-600 ui-active:bg-primary-600 ui-checked:bg-primary-600 px-3 py-3"
          >
            <Link
              href={
                pathName +
                "?" +
                createQueryString("algorithm", algorithm.abbreviation)
              }
              className="flex flex-row items-center justify-around"
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
