function findShortestPath() {
  const startNode = document.getElementById('start-node-input').value;
  const endNode = document.getElementById('end-node-input').value;
  const graphInput = document.getElementById('graph-input').value;
  const graph = createGraph(graphInput);
  const shortestPath = dijkstra(graph, startNode, endNode);
  displayResult(shortestPath);
}

function createGraph(graphInput) {
  const edges = graphInput.split(',');
  const graph = {};

  edges.forEach((edge) => {
    const [startNode, endNode, weight] = edge.split('-');
    if (!graph[startNode]) {
      graph[startNode] = {};
    }
    if (!graph[endNode]) {
      graph[endNode] = {};
    }
    graph[startNode][endNode] = parseInt(weight);
    graph[endNode][startNode] = parseInt(weight);
  });

  return graph;
}

function dijkstra(graph, startNode, endNode) {
  const distances = {};
  const visitedNodes = {};
  const previousNodes = {};
  let currentNode = startNode;

  // Initialize distances with infinity and start node with 0
  Object.keys(graph).forEach((node) => {
    distances[node] = Infinity;
  });
  distances[startNode] = 0;

  while (currentNode !== endNode) {
    // Visit current node
    visitedNodes[currentNode] = true;

    // Update distances to neighbors
    Object.keys(graph[currentNode]).forEach((neighbor) => {
      const distanceToNeighbor = distances[currentNode] + graph[currentNode][neighbor];
      if (!visitedNodes[neighbor] && distanceToNeighbor < distances[neighbor]) {
        distances[neighbor] = distanceToNeighbor;
        previousNodes[neighbor] = currentNode;
      }
    });

    // Find next node to visit
    currentNode = findNextNode(distances, visitedNodes);
    if (!currentNode) {
      return null; // No path found
    }
  }

  // Reconstruct shortest path
  const shortestPath = [];
  while (currentNode !== startNode) {
    shortestPath.unshift(currentNode);
    currentNode = previousNodes[currentNode];
  }
  shortestPath.unshift(startNode);

  return {
    path: shortestPath,
    distance: distances[endNode],
  };
}

function findNextNode(distances, visitedNodes) {
  let shortestDistance = Infinity;
  let nextNode = null;

  Object.keys(distances).forEach((node) => {
    if (!visitedNodes[node] && distances[node] < shortestDistance) {
      shortestDistance = distances[node];
      nextNode = node;
    }
  });

  return nextNode;
}

function displayResult(shortestPath) {
  const resultDiv = document.getElementById('result');
  if (shortestPath) {
    const { path, distance } = shortestPath;
    resultDiv.innerHTML = `Najkrótsza ścieżka: ${path.join('-')}, Dystans: ${distance}`;
  } else {
    resultDiv.innerHTML = 'Nie znaleziono ścieżki';
  }
}

const form = document.getElementById('dijkstra-form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  findShortestPath();
});
