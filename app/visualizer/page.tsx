"use client";
import AlgorithmSelection from "./AlgorithmSelection";
import Controls from "./Controls";
import LocationSelection from "./LocationSelection";
import MapContainer from "../components/MapContainer";
import data from "../data/test.json";
import { useEffect, useState } from "react";
import { ScatterplotLayer, LineLayer } from "@deck.gl/layers/typed";
import { useSearchParams } from "next/navigation";
import { Node } from "../helpers/parseOsm";
import { dfs, bfs } from "../helpers/PathFindingAlgs";
import { animateSolution } from "../helpers/Animations";

const defaultOrigin = 1925338334;
const defaultDestination = 6371463716;
const ranges = [
  {
    distance: "short",
    originID: 1925338334,
    destinationID: 6371463716,
  },
  {
    distance: "med",
    originID: 1925338334,
    destinationID: 11375332264,
  },
  {
    distance: "long",
    originID: 1925338334,
    destinationID: 123021219,
  },
];
export default function Home() {
  const graph =
    //@ts-ignore
    Object.keys(data).map((key) => data[key]);
  const searchParams = useSearchParams();
  const selectedRange = searchParams.get("range");
  const selectedAlgorithm = searchParams.get("algorithm");

  const [origin, setOrigin] = useState<number>(defaultOrigin);
  const [destination, setDestination] = useState<number>(defaultDestination);
  const [exploredIDs, setExploredIDs] = useState<number[]>([origin]);
  const [solutionIDs, setSolutionIDs] = useState<number[]>([]);
  const [currentID, setCurrentID] = useState<number>(origin);

  const waypointNodesIDs: number[] = [origin, destination];

  useEffect(() => {
    if (selectedRange) {
      const { originID, destinationID } = ranges.find(
        (range) => range.distance === selectedRange
      )!;
      setOrigin(originID);
      setDestination(destinationID);
    }

    setExploredIDs([origin]);
    setSolutionIDs([]);
    setCurrentID(origin);
  }, [searchParams, origin, selectedRange]);

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
    const sourceNode = graph.find((node) => node.id === source);
    const destinationNode = graph.find((node) => node.id === destinationID);

    return {
      from: sourceNode,
      to: destinationNode,
    };
  });

  const trafficGraph: any[] = [];
  graph.map((sourceNode: Node) => {
    sourceNode.adjNodes.map((destinationID, idx): any => {
      const destinationNode = graph.find((node) => node.id === destinationID);
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
    getRadius: 14,
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
    if (!selectedAlgorithm) {
      console.error("No Selected Algorithm");
      return;
    }

    if (selectedAlgorithm === "BFS") {
      const { path, explored } = bfs(origin, destination, graph);
      if (!path || !explored) {
        console.error("Pathfinding Failed");
        return;
      }
      animateSolution(
        explored,
        path,
        25,
        setSolutionIDs,
        setExploredIDs,
        setCurrentID
      );
    }
    if (selectedAlgorithm === "DFS") {
      const { path, explored } = dfs(origin, destination, graph);
      if (!path || !explored) {
        console.error("Pathfinding Failed");
        return;
      }
      animateSolution(
        explored,
        path,
        25,
        setSolutionIDs,
        setExploredIDs,
        setCurrentID
      );
    }
  };

  return (
    <main className="flex flex-row h-screen w-screen">
      <section className="w-1/2 lg:w-2/5 xl:w-1/3 2xl:w-1/4 h-full flex flex-col items-center py-20 gap-10">
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
