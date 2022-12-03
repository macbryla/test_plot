function show_sankey(chart_title,sankey_json) {

	// set the dimensions and margins of the graph
	var margin = { top: 50, right: 10, bottom: 10, left: 10 },
		width = 1100 - margin.left - margin.right,
		height = 700 - margin.top - margin.bottom;

	// format variables
	var formatNumber = d3.format(",.0f"), // zero decimal places
		format = function (d) { return formatNumber(d); },
		color = d3.scaleOrdinal(d3.schemeCategory10);

	// append the svg object to the body of the page
	var svg = d3.select(".chart").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	svg.append("text")
		// .attr("class", "chart_title")
		.attr("x", width / 2)
		.attr("y", -10)
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.text(chart_title);

	// Set the sankey diagram properties
	var sankey = d3.sankey()
		.nodeWidth(10)
		.nodePadding(20)
		.size([width, height]);//.nodeSort(null);

	var path = sankey.links();

	// load the data
	d3.json(sankey_json).then(function (sankeydata) {

		var nodeMap = {};
		sankeydata.nodes.forEach(function (x) { nodeMap[x.name] = x; });
		sankeydata.links = sankeydata.links.map(function (x) {
			return {
				source: nodeMap[x.source],
				target: nodeMap[x.target],
				value: x.value
			};
		});

		graph = sankey(sankeydata);


		// add in the links
		var link = svg.append("g").selectAll(".link")
			.data(graph.links)
			.enter().append("path")
			.attr("class", "link")
			.attr("d", d3.sankeyLinkHorizontal())
			.attr("stroke-width", function (d) { return d.width; });

		// add the link titles
		link.append("title")
			.text(function (d) {
				return format(d.value) + " : " + d.source.name + " → " +
					d.target.name;
			});

		// add in the nodes
		var node = svg.append("g").selectAll(".node")
			.data(graph.nodes)
			.enter().append("g")
			.attr("class", "node");

		// add the rectangles for the nodes
		node.append("rect")
			.attr("x", function (d) { return d.x0; })
			.attr("y", function (d) { return d.y0; })
			.attr("height", function (d) { return d.y1 - d.y0; })
			.attr("width", sankey.nodeWidth())
			.style("fill", function (d) {
				return d.color = color(d.name.replace(/ .*/, ""));
			})
			.style("stroke", function (d) {
				return d3.rgb(d.color).darker(2);
			})
			.append("title")
			.text(function (d) {
				return d.name + "\n" + format(d.value);
			});

		// add in the title for the nodes
		node.append("text")
			.attr("x", function (d) { return d.x0 - 6; })
			.attr("y", function (d) { return (d.y1 + d.y0) / 2; })
			.attr("dy", "0.35em")
			.attr("text-anchor", "end")
			.text(function (d) { return d.name; })
			.filter(function (d) { return d.x0 < width / 2; })
			.attr("x", function (d) { return d.x1 + 6; })
			.attr("text-anchor", "start");

	});



}