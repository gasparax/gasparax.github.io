async function generateBubbles(filename) {
    // Data
    const dataset = await d3.json(filename);

    var nSections = dataset.length;
    var bubblesDistance = 600;
    var maxRadius = 175;

    let dimensions = {
        width: maxRadius,
        height: nSections * bubblesDistance,
        maxRadius: 380,
        margins: {
            top: 50,
            bottom: 25,
            left: 100,
            right: 25,
        }
    }

    const genreAccessor = (d) => d.genre;
    const qtAccessor = (d) => d.qta;

    const radiusScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, qtAccessor))
        .range([0, maxRadius])
        .nice();

    //Color Scaler
    var blues = d3.scaleOrdinal(d3.schemeAccent);

    var sectionDiv = d3.select('#sections');

    var svgSections = sectionDiv.append('svg')
        .attr('id', 'svgSections')
        .attr('height', dimensions.height);

    var topPadding = dimensions.maxRadius / 2;

    var ctr = svgSections.append('g')
        .attr('id', 'grpSections')
        .attr(
            'transform',
            `translate(${dimensions.margins.left}, ${topPadding})`
        );

    var bubble = ctr.selectAll('circle')
        .data(dataset)
        .join('circle')
        .classed('step', true)
        .attr('r', d => radiusScaler(qtAccessor(d)))
        .attr('cx', dimensions.width/2)
        .attr('cy', (d, i) => bubblesDistance * ((i % dataset.length)))
        .style('fill', blues);

    const labelsGruop = ctr.append('g');

    labelsGruop.selectAll('text')
        .data(dataset)
        .join('text')
        .text(d => genreAccessor(d))
        .attr('x', dimensions.width / 2)
        .attr('y', (d, i) => bubblesDistance * ((i % dataset.length)))
        .attr("text-anchor", "middle");
}