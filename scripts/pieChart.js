function pieChart(selection, data, widthPieChart, heightPieChart) {

    const radius = Math.min(widthPieChart, heightPieChart) / 2;

    d3.selectAll('.pieChartLabels').attr('opacity', 0);
    // Add the Pie
    //funzione pie formatta i dati
    const pie = d3.pie()
        .value(d => d.sales)
        .sort(null)
    const slices = pie(data);

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(element => element.region))
        .range(['#577590','#f3ca40','#f2a541'])

    const arcGroup = selection.selectAll('pieAcrs')
        .append('g')
        .classed('pieAcrs', true)

    //funzione arc disegna l'arco
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0);

    let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()());
    let innerRadiusInterpolation = d3.interpolate(0, 0);
    let outerRadiusInterpolation = d3.interpolate(0, radius);
    
    //draw shape
    selection.selectAll('path')
        .data(slices)
        .join('path')
        .attr(
            'transform',
            `translate(${widthPieChart / 2}, ${heightPieChart / 2})`)
        .attr('d', arc)
        .attr('fill', d => colorScale(d.data.region))
        .transition()
        .duration(1500)
        .attrTween("d", d => {
            let originalEnd = d.endAngle;
            return t => {
                let currentAngle = angleInterpolation(t);
                if (currentAngle < d.startAngle) {
                    return "";
                }
                d.endAngle = Math.min(currentAngle, originalEnd);
                return arc(d);
            };
        })
        .attr("stroke", "#203239")
        .style("stroke-width", "1.5px")
        .style("opacity", 1);

    selection.transition()
        .duration(500).tween("arcRadii", () => {
            return t => arc
                .innerRadius(innerRadiusInterpolation(t))
                .outerRadius(outerRadiusInterpolation(t));
        });

    //LABELS
    const labelsGroup = selection.append('g')
        .attr(
            'transform',
            `translate(${widthPieChart / 2}, ${heightPieChart / 2})`)
        .classed('pieChartLabels', true);

    const arcLabels = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius*0.45);

    var fontSize = radius*0.095
    labelsGroup.selectAll('text')
        .data(slices)
        .join('text')
        .attr('transform', d => `translate(${arcLabels.centroid(d)})`)
        .call(
            text => text.append('tspan')
                .attr( "fill-opacity", 0 ).transition().duration(2000)
                .attr( "fill-opacity", 1 )
                .style('font-weight', 'bold')
                .style('font-size', fontSize + 'px')
                .style("text-anchor", "middle")
                .attr('y', -4)
                .text(d => d.data.region)
        )
        .call(
            text => text
                .append('tspan')
                .attr( "fill-opacity", 0 ).transition().duration(2000)
                .attr( "fill-opacity", 1 )
                .style("text-anchor", "middle")
                .style('font-size', fontSize + 'px')
                .attr('y', fontSize*0.74)
                .attr('x', 0)
                .text(d => (d.data.sales) + ' Mln')
        );
}