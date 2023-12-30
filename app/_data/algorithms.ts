type AlgorithimInfo = {
  name: string;
  abbreviation: string;
};

const algorithms: AlgorithimInfo[] = [
  {
    name: "Breadth First Search",
    abbreviation: "BFS",
  },
  {
    name: "Depth First Search",
    abbreviation: "DFS",
  },
  {
    name: "A Star",
    abbreviation: "AS",
  },
];

export { algorithms };
export type { AlgorithimInfo };
