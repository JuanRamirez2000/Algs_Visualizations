"use client";

import Link from "next/link";
import { RadioGroup } from "@headlessui/react";
import { locations } from "./_data/locations";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";

export default function LocationSelection() {
  const searchParams = useSearchParams();
  const selectedLocation = searchParams.get("location");
  const selectedAlgorithim = searchParams.get("algorithm");

  return (
    <RadioGroup
      className="flex flex-col gap-3 items-center w-1/2"
      value={selectedLocation}
      defaultValue={"santa_ana"}
    >
      <RadioGroup.Label className="text-3xl">Locations</RadioGroup.Label>
      {locations.map((location) => (
        <RadioGroup.Option
          value={location.name}
          key={location.name}
          className="transition-all rounded-lg hover:scale-105 w-full
           bg-zinc-600 ui-active:bg-sky-600 ui-checked:bg-sky-600"
        >
          <Link
            href={`/?location=${location.name}&algorithm=${selectedAlgorithim}`}
            className="flex flex-row items-center justify-between text-center px-4 py-3"
          >
            {location.displayName}
            <MapPinIcon className="h-7 w-7 hidden ui-checked:block" />
          </Link>
        </RadioGroup.Option>
      ))}
    </RadioGroup>
  );
}
