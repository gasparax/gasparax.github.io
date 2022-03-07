function donutChart(selection, data, widthDonutChart, heightDonutChart, palette) {
  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(widthDonutChart, heightDonutChart) / 2

  // //Sort Values
  data.sort(function (a, b) { return a.sales - b.sales });
  //Data Accessor
  const salesAccessor = d => d.sales
  const genreAccessor = d => d.genre

  // set the color scale
  // const colors = d3.quantize(d3.schemeRdYlGn,data.lenght)
  const colorScale = d3.scaleOrdinal()
    .domain(data.map(element => element.genre))
    .range(palette);

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
  if (selection.select('#titledonut').empty()) {
    selection.append('text')
      .attr('id', 'titledonut')
      .attr('y', -heightDonutChart / 2)
      .attr("text-anchor", "middle")
      .style("font-size", widthDonutChart * 0.02)
      .text("Total videogames sales based on genre");
  }


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
    tooltip
      .style("left", ((widthDonutChart * 0.55288)) + 'px')
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
  selection.selectAll('.donutslices')
    .data(slices)
    .join('path')
    .classed('donutslices', true)
    .attr('d', arc)
    .attr('fill', (d) => colorScale(d.data.genre))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    // .on("mouseleave", mouseleave)
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
    .attr("stroke", "#141E27")
    .style("stroke-width", "1.5 px")

  selection.transition()
    .duration(500).tween("arcRadii", () => {
      return t => arc
        .innerRadius(innerRadiusInterpolation(t))
        .outerRadius(outerRadiusInterpolation(t));
    });

  var lableFilter = 0.2;

  function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
  selection.selectAll('polyline').remove()
  // Add the polylines between chart and labels:
  selection.selectAll('polyline')
    .data(slices)
    .join('polyline')
    .filter((d) => (d.endAngle - d.startAngle) > lableFilter)
    .transition()
    .duration(1500)
    .attrTween("points", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        return [arc.centroid(d2), outerArc.centroid(d2), pos];
      };
    })
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .style("fill", "none");

  const fontSize = widthDonutChart * 0.015;

  selection.selectAll('.labelsdonut').remove()
  // Add the labels:
  selection.selectAll('.labelsdonut')
    .data(slices)
    .join('text')
    .classed('labelsdonut', true)
    .call(
      text => text.filter((d) => (d.endAngle - d.startAngle) > lableFilter)
        .text(d => genreAccessor(d.data) + ' ' + salesAccessor(d.data) + ' Mln $')
        .style('font-size', fontSize)
    )
    .attr("dy", ".35em")
    .transition().duration(1000)
    .attrTween("transform", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        var pos = outerArc.centroid(d2);
        pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      };
    })
    .styleTween("text-anchor", function (d) {
      this._current = this._current || d;
      var interpolate = d3.interpolate(this._current, d);
      this._current = interpolate(0);
      return function (t) {
        var d2 = interpolate(t);
        return midAngle(d2) < Math.PI ? "start" : "end";
      };
    });
}

function salesPercentage(data, genreSales) {
  const initialValue = 0;
  const sales = (accumulator, genre) => accumulator + genre.sales;
  var totalSales = data.reduce(sales, initialValue);
  return Math.round((genreSales * 100) / totalSales);
}