function donutChart(selection, data, widthDonutChart, heightDonutChart, palette) {
  margin = 40;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(widthDonutChart, heightDonutChart) / 2

  // //Sort Values
  data.sort(function (a, b) { return a.sales - b.sales });
  //Data Accessor
  const salesAccessor = d => d.sales
  const genreAccessor = d => d.genre

  // set the color scale
  // const colors = d3.quantize(d3.schemeRdYlGn,data.lenght)
  // const color = d3.scaleOrdinal()
  //   .domain(data.map(element => genreAccessor(element)))
  //   .range(palette.reverse());

  // Compute the position of each group on the pie:
  const pie = d3.pie()
    .value(d => d.sales)
    .sort(null);
  const slices = pie(data);

  // The arc generator
  var innerRadius = radius * 0.5;
  var outerRadius = radius * 0.8;
  const arc = d3.arc()
    .innerRadius(innerRadius)         // This is the size of the donut hole
    .outerRadius(outerRadius)

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9)

  //Title
  selection.append('text')
    .attr('id', 'titledonut')
    .attr('y', -heightDonutChart / 2)
    .attr("text-anchor", "middle")
    .style("font-size", widthDonutChart * 0.02)
    .text("Total videogames sales based on genre");


  var tooltip = d3.select('#donutTooltip');

  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function (event, d) {
    const genre = genreAccessor(d.data);
    const sales = salesAccessor(d.data);
    const salesPerc = salesPercentage(data, sales)
    tooltip
      .html("Genre: " + genre + "<br>"
        + "Sales: " + sales + " Mln $" 
        + "<br>" + salesPerc + "% of total sales")
      .style("font-family", "Quicksand, sans-serif")
      .style("font-size", radius * 0.08 + 'px')
      .style("opacity", 1);
  }

  const mousemove = function (event, d) {
    tooltip.style("transform", "translateY(-50%)")
      .style("transform", "translateX(-50%)")
      .style("left", ((widthDonutChart / 2)+25) + 'px')
      .style("top", (heightDonutChart / 2) + 'px')
  }

  const mouseleave = function (event, d) {
    tooltip
      .style("opacity", 0)
  }

  let angleInterpolation = d3.interpolate(pie.startAngle()(), pie.endAngle()());

  let innerRadiusInterpolation = d3.interpolate(0, innerRadius);
  let outerRadiusInterpolation = d3.interpolate(0, outerRadius);
  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  selection
    .selectAll('path')
    .data(slices)
    .join('path')
    .attr('d', arc)
    .attr('fill', (d, i) => palette[i])
    .attr("stroke", "#141E27")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
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

  selection.transition()
  .duration(500).tween("arcRadii", () => {
      return t => arc
          .innerRadius(innerRadiusInterpolation(t))
          .outerRadius(outerRadiusInterpolation(t));
  });

  // Add the polylines between chart and labels:
  lableFilter = 0.2
  selection
    .selectAll('allPolylines')
    .data(slices)
    .join('polyline')
    .attr("stroke", "black")
    .style("fill", "none")
    .filter((d) => (d.endAngle - d.startAngle) > lableFilter)
    .transition()
    .attr("stroke-width", 1)
    .attr('points', function (d) {
      const posA = arc.centroid(d) // line insertion in the slice
      const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
      return [posA, posB, posC]
    })

  const fontSize = widthDonutChart * 0.015;

  // Add the polylines between chart and labels:
  selection
    .selectAll('allLabels')
    .data(slices)
    .join('text')
    .call(
      text => text.filter((d) => (d.endAngle - d.startAngle) > lableFilter)
        .append('tspan')
        .text(d => genreAccessor(d.data) + ' ')
        .style('font-size', fontSize)
    )
    .call(
      text => text.filter((d) => (d.endAngle - d.startAngle) > lableFilter)
        .append('tspan')
        .text(d => salesAccessor(d.data) + ' Mln $')
        .style('font-weight', 'bold')
        .style('font-size', fontSize)
    )
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

function salesPercentage(data, genreSales) {
  const initialValue = 0;
  const sales = (accumulator, genre) => accumulator + genre.sales;
  var totalSales = data.reduce(sales, 0);
  return Math.round((genreSales * 100) / totalSales);
}