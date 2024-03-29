"use client";
import { Tab } from "@headlessui/react";
import ExampleMap from "./ExampleMap";
import { useState } from "react";

export default function HowItWorks() {
  const [highlightedLayer, setHighlightedLayer] = useState<string>("baseLayer");
  return (
    <section className="h-screen w-full flex flex-row items-center justify-center gap-6">
      <div className="h-1/2 w-1/3 flex flex-col justify-center">
        <Tab.Group
          defaultIndex={0}
          onChange={(idx) => {
            if (idx === 0) {
              setHighlightedLayer("baseLayer");
            }
            if (idx === 1) {
              setHighlightedLayer("exploredLayer");
            }
            if (idx === 2) {
              setHighlightedLayer("solutionLayer");
            }
          }}
        >
          <Tab.List className="flex gap-2 rounded-xl bg-base-950/40 p-1">
            <Tab className="w-full rounded-lg py-2.5 text-md font-medium ui-selected:bg-primary-500 transition-all duration-200">
              Base Layer
            </Tab>
            <Tab className="w-full rounded-lg py-2.5 text-md font-medium ui-selected:bg-primary-500 transition-all duration-200">
              Explored Layer
            </Tab>
            <Tab className="w-full rounded-lg py-2.5 text-md font-medium ui-selected:bg-primary-500 transition-all duration-200">
              Solution Layer
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="p-6 bg-base-950/40 rounded-xl text-lg h-52">
              <h2 className="font-semibold text-lg underline">
                Waypoints, Intersections, and Road Traffic
              </h2>
              <p className="mt-6 max-w-md leading-relaxed">
                Used to display the original data gathered from Open Street
                Maps. This layer shows the origin and destination, street
                intersections, and road traffic.
              </p>
            </Tab.Panel>
            <Tab.Panel className="p-6 bg-base-950/40 rounded-xl text-lg h-52">
              <h2 className="font-semibold text-lg underline">
                Explored Nodes
              </h2>
              <p className="mt-6 max-w-md leading-relaxed">
                Displays the nodes that have been explored by the algorithm.
                These nodes are part of the solution space
              </p>
            </Tab.Panel>
            <Tab.Panel className="p-6 bg-base-950/40 rounded-xl text-lg h-52">
              <h2 className="font-semibold text-lg underline">Solution Path</h2>
              <p className="mt-6 max-w-md leading-relaxed">
                The solution path that the algorithm found. For most algorithms
                this will be the most optimal solution
              </p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <div className="h-1/2 w-2/5">
        <ExampleMap highlightedLayer={highlightedLayer} />
      </div>
    </section>
  );
}
