function donutChart(selection, data, widthDonutChart, heightDonutChart, genrePalette) {// set the dimensions and margins of the graph

  margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(widthDonutChart, heightDonutChart) / 2

  //Data Accessor
  const salesAccessor = d => d.sales
  const genreAccessor = d => d.genre

  // set the color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(element => genreAccessor(element)))
    .range(genrePalette);

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(d => d.sales)
    .sort(null);
  const data_ready = pie(data)

  // The arc generator
  const arc = d3.arc()
    .innerRadius(radius * 0.5)         // This is the size of the donut hole
    .outerRadius(radius * 0.8)

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()());

  let innerRadiusInterpolation = d3.interpolate(0, 0);
  let outerRadiusInterpolation = d3.interpolate(0, radius);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  selection
    .selectAll('allSlices')
    .data(data_ready)
    .join('path')
    .attr('d', arc)
    .attr('fill', d => color(genreAccessor(d.data)))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

  // Add the polylines between chart and labels:
  selection
    .selectAll('allPolylines')
    .data(data_ready)
    .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      const posA = arc.centroid(d) // line insertion in the slice
      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  const fontSize = 23;

  // Add the polylines between chart and labels:
  selection
    .selectAll('allLabels')
    .data(data_ready)
    .join('text')
    .call(
      text => text.append('tspan')
        .text(d => genreAccessor(d.data) + ' ')
        .style('font-size', fontSize)
    )
    .call(
      text => text.append('tspan')
        .text(d => salesAccessor(d.data) + ' Mln $')
        .style('font-weight', 'bold')
        .style('font-size', fontSize)
    )
    // .text(d => genreAccessor(d.data) + ' ' +  + ' Mln')
    .attr('transform', function (d) {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .style('text-anchor', function (d) {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
      return (midangle < Math.PI ? 'start' : 'end')
    })
}