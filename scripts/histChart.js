function histChart(selection, data, widthBarChart, heightBarChart, fillColor) {
    //Creaiamo una sorta di buffer delle transazioni
    //che vengono fatte da d3.
    //ad ogni transazione è associato un ID che serve a d3 per
    //eseguire le tras. in ordine.
    const exitTransition = d3.transition().duration(200);
    const updateTransition = exitTransition.transition().duration(200);

    const xAccessor = (d) => d.platform;
    const yAccessor = (d) => d.qta;

    var xScale = d3.scaleBand()
        .range([0, widthBarChart])
        .domain(data.map(d => xAccessor(d)))
        .padding(0.2);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(data, yAccessor))
        .range([heightBarChart, 0])
        .nice();


    //Draw Bars
    selection.selectAll('rect')
        .data(data)
        .join(
            (enter) => enter.append('rect')
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('x', d => xScale(xAccessor(d)))
                .attr('y', heightBarChart),
            (update) => update,
            (exit) => exit.transition(exitTransition)
                .attr('y', heightBarChart)
                .attr('height', 0)
                .remove()
        )
        //transition restituisce una selection 
        //da cui è possibile chiamare funzioni per animare le transazioni
        .transition(updateTransition)
        .attr('width', xScale.bandwidth())
        .attr('height', d => heightBarChart - yScale(yAccessor(d)))
        .attr('fill', fillColor)
        //x0 è un nuovo attributo che crea D3 per i bin e indica il lower bound del bin
        .attr('x', d => xScale(xAccessor(d)))
        .attr('y', d => yScale(yAccessor(d)));
}