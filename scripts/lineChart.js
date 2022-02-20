
function lineChart(selection, data, widthLineChart, heightLineChart) {
    //Data Accessor
    const parseDate = d3.timeParse('%Y');
    const xAccessor = d => parseDate(d.year)
    const yAccessor = d => parseInt(d.sales)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([heightLineChart, 0])
        .nice();

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, widthLineChart]);

    var line = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

    // Add the line

    var path = selection.selectAll(".productionTrend").data([data], yAccessor)
    path.enter()
        .append("path")
        .attr("class", "productionTrend")
        .merge(path)
        .transition()
        .duration(1500)
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "#005F73")
        .attr("stroke-width",3)

    // Get the length of the path, which we will use for the intial offset to "hide"
    // the graph
    // const length = path.node().getTotalLength();

    // function repeat() {
    //     // Animate the path by setting the initial offset and dasharray and then transition the offset to 0
    //     path.attr("stroke-dasharray", length + " " + length)
    //         .attr("stroke-dashoffset", length)
    //         .transition()
    //         .ease(d3.easeLinear)
    //         .attr("stroke-dashoffset", 0)
    //         .duration(2000);
    // };

    // repeat();

    return selection;
}