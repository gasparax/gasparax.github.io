
function lineChart(selection, data, widthLineChart, heightLineChart, palette) {
    //Data Accessor
    const parseDate = d3.timeParse('%Y');
    const xAccessor = d => parseDate(d.year)
    const yAccessor = d => parseInt(d.sales)
    const gameAccessor = d => (d.Name)
    const salesAccessor = d => parseInt(d.Global_Sales)

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([heightLineChart, 0])
        .nice();

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([0, widthLineChart]);

    // gridlines in x axis function
    function make_x_gridlines() {
        return d3.axisBottom(xScale)
            .ticks(5)
    }

    // gridlines in y axis function
    function make_y_gridlines() {
        return d3.axisLeft(yScale)
            .ticks(5)
    }

    // // add the X gridlines
    // selection.append("g")
    //     .attr("class", "grid")
    //     .attr("transform", "translate(0," + heightLineChart + ")")
    //     .call(make_x_gridlines()
    //         .tickSize(-heightLineChart)
    //         .tickFormat("")
    //     )

    // // add the Y gridlines
    // selection.append("g")
    //     .attr("class", "grid")
    //     .call(make_y_gridlines()
    //         .tickSize(-widthLineChart)
    //         .tickFormat("")
    //     )


    // create tooltip element 
    const tooltip = d3.select('#bubbleTooltip')

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        const gameName = gameAccessor(d);
        const sales = salesAccessor(d);
        tooltip
            .html(gameName + "<br>" + "Profit: " + sales + 'Mln $')
            .style('font-family', 'Quicksand, sans-serif')
            .style('font-size', 4)
            .style("text-align", "center")
            .style("opacity", 1)

    }
    const mousemove = function (event, d) {
        var xPos = xScale(xAccessor(d));
        var yPos = yScale(salesAccessor(d));
        tooltip.style("transform", "translateY(-55%)")
            .style("left", (xPos) + 'px')
            .style("top", (yPos) + 'px')
    }
    const mouseleave = function (event, d) {
        tooltip
            .style("opacity", 0)
    }

    var line = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

    // Add the line
    var path = selection.selectAll(".productionTrend").data([data], yAccessor)
    path.join("path")
        .attr("class", "productionTrend")
        .merge(path)
        .transition()
        .duration(1500)
        .attr("d", line(data))
        .attr("fill", "none")
        .attr("stroke", "#005F73")
        .attr("stroke-width", 3)

    const radius = 4
    var gameGroup = selection.selectAll('.mostSoldGames')
    gameGroup.data(data)
        .join('circle')
        .attr("class", "mostSoldGames")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .transition()
        .attr('r', radius)
        .attr('cy', d => yScale(salesAccessor(d)))
        .attr('cx', d => xScale(xAccessor(d)))
        .attr('fill', palette)
        .attr("stroke", "black");

    var lineGroup = selection.selectAll('.lineGames')
    lineGroup.data(data)
        .join('line')
        .attr("class", "lineGames")
        .transition()
        .attr("x1", d => xScale(xAccessor(d)))
        .attr("x2", d => xScale(xAccessor(d)))
        .attr("y1", d => yScale(salesAccessor(d)))
        .attr("y2", yScale(0))
        .attr("stroke", "grey")

    return selection;
}