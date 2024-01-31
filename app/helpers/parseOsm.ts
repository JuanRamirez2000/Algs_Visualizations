"use server";
import roads from "../data/originalTest.json";
import * as fs from "fs";

//! TODO Fix these types
interface OSMNode {
  id: number;
  lat: number;
  lon: number;
}

interface Node {
  id: number;
  lat: number;
  lon: number;
  weights: number[];
  adjNodes: number[];
}

type Graph = Record<number, Node>;

type NodeByID = Record<number, NodeCoordinates>;
interface NodeCoordinates {
  lat: number;
  lon: number;
}

//Main graph data structure
//Node info is used as a temp structure to help scaffold graph
const graph: Graph = {};
const nodeInfo: NodeByID = {};

const findAdjacentNodes = (nodes: number[], idx: number) => {
  let prevNode = null;
  let currNode = nodes[idx];
  let nextNode = null;
  const length = nodes.length;
  if (idx === 0) {
    nextNode = nodes[idx];
  } else if (idx === length - 1) {
    prevNode = nodes[idx - 1];
  } else {
    prevNode = nodes[idx - 1];
    nextNode = nodes[idx + 1];
  }
  return { prevNode, currNode, nextNode };
};

const connectNodes = (nodes: number[]) => {
  //For each node find the adjacent nodes and connect them
  //As an adjacency list
  nodes.map((_: number, idx: number) => {
    const { prevNode, currNode, nextNode } = findAdjacentNodes(nodes, idx);
    if (!(currNode in graph)) {
      extendNodeInfo(currNode);
    }
    if (
      prevNode &&
      !(prevNode in graph[currNode]["adjNodes"]!) &&
      prevNode !== currNode &&
      prevNode !== nextNode
    ) {
      graph[currNode]["adjNodes"]?.push(prevNode);
      graph[currNode]["weights"]?.push(Math.floor(Math.random() * 100));
    }
    if (
      nextNode &&
      !(nextNode in graph[currNode]["adjNodes"]!) &&
      nextNode !== currNode &&
      nextNode !== prevNode
    ) {
      graph[currNode]["adjNodes"]?.push(nextNode);
      graph[currNode]["weights"]?.push(Math.floor(Math.random() * 100));
    }
  });
};

const extendNodeInfo = (nodeID: number) => {
  const { lat, lon }: { lat: number; lon: number } = nodeInfo[nodeID];
  graph[nodeID] = { id: nodeID, lat: lat, lon: lon, weights: [], adjNodes: [] };
};

const initializeNodeInfo = (node: OSMNode) => {
  const { id, lat, lon } = node;
  nodeInfo[id] = { lat: lat, lon: lon };
};

const parseOSMData = () => {
  const { elements } = roads;
  elements.map((element) => {
    if (element.type === "node") initializeNodeInfo(element as OSMNode);

    if (element.type === "way") connectNodes(element.nodes as number[]);
  });
  fs.writeFile("./test.json", JSON.stringify(graph), (error) => {
    if (error) {
      console.error(error);
      throw error;
    }
  });
  console.log("Done writing file");
};

export default parseOSMData;

export type { Graph, Node };
