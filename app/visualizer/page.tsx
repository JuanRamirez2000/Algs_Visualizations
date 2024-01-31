"use client";
import AlgorithmSelection from "./AlgorithmSelection";
import Controls from "./Controls";
import LocationSelection from "./LocationSelection";
import MapContainer from "./MapContainer";
import data from "../_data/test.json";
import { useEffect, useState } from "react";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers/typed";
import { useSearchParams } from "next/navigation";
import { Node } from "../helpers/parseOsm";

const destination = 122697220;
const origin = 1925338334;
const NODES_EXPLORED_TIMER = 10;
const SOLUTION_PATH_TIMER = 25;
const waypointNodesIDs: number[] = [origin, destination];

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

  //---------------------------------//
  //---------Layer Node Data---------//
  //---------------------------------//

  const exploredNodes = graph.filter((node: Node) =>
    exploredIDs.includes(node.id)
  );
  const currentNode = graph.filter((node: Node) => node.id === currentID);
  const waypointNodes = graph.filter((node: Node) =>
    waypointNodesIDs.includes(node.id)
  );
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

  const trafficGraph: any[] = [];
  graph.map((sourceNode: Node) => {
    sourceNode.adjNodes.map((destinationID, idx): any => {
      const destinationNode = graph.filter(
        (node) => node.id === destinationID
      )[0];
      trafficGraph.push({
        from: sourceNode,
        to: destinationNode,
        weight: sourceNode.weights[idx],
      });
    });
  });

  //---------------------------------//
  //---------Layer Instances---------//
  //---------------------------------//
  //* Layers are in order from top to bottom
  //* Top are rendered last and are shown above all other layers

  //? Shown as rose-500
  const waypointLayer = new ScatterplotLayer({
    id: "waypointNodes",
    data: waypointNodes,
    getRadius: 10,
    getPosition: (d) => [d.lon, d.lat],
    getFillColor: [244, 63, 94],
  });

  //? Shown as rose-500
  const solutionLayer = new LineLayer({
    id: "solutionPath",
    data: solutionPath,
    getSourcePosition: (d) => [d.from.lon, d.from.lat],
    getTargetPosition: (d) => [d.to.lon, d.to.lat],
    getWidth: 6,
    getColor: [244, 63, 94],
  });

  //? Shown as white
  const nodesLayer = new ScatterplotLayer({
    id: "originalNodes",
    data: graph,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat];
    },
    getRadius: 2.5,
    getFillColor: [255, 255, 255],
    pickable: true,
    onClick: (info) => console.log(info),
  });

  //? Shown as sky-500
  const exploredLayer = new ScatterplotLayer({
    id: "displayingNodes",
    data: exploredNodes,
    filled: true,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: 6,
    getFillColor: [14, 165, 233],
  });

  //? Shown as amber-500
  const currentExploredLayer = new ScatterplotLayer({
    id: "currentNode",
    data: currentNode,
    filled: true,
    getPosition: (d) => [d.lon, d.lat],
    getRadius: 8,
    getFillColor: [245, 158, 11],
  });

  //? Shown as multi-color per traffice weight
  const trafficLayer = new LineLayer({
    id: "trafficLayer",
    data: trafficGraph,
    getSourcePosition: (d) => [d.from.lon, d.from.lat],
    getTargetPosition: (d) => [d.to.lon, d.to.lat],
    getWidth: 1,
    opacity: 0.5,
    getColor: (d) => {
      //* High weight, shown as red-700
      if (d.weight > 75) return [185, 28, 28];

      //* Medium weight, shown as orange-300
      if (d.weight > 50) return [253, 186, 116];

      //* Low weight, shown as green-300
      return [74, 222, 128];
    },
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
      if (!currentNodeID || solutionPathIDs.length === 0) {
        clearInterval(interval);
      }
      setSolutionIDs((prev) => [...prev, currentNodeID as number]);
    }, timing);
  };

  //*Traverses each node and goes back to its parent
  //*This assumes a soltuion has been found and it is the most optimal solution
  const constructPath = (
    memory: { parent: number | null; child: number }[]
  ): number[] => {
    let path: number[] = [];
    //! This line is needed to reconstruct the tail of the path
    //! Leading from destination to 2nd to last node
    path.push(destination);
    let currentNode = memory.find((node) => node.child === destination);
    while (currentNode?.parent !== null) {
      path.push(currentNode?.parent as number);
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
        memory.push({ parent: currentID as number, child: destination });
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
        memory.push({ parent: currentID as number, child: destination });
        const path = constructPath(memory);
        return { path: path, explored: explored };
      }

      if (!explored.includes(currentID as number)) {
        explored.push(currentID as number);
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
            trafficLayer,
            nodesLayer,
            currentExploredLayer,
            exploredLayer,
            solutionLayer,
            waypointLayer,
          ]}
        />
      </section>
    </main>
  );
}
