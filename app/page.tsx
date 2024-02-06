"use client";
import { Tab } from "@headlessui/react";
import ExampleMap from "./ExampleMap";
import { useState } from "react";

export default function Home() {
  const [highlightedLayer, setHighlightedLayer] = useState<string>("baseLayer");
  return (
    <section className="h-screen w-screen">
      <div className="h-full w-full flex flex-row">
        <div className="h-full w-1/2 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
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
                <Tab.Panel className="p-4 bg-base-950/40 rounded-xl text-lg h-48">
                  <h2 className="font-semibold text-lg underline">
                    Waypoints, Intersections, and Road Traffic
                  </h2>
                  <p className="mt-6">
                    Used to display the original data gathered from Open Street
                    Maps. This layer shows the origin and destination, street
                    intersections, and road traffic.
                  </p>
                </Tab.Panel>
                <Tab.Panel className="p-4 bg-base-950/40 rounded-xl text-lg h-48">
                  <h2 className="font-semibold text-lg underline">
                    Explored Nodes
                  </h2>
                  <p className="mt-6">
                    Displays the nodes that have been explored by the algorithm.
                    These nodes are part of the solution space
                  </p>
                </Tab.Panel>
                <Tab.Panel className="p-4 bg-base-950/40 rounded-xl text-lg h-48">
                  <h2 className="font-semibold text-lg underline">
                    Solution Path
                  </h2>
                  <p className="mt-6">
                    The solution path that the algorithm found. For most
                    algorithms this will be the most optimal solution
                  </p>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div className="h-full w-1/2 flex flex-col items-center justify-center">
          <div className="h-1/2 w-5/6 flex flex-col">
            <ExampleMap highlightedLayer={highlightedLayer} />
          </div>
        </div>
      </div>
    </section>
  );
}
