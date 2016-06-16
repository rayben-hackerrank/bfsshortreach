function newCase() {
	return {
		nodes: undefined,
		edges: undefined,
		start: undefined,
		edgeList: []
	};
}

function aggregate(input) {
	const cases = [];
	let isNewRecord = true;
	let currentCase = newCase();

	for (let line of input) {
		const parts = line.trim().split(' ').map(_ => parseInt(_, 10));

		if (parts.length === 1) {
			// end of a case, finalize and append to array
			currentCase.start = parseInt(parts[0]);
			cases.push(currentCase);

			// moving on....
			isNewRecord = true;
			currentCase = newCase();
		} else if (isNewRecord) {
			// read nodes and edges count
			isNewRecord = false;
			currentCase.nodes = parseInt(parts[0]);
			currentCase.edges = parseInt(parts[1]);
		} else {
			currentCase.edgeList.push(parts);
		}
	}

	return cases;

}

function constructGraph(testCase) {
	const graph = {};

	graph.origin = testCase.start;
	graph.nodes = testCase.nodes;

	for (let i = 1; i <= testCase.nodes; i += 1) {
		graph[i] = {
			range: -1,
			visited: false,
			links: {}
		};
	}

	for (let edge of testCase.edgeList) {
		const [a, b] = edge;
		graph[a].links[b] = true;
		graph[b].links[a] = true;
	}

	return graph;
}

function solveGraph(graph) {

	let waterFront = [ graph.origin ];
	let distance = 0; // from the origin

	while (waterFront.length !== 0) {
		//console.log(waterFront.join(' '));
		const nextFront = [];

		// set the distance so far of the waterFront from the origin
		// (also the visited flag)
		for (let node of waterFront) {
			graph[node].range = distance;
			graph[node].visited = true;
		}

		// populate the next front
		for (let node of waterFront) {
			for (let link in graph[node].links) {
				if (!graph[link].visited) {
					nextFront.push(parseInt(link, 10));
				}
			}
		}

		waterFront = nextFront;
		distance += 6;
	}
}

function processData(input) {
    //Enter your code here
	const cases = aggregate(input.split(require('os').EOL).slice(1));
	const graphs = cases.map(constructGraph);



	for (let graph of graphs) {
		solveGraph(graph);
		//console.log(JSON.stringify(graph, null, 4));

		const ranges = [];
		for (let i = 1; i <= graph.nodes; i += 1) {
			if (graph[i].range !== 0) {
				ranges.push(graph[i].range);	
			}
		}
		console.log(ranges.join(' '));
	}    
} 

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});
