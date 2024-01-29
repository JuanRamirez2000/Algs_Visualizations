"use client";

import AlgorithmSelection from "./AlgorithmSelection";
import Controls from "./Controls";
import LocationSelection from "./LocationSelection";
import MapContainer from "./MapContainer";
import data from "../_data/test.json";
import { useEffect, useState } from "react";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers/typed";
import { useSearchParams } from "next/navigation";

const destination = 11375332250;
const origin = 1925338334;
const NODES_EXPLORED_TIMER = 10;
const SOLUTION_PATH_TIMER = 25;

export default function Home() {
  const graph =
    //@ts-ignore
    Object.keys(data).map((key) => data[key]);
  const searchParams = useSearchParams();
  const selectedAlgorithm = searchParams.get("algorithm");

  const [exploredIDs, setExploredIDs] = useState<number[]>([origin]);
  const [solutionIDs, setSolutionIDs] = useState<number[]>([]);
  const [currentID, setCurrentID] = useState<number>(origin);

  useEffect(() => {
    setExploredIDs([origin]);
    setSolutionIDs([]);
    setCurrentID(origin);
  }, [searchParams]);

  const exploredNodes = graph.filter((node) => exploredIDs.includes(node.id));

  //* Constructus a path following the "construct path" function
  //* Path nodes have to be in the form {from: Node, to: Node}
  //* This is because of the DeckGL line Layer
  //* https://deck.gl/docs/api-reference/layers/line-layer
  const solutionPath = solutionIDs.map((nodeID, i) => {
    const source = nodeID;
    let destinationID = {};
    if (i === solutionIDs.length - 1) {
      destinationID = solutionIDs[i];
    } else {
      destinationID = solutionIDs[i + 1];
    }
    const sourceNode = graph.filter((node) => node.id === source);
    const destinationNode = graph.filter((node) => node.id === destinationID);

    return {
      from: sourceNode[0],
      to: destinationNode[0],
    };
  });
  const currentNode = graph.filter((node) => node.id === currentID);

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

  const exploredLayer = new ScatterplotLayer({
    id: "displayingNodes",
    data: exploredNodes,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 5,
    getFillColor: [139, 92, 246],
  });

  const solutionLayer = new LineLayer({
    id: "solutionPath",
    data: solutionPath,
    getSourcePosition: (d) => [d.from.lon, d.from.lat],
    getTargetPosition: (d) => [d.to.lon, d.to.lat],
    getWidth: 3,
    getColor: [239, 68, 68],
  });

  const currentExploredLayer = new ScatterplotLayer({
    id: "currentNode",
    data: currentNode,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 8,
    getFillColor: [217, 70, 239],
  });

  const runPathFinding = () => {
    switch (selectedAlgorithm) {
      case "BFS":
        const { path: bfsPath, explored: bfsExplored } = bfs();
        if (!bfsExplored || !bfsPath) {
          throw new Error("No solution found");
        }
        animateSolution(bfsExplored, bfsPath);
        break;

      case "DFS":
        const { path: dfsPath, explored: dfsExplored } = dfs();
        if (!dfsExplored || !dfsPath) {
          throw new Error("No solution found");
        }
        animateSolution(dfsExplored, dfsPath);

        break;

      default:
        console.error("No algorithm was selected");
        break;
    }
  };

  const animateNodes = (
    exploredNodes: number[],
    timing: number = NODES_EXPLORED_TIMER
  ) => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const currentNode = exploredNodes.shift();
        if (!currentNode) {
          clearInterval(interval);
          resolve(null);
        }
        setExploredIDs((prev) => [...prev, currentNode as number]);
        setCurrentID(currentNode as number);
      }, timing);
    });
  };
  const animateSolution = async (
    exploredNodeIDs: number[],
    solutionPathIDs: number[],
    timing: number = SOLUTION_PATH_TIMER
  ) => {
    await animateNodes(exploredNodeIDs);
    const interval = setInterval(() => {
      const currentNodeID = solutionPathIDs.shift();
      //if we dont do this check the last node becomes undefined
      if (!currentNodeID || solutionPathIDs.length === 1) {
        clearInterval(interval);
      }
      setSolutionIDs((prev) => [...prev, currentNodeID as number]);
    }, timing);
  };

  const constructPath = (
    memory: { parent: number | null; child: number }[]
  ): number[] => {
    //Traverses each node and goes back to its parent
    //This assumes a soltuion has been found and it is the most optimal solution
    let path = [];
    let currentNode = memory.find((node) => node.child === destination);
    while (currentNode?.parent !== null) {
      path.push(currentNode?.parent);
      currentNode = memory.find((node) => node.child === currentNode?.parent);
    }
    return path as number[];
  };

  const bfs = (): {
    path: number[] | null;
    explored: number[] | null;
  } => {
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
        const path = constructPath(memory);
        return { path: path, explored: explored };
      }

      currentNode?.adjNodes.map((adjID: number) => {
        if (!explored.includes(adjID)) {
          explored.push(adjID);
          frontier.push(adjID);
          memory.push({ parent: currentID as number, child: adjID });
        }
      });
    }
    return { path: null, explored: null };
  };

  const dfs = (): {
    path: number[] | null;
    explored: number[] | null;
  } => {
    const frontier: number[] = [];
    const explored: number[] = [];
    const memory: { parent: number | null; child: number }[] = [];
    frontier.push(origin);
    memory.push({ parent: null, child: origin });

    while (frontier.length !== 0) {
      const currentID = frontier.pop();
      let currentNode = graph.find((node) => node.id === currentID);

      if (currentID === destination) {
        const path = constructPath(memory);
        return { path: path, explored: explored };
      }

      if (!explored.includes(currentID as number)) {
        explored.push(currentID as number); //Add to explored
        currentNode?.adjNodes.map((adjID: number) => {
          frontier.push(adjID);
          memory.push({ parent: currentID as number, child: adjID });
        });
      }
    }
    return { path: null, explored: null };
  };

  return (
    <main className="flex flex-row h-screen w-screen">
      <section className="w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 h-full bg-base-800 flex flex-col items-center text-zinc-100 py-20 gap-10">
        <LocationSelection />
        <AlgorithmSelection />
        <Controls traverseGraph={runPathFinding} />
      </section>
      <section className="w-1/2 lg:w-3/5 xl:w-2/3 2xl:w-3/4 h-full">
        <MapContainer
          layers={[
            nodesLayer,
            exploredLayer,
            currentExploredLayer,
            solutionLayer,
          ]}
        />
      </section>
    </main>
  );
}
