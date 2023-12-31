"use client";

import Link from "next/link";
import { RadioGroup } from "@headlessui/react";
import { locations } from "./_data/locations";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

type Range = "short" | "medium" | "long";
const ranges: Range[] = ["short", "medium", "long"];

export default function LocationSelection() {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const selectedLocation = searchParams.get("location");
  const selectedRange = searchParams.get("range");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <>
      <RadioGroup
        className="flex flex-col gap-3 items-center w-1/2 max-w-64"
        value={selectedLocation}
        defaultValue={"santa_ana"}
      >
        <RadioGroup.Label className="text-3xl">Locations</RadioGroup.Label>
        {locations.map((location) => (
          <RadioGroup.Option
            value={location.name}
            key={location.name}
            className="transition-all rounded-lg hover:scale-105 w-full
          bg-base-600 ui-active:bg-primary-600 ui-checked:bg-primary-600"
          >
            <Link
              href={
                pathName + "?" + createQueryString("location", location.name)
              }
              className="flex flex-row items-center justify-between text-center px-4 py-3"
            >
              {location.displayName}
              <MapPinIcon className="h-7 w-7 hidden ui-checked:block" />
            </Link>
          </RadioGroup.Option>
        ))}
      </RadioGroup>
      <RadioGroup
        className="flex flex-col gap-3 items-center w-1/2 max-w-64"
        value={selectedRange}
        defaultValue={"medium"}
      >
        <RadioGroup.Label className="text-3xl">Range</RadioGroup.Label>
        <div className="flex flex-row gap-2">
          {ranges.map((range) => (
            <RadioGroup.Option
              value={range}
              key={range}
              className="transition-all rounded-lg hover:scale-105 w-full
            bg-base-600 ui-active:bg-primary-600 ui-checked:bg-primary-600"
            >
              <Link
                href={pathName + "?" + createQueryString("range", range)}
                className="flex flex-row items-center justify-between text-center px-4 py-3"
              >
                {range}
                <MapPinIcon className="h-7 w-7 hidden ui-checked:block" />
              </Link>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </>
  );
}
