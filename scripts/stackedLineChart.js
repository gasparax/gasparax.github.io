function stackedLineChart(selection, data, width, height, marginLeft, palette) {

    const margin = marginLeft;

    const genreList = [
        "Action",
        "Sports",
        "Misc",
        "Role-Playing",
        "Shooter",
        "Adventure",
        "Racing",
        "Platform",
        "Simulation",
        "Fighting",
        "Strategy",
        "Puzzle"
    ];

    const parseDate = d3.timeParse('%Y');
    const xAccessor = d => parseDate(d.year);
    const genreAccessor = d => d.genre;

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .nice();

    const xScale = d3.scaleTime()
        .domain([d3.min(data, xAccessor), d3.max(data, xAccessor)])
        .range([0, width - margin]);

    const offset = d3.stackOffsetDiverging; // stack offset method
    const order = d3.stackOrderNone; // stack order method
    const colors = d3.schemeTableau10; // array of colors for z

    const stack = d3.stack()
        .keys(genreList);

    const stackedData = stack(data);
    yScale.domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])])

    console.log(stackedData)
    var area = d3.area()
        .x((d) => xScale(xAccessor(d.data)))
        .y0((d) => yScale(d[0]))
        .y1((d) => yScale(d[1]));

    selection.selectAll(".trendArea")
        .data(stackedData)
        .join("path")
        .attr("class", function(d) { return "trendArea " + d.key })
        .attr("d", area)
        .attr("fill", (d, i) => palette[(palette.length - 1) - i]);

    // HIGHLIGHT GROUP

    // What to do when one group is hovered
    const highlight = function (event, d) {
        console.log(d)
        // reduce opacity of all groups
        d3.selectAll(".trendArea").style("opacity", .1)
        // expect the one that is hovered
        d3.select("." + d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    const noHighlight = function (event, d) {
        d3.selectAll(".trendArea").style("opacity", 1)
    }

    // LEGEND 
    // Add one dot in the legend for each name.
    const size = height/(genreList.length*2)

    const xPosLegend = width - 28;
    selection.selectAll("myrect")
        .data(genreList)
        .join("rect")
        .attr("x", xPosLegend)
        .attr("y", function (d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", (d, i) => palette[(palette.length - 1) - i])
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    selection.selectAll("mylabels")
        .data(genreList)
        .join("text")
        .attr("x", xPosLegend + size * 1.2)
        .attr("y", function (d, i) { return 10 + i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", (d, i) => palette[(palette.length - 1) - i])
        .text(function (d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
}