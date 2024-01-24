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
  const [solutionIDs, setSolutionIDs] = useState<number[]>();

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
  const solution = graph.filter((node) => solutionIDs?.includes(node.id));

  const displayLayer = new ScatterplotLayer({
    id: "displayingNodes",
    data: explored,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 3,
    getFillColor: [139, 92, 246],
  });

  const solutionLayer = new ScatterplotLayer({
    id: "solutionNodes",
    data: solution,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 3,
    getFillColor: [239, 68, 68],
  });

  const runPathFinding = () => {
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

  const constructPath = (
    memory: { parent: number | null; child: number }[]
  ) => {
    //Traverse the parents from the destination until you hit null (origin)
    let path = [];
    let currentNode = memory.find((node) => node.child === destination);
    while (currentNode?.parent !== null) {
      path.push(currentNode?.parent);
      currentNode = memory.find((node) => node.child === currentNode?.parent);
    }
    setSolutionIDs(path as number[]);
  };

  const bfs = () => {
    const frontier: number[] = [];
    const explored: number[] = [];
    const memory: { parent: number | null; child: number }[] = [];
    frontier.push(origin);
    memory.push({ parent: null, child: origin });
    explored.push(origin);

    while (frontier.length !== 0) {
      let currentID = frontier.shift();
      let currentNode = graph.find((node) => node.id === currentID);

      if (currentID === destination) {
        setDisplayNodeIDs((prev) => [...prev, destination]);
        constructPath(memory);
        return;
      }

      currentNode?.adjNodes.map((adjID: number) => {
        if (!explored.includes(adjID)) {
          explored.push(adjID);
          frontier.push(adjID);
          memory.push({ parent: currentID as number, child: adjID });
          setDisplayNodeIDs((prev) => [...prev, adjID]);
        }
      });
    }
  };

  const dfs = () => {
    const frontier: number[] = [];
    const explored: number[] = [];
    const memory: { parent: number | null; child: number }[] = [];
    frontier.push(origin);
    //@ts-ignore
    memory.push({ parent: null, child: origin });

    while (frontier.length !== 0) {
      const currentID = frontier.pop(); //Grab currentID
      let currentNode = graph.find((node) => node.id === currentID);

      if (currentID === destination) {
        setDisplayNodeIDs((prev) => [...prev, destination]);
        constructPath(memory);
        return;
      }

      if (!explored.includes(currentID as number)) {
        explored.push(currentID as number); //Add to explored
        currentNode?.adjNodes.map((adjID: number) => {
          frontier.push(adjID);
          memory.push({ parent: currentID as number, child: adjID });
          setDisplayNodeIDs(explored);
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
        <MapContainer layers={[nodesLayer, displayLayer, solutionLayer]} />
      </section>
    </main>
  );
}
