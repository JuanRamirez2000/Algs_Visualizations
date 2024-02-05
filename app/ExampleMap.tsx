"use client";

import { ScatterplotLayer, LineLayer } from "@deck.gl/layers/typed";
import MapContainer from "./components/MapContainer";
import data from "./data/test.json";
import { bfs } from "./helpers/PathFindingAlgs";
import type { Node } from "./helpers/parseOsm";

const SANTA_ANA_CENTER = {
  long: -117.8667,
  lat: 33.7477,
};

const ORIGIN = 1925338334;
const DESTINATION = 123021219;
const WAY_POINT_NODE_IDS = [ORIGIN, DESTINATION];
const DEFAULT_HEIGHT = 20;
const UNSELECTED_LAYER_OPACITY = 0.2;
const selectedLayer: string = "solutionPath";

export default function ExampleMap() {
  const graph =
    //@ts-ignore
    Object.keys(data).map((key) => data[key]);

  const { path: solutionIDs, explored: exploredIDs } = bfs(
    ORIGIN,
    DESTINATION,
    graph
  );
  if (!solutionIDs) return <p>No Solution Found</p>;
  if (!exploredIDs) return <p>No Solution Found</p>;
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
  const exploredNodes = graph.filter((node: Node) =>
    exploredIDs.includes(node.id)
  );
  const waypointNodes = graph.filter((node: Node) =>
    WAY_POINT_NODE_IDS.includes(node.id)
  );
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
  const waypointLayer = new ScatterplotLayer({
    id: "waypointNodes",
    data: waypointNodes,
    opacity: selectedLayer === "waypointNodes" ? 1 : UNSELECTED_LAYER_OPACITY,
    getRadius: 14,
    getPosition: (d) => [d.lon, d.lat, DEFAULT_HEIGHT * 0],
    getFillColor: [244, 63, 94],
  });

  //? Shown as rose-500
  const solutionLayer = new LineLayer({
    id: "solutionPath",
    data: solutionPath,
    opacity: selectedLayer === "solutionPath" ? 1 : UNSELECTED_LAYER_OPACITY,
    getSourcePosition: (d) => [d.from.lon, d.from.lat, DEFAULT_HEIGHT * 15],
    getTargetPosition: (d) => [d.to.lon, d.to.lat, DEFAULT_HEIGHT * 15],
    getWidth: 6,
    getColor: [244, 63, 94],
  });

  //? Shown as white
  const nodesLayer = new ScatterplotLayer({
    id: "originalNodes",
    data: graph,
    opacity: selectedLayer === "originalNodes" ? 1 : UNSELECTED_LAYER_OPACITY,
    filled: true,
    getPosition: (d) => {
      return [d.lon, d.lat, DEFAULT_HEIGHT * 5];
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
    opacity: selectedLayer === "displayingNodes" ? 1 : UNSELECTED_LAYER_OPACITY,
    filled: true,
    getPosition: (d) => [d.lon, d.lat, DEFAULT_HEIGHT * 10],
    getRadius: 6,
    getFillColor: [14, 165, 233],
  });

  //? Shown as multi-color per traffice weight
  const trafficLayer = new LineLayer({
    id: "trafficLayer",
    data: trafficGraph,
    opacity: selectedLayer === "trafficLayer" ? 1 : UNSELECTED_LAYER_OPACITY,
    getSourcePosition: (d) => [d.from.lon, d.from.lat, DEFAULT_HEIGHT * 5],
    getTargetPosition: (d) => [d.to.lon, d.to.lat, DEFAULT_HEIGHT * 5],
    getWidth: 1,
    getColor: (d) => {
      //* High weight, shown as red-700
      if (d.weight > 75) return [185, 28, 28];

      //* Medium weight, shown as orange-300
      if (d.weight > 50) return [253, 186, 116];

      //* Low weight, shown as green-300
      return [74, 222, 128];
    },
  });

  return (
    <MapContainer
      layers={[
        trafficLayer,
        nodesLayer,
        exploredLayer,
        solutionLayer,
        waypointLayer,
      ]}
      disableControls={true}
      initialViewState={{
        longitude: SANTA_ANA_CENTER.long,
        latitude: SANTA_ANA_CENTER.lat,
        zoom: 15,
        bearing: 45,
        pitch: 70,
      }}
    />
  );
}
