"use client";

import AlgorithmSelection from "./AlgorithmSelection";
import Controls from "./Controls";
import LocationSelection from "./LocationSelection";
import MapContainer from "./MapContainer";
import data from "../_data/test.json";
import { useState } from "react";
import { ScatterplotLayer } from "@deck.gl/layers/typed";
import { Node } from "../helpers/parseOsm";
import { useSearchParams } from "next/navigation";

//const initialNodeIDs = [122804252, 1925338334];
const destination = 1927365565;
const origin = 1925338334;
const initialNodeIDs = [origin];

export default function Home() {
  const [graph, _] = useState<Node[]>(
    //@ts-ignore
    Object.keys(data).map((key) => data[key])
  );
  const searchParams = useSearchParams();
  const selectedAlgorithm = searchParams.get("algorithm");

  const [visitedIDs, setDisplayNodeIDs] = useState<number[]>(initialNodeIDs);

  const nodesLayer = new ScatterplotLayer({
    id: "originalNodes",
    data: graph,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 2,
    getFillColor: [255, 255, 255],
    pickable: true,
    onClick: (info) => console.log(info),
  });

  const explored = graph.filter((node) => visitedIDs.includes(node.id));

  const displayLayer = new ScatterplotLayer({
    id: "displayingNodes",
    data: explored,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 10,
    getFillColor: [139, 92, 246],
  });

  const runPathFinding = () => {
    let nodes = [];
    switch (selectedAlgorithm) {
      case "BFS":
        bfs();
        break;
      case "DFS":
        dfs();
        break;
      default:
        console.error("No algorithm was selected");
        break;
    }
  };

  const bfs = () => {
    const queue: number[] = [];
    queue.push(origin);
    while (queue.length !== 0) {
      let currentID = queue.shift();
      if (currentID === destination) {
        setDisplayNodeIDs((prev) => [...prev, destination]);
        return currentID;
      }
      let currentNode = graph.find((node) => node.id === currentID);
      currentNode?.adjNodes.map((adjID: number) => {
        if (!visitedIDs.includes(adjID)) {
          setDisplayNodeIDs((prev) => [...prev, adjID]);
          queue.push(adjID);
        }
      });
    }
  };

  const dfs = () => {
    const stack = [];
    const visited: number[] = [];
    stack.push(origin);
    while (stack.length !== 0) {
      const currentID = stack.pop();
      if (currentID === destination) {
        setDisplayNodeIDs((prev) => [...prev, destination]);
        return;
      }
      if (!visited.includes(currentID as number)) {
        visited.push(currentID as number);
        let currentNode = graph.find((node) => node.id === currentID);
        currentNode?.adjNodes.map((adjID: number) => {
          stack.push(adjID);
          setDisplayNodeIDs(visited);
        });
      }
    }
  };

  const traverseGraph = () => {
    setDisplayNodeIDs((prev) => [
      ...prev,
      ...explored.map((node) => node.adjNodes).flat(1),
    ]);
  };

  return (
    <main className="flex flex-row h-screen w-screen">
      <section className="w-1/3 h-full bg-base-800 flex flex-col items-center text-zinc-100 py-20 gap-10">
        <LocationSelection />
        <AlgorithmSelection />
        <Controls traverseGraph={runPathFinding} />
      </section>
      <section className="w-2/3 h-full">
        <MapContainer layers={[nodesLayer, displayLayer]} />
      </section>
    </main>
  );
}
