import { Dispatch, SetStateAction } from "react";

const NODES_EXPLORED_TIMER = 10;
const SOLUTION_PATH_TIMER = 25;

const animateNodes = (
  exploredNodes: number[],
  timing: number = NODES_EXPLORED_TIMER,
  setExploredIDs: Dispatch<SetStateAction<number[]>>,
  setCurrentID: Dispatch<SetStateAction<number>>
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
  timing: number = SOLUTION_PATH_TIMER,
  setSolutionIDs: Dispatch<SetStateAction<number[]>>,
  setExploredIDs: Dispatch<SetStateAction<number[]>>,
  setCurrentID: Dispatch<SetStateAction<number>>
) => {
  await animateNodes(
    exploredNodeIDs,
    NODES_EXPLORED_TIMER,
    setExploredIDs,
    setCurrentID
  );
  const interval = setInterval(() => {
    const currentNodeID = solutionPathIDs.shift();
    //if we dont do this check the last node becomes undefined
    if (!currentNodeID || solutionPathIDs.length === 0) {
      clearInterval(interval);
    }
    setSolutionIDs((prev) => [...prev, currentNodeID as number]);
  }, timing);
};

export { animateSolution, animateNodes };
