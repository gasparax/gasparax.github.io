const platformNames = {
    'Wii': 'Nintendo Wii',
    'NES': 'Nintendo Entertainment System',
    'GB': 'Game Boy',
    'DS': 'Nintendo DS',
    'X360': 'Xbox 360',
    'PS3': 'PlayStation 3',
    'PS2': 'PlayStation 2',
    'SNES': 'Super Nintendo Entertainment System',
    'GBA': 'Game Boy Advance',
    '3DS': 'Nintendo 3DS',
    'PS4': 'PlayStation 4',
    'N64': 'Nintendo 64',
    'PS': 'PlayStation',
    'XB': 'Xbox',
    'PC': 'Personal Computer',
    '2600': 'Atari 2600',
    'PSP': 'PlayStation Portable',
    'XOne': 'Xbox One',
    'GC': 'Game Cube',
    'WiiU': 'Wii U',
    'GEN': 'Sega Genesis',
    'DC': 'Sega Dreamcast',
    'PSV': 'PlayStation Vita',
    'SAT': 'Sega Saturn',
    'SCD': 'Sega CD',
    'WS': 'WonderSwan',
    'NG': 'Neo Geo',
    'TG16': 'TurboGrafx-16',
    '3DO': '3DO Interactive Multiplayer',
    'GG': 'Game Gear',
    'PCFX': 'PC-FX',
    'Misc': 'Miscellaneous'
}

function barChart(selection, data, widthBarChart, heightBarChart, fillColor) {
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

    // create tooltip element 
    const tooltip = d3.select('#barTooltip')

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
        console.log(d)
        const platform = platformNames[xAccessor(d)];
        const qta = yAccessor(d);
        tooltip
            .html("Console: " + platform + "<br>" + "Games produced: " + qta)
            .style('font-family', 'Quicksand, sans-serif')
            .style("text-align", "center")
            .style("opacity", 1)

    }
    const mousemove = function (event, d) {
        var xPos = xScale(xAccessor(d));
        var yPos = yScale(yAccessor(d));
        console.log(yPos)
        tooltip
            .style("left", (xPos) + 'px')
            .style("top", (yPos) + 'px')
    }
    const mouseleave = function (event, d) {
        tooltip
            .style("opacity", 0)
    }


    //tooltip colors
    staticColor = '#437c90';
    hoverColor = '#eec42d';
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
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        //transition restituisce una selection 
        //da cui è possibile chiamare funzioni per animare le transazioni
        .transition(updateTransition)
        .attr('width', xScale.bandwidth())
        .attr('height', d => heightBarChart - yScale(yAccessor(d)))
        .attr('fill', fillColor)
        //x0 è un nuovo attributo che crea D3 per i bin e indica il lower bound del bin
        .attr('x', d => xScale(xAccessor(d)))
        .attr('y', d => yScale(yAccessor(d)))
}