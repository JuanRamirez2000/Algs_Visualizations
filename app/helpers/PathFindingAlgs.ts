//*Traverses each node and goes back to its parent
//*This assumes a soltuion has been found and it is the most optimal solution
const constructPath = (
  memory: { parent: number | null; child: number }[],
  destination: number
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

const bfs = (
  origin: number,
  destination: number,
  graph: any[]
): {
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
      const path = constructPath(memory, destination);
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

const dfs = (
  origin: number,
  destination: number,
  graph: any[]
): {
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
      const path = constructPath(memory, destination);
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

export { dfs, bfs };
