
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

// https://coolors.co/palette/cad2c5-84a98c-52796f-354f52-2f3e46
const genrePalette = [
    "#9b2226",
    "#ae2012",
    "#bb3e03",
    "#ca6702",
    "#ee9b00",
    "#e9d8a6",
    "#CAD2C5",
    "#84A98C",
    "#6B917E",
    "#507068",
    "#354F52",
    "#2F3E46"
];

// constants to define the size
// and margins of the vis area.
dimensions = {
    svgVis: {
        width: 800,
        height: 800
    },
    svgSumup: {
        width: 800,
        height: 1000
    }
}
var marginLineChart = { top: 50, right: 30, bottom: 30, left: 50 };
var widthLineChart = 600 - marginLineChart.left - marginLineChart.right;
var heightLineChart = 400 - marginLineChart.top - marginLineChart.bottom;

var marginBarChart = { top: 50, right: 30, bottom: 30, left: 50 };
var widthBarChart = 600 - marginBarChart.left - marginBarChart.right;
var heightBarChart = 400 - marginBarChart.top - marginBarChart.bottom;

var marginPieChart = { top: 50, right: 30, bottom: 30, left: 150 };
var widthPieChart = dimensions.svgVis.width - marginLineChart.left - marginLineChart.right;
var heightPieChart = widthPieChart;

var marginDonutChart = { top: 50, right: 30, bottom: 30, left: 100 };
var widthDonutChart = dimensions.svgVis.width - marginLineChart.left - marginLineChart.right;
var heightDonutChart = widthDonutChart;

async function scrollVis() {
    // Keep track of which visualization
    // we are on and which was the last
    // index activated. When user scrolls
    // quickly, we want to call all the
    // activate functions that they pass.
    var lastIndex = -1;
    var activeIndex = 0;

    // main svg used for visualization
    var svg = null;

    var visGroup = null;

    // When scrolling to a new section
    // the activation function for that
    // section is called.
    var activateFunctions = [];
    const filenameGenreSalesYearTrend = '../data_cleaning/dataset/salesTrend_data.json'
    const filenameGenreProdTrend = '../data_cleaning/dataset/devTrendPlatform_data.json'
    const filenameGenreSalesRegions = '../data_cleaning/dataset/salesRegions_data.json'
    var datasetGenreSalesYearTrend = await d3.json(filenameGenreSalesYearTrend);
    var datasetGenreProdTrend = await d3.json(filenameGenreProdTrend);
    var datasetGenreSalesRegions = await d3.json(filenameGenreSalesRegions);
    /**
     * chart
     *
     * @param selection - the current d3 selection(s)
     *  to draw the visualization in. For this
     *  example, we will be drawing it in #vis
     */


    var chart = function (selection) {
        selection.each(function (rawData) {
            // create svg and give it a width and height
            svg = d3.select(this)
                .append('svg')
                .attr('id', 'visSvgMain');
            visGroup = svg.append('g')
                .attr('id', 'visGroupMain');

            // this group element will be used to contain all
            // other elements.
            setupVis();
            setupSections();

        });
    };

    var setupVis = function () {

        setSizes()

        // create tooltip element 
        const tooltip = d3.select('#vis')
            .append("div")
            .style("opacity", 0)
            .attr("id", "barTooltip")
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style("padding", "10px")
            .style('transform', `translateY(${heightBarChart}px)`)

        const tooltipLineBubble = d3.select('#vis')
            .append("div")
            .style("opacity", 0)
            .attr("id", "bubbleTooltip")
            .style('position', 'absolute')
            .style('background', 'rgba(0,0,0,0.6)')
            .style('border-radius', '4px')
            .style('color', '#fff')
            .style("padding", "10px")

        //stacked line chart
        var stackedLineChart = visGroup.append('g')
            .attr('id', 'stackedline')
            .attr("transform",
                `translate(${marginLineChart.left},${marginLineChart.top})`)
            .attr('opacity', 0);

        //line chart
        var lineChart = visGroup.append('g')
            .attr('id', 'linechart')
            .attr("transform",
                `translate(${marginLineChart.left},${marginLineChart.top})`)
            .attr('opacity', 0);

        // Initialise lineChart X axis:
        lineChart.append("g")
            .attr("transform", "translate(0," + heightLineChart + ")")
            .attr("id", "lineChartXAxis")
        //Aggiugo la label all'asse x
        d3.select('#lineChartXAxis')
            .append('text')
            .text('Years')
            .attr("text-anchor", "middle")
            .style('font-size', heightLineChart * 0.04)
            .attr('x', widthLineChart / 2)
            .attr('y', marginBarChart.bottom + 5)
            .attr('fill', 'black');

        // Initialize lineChart Y axis
        lineChart.append("g")
            .attr("id", "lineChartYAxis")
        //Aggiugo la label all'asse y
        d3.select('#lineChartYAxis').append('text')
            .attr('x', - (heightLineChart / 2))
            .attr('y', - marginBarChart.left + 15)
            .text('Videogames Sold (in millions $)')
            .attr("text-anchor", "middle")
            .style('font-size', heightLineChart * 0.04)
            .attr('fill', 'black').style('transform', 'rotate(270deg)');

        //bar chart
        var barChart = visGroup.append('g')
            .attr('id', 'barchart')
            .attr('transform',
                `translate(${marginBarChart.left},${marginLineChart.top + heightLineChart + marginBarChart.top})`)
            .attr('opacity', 0);

        // Initialise barChart X axis:
        barChart.append('g')
            .style('transform', `translateY(${heightBarChart}px)`)
            .attr("id", "barChartXAxis");
        //Aggiugo la label all'asse x
        d3.select('#barChartXAxis')
            .append('text')
            .text('Platforms')
            .attr("text-anchor", "middle")
            .style('font-size', heightBarChart * 0.04)
            .attr('x', widthBarChart / 2)
            .attr('y', marginBarChart.bottom + 5)
            .attr('fill', 'black');

        // Initialize barChart Y axis    
        barChart.append("g")
            .attr("id", "barChartYAxis");

        //Aggiugo la label all'asse y
        d3.select('#barChartYAxis').append('text')
            .attr('x', - (heightBarChart / 2))
            .attr('y', - marginBarChart.left + 15)
            .text('Videogames Produced')
            .attr("text-anchor", "middle")
            .style('font-size', heightBarChart * 0.04)
            .attr('fill', 'black').style('transform', 'rotate(270deg)');

        //pie chart
        var pieChart = visGroup.append('g')
            .attr('id', 'piechart')
            .attr('transform',
                `translate(${marginLineChart.left + widthLineChart + marginPieChart.left}
                    ,${dimensions.svgVis.height * 0.25})`)
            .attr('opacity', 0);
    };


    var updateVisSection = function (index, lineChartData, barChartData, pieChartData) {
        setSizes()
        // line chart
        const lineChartSelection = d3.select('#linechart');
        const parseDate = d3.timeParse('%Y');
        const xLineChartAccessor = d => parseDate(d.year)
        const yLineChartAccessor = d => parseInt(d.sales)

        const xLineChartScale = d3.scaleTime()
            .domain(d3.extent(lineChartData, xLineChartAccessor))
            .range([0, widthLineChart]);

        const yLineChartScale = d3.scaleLinear()
            .domain([0, d3.max(lineChartData, yLineChartAccessor)])
            .range([heightLineChart, 0])
            .nice();

        var xLineChartAxis = d3.axisBottom(xLineChartScale);
        var yLineChartAxis = d3.axisLeft(yLineChartScale);

        // Create the line chart X axis:
        lineChartSelection.select("#lineChartXAxis")
            .transition()
            .duration(500)
            .call(xLineChartAxis);

        // create the line chart Y axis
        lineChartSelection.select("#lineChartYAxis")
            .transition()
            .duration(500)
            .call(yLineChartAxis);

        lineChart(lineChartSelection, lineChartData, widthLineChart, heightLineChart, genrePalette[genreList.length - 1 - index]);
        lineChartSelection.attr('opacity', 1.0)

        const barChartSelection = d3.select('#barchart');
        //Data accessor
        const xBarChartAccessor = (d) => d.platform;
        const yBarChartAccessor = (d) => d.qta;

        // sort data
        barChartData.sort(function (b, a) {
            return yBarChartAccessor(a) - yBarChartAccessor(b);
        });

        var xBarChartScale = d3.scaleBand()
            .range([0, widthBarChart])
            .domain(barChartData.map(d => xBarChartAccessor(d)))
            .padding(0.2);

        var yBarChartScale = d3.scaleLinear()
            .domain(d3.extent(barChartData, yBarChartAccessor))
            .range([heightBarChart, 0])
            .nice();

        const xBarChartAxis = d3.axisBottom(xBarChartScale);
        const yBarChartAxis = d3.axisLeft(yBarChartScale);

        // Create the bar chart X axis:
        barChartSelection.select("#barChartXAxis")
            .transition()
            .duration(500)
            .call(xBarChartAxis);

        // create the bar chart Y axis
        barChartSelection.select("#barChartYAxis")
            .transition()
            .duration(500)
            .call(yBarChartAxis);

        barChartSelection.attr('opacity', 1.0)
        barChart(barChartSelection, barChartData, widthBarChart, heightBarChart, genrePalette[genreList.length - 1 - index])

        //pie chart update
        const pieChartSelection = d3.select('#piechart');
        pieChartSelection.attr('opacity', 1.0)
        pieChart(pieChartSelection, pieChartData, widthPieChart, heightPieChart)

    }

    /**
     * setupSections - each section is activated
     * by a separate function. Here we associate
     * these functions to the sections based on
     * the section's index.
     *
     */
    var setupSections = function () {
        // activateFunctions are called each
        // time the active section changes
        activateFunctions[0] = showLineChart;

    };


    /**
     * ACTIVATE FUNCTIONS
     *
     * These will be called their
     * section is scrolled to.
     *
     * General pattern is to ensure
     * all content for the current section
     * is transitioned in, while hiding
     * the content for the previous section
     * as well as the next section (as the
     * user may be scrolling up or down).
     *
     */

    /**
     * showTitle - initial title
     *
     * hides: count title
     * (no previous step to hide)
     * shows: intro title
     *
     */

    function showLineChart(index) {
        var productionData = getGenreTrend(datasetGenreSalesYearTrend, index);
        var platformProdData = getGenrePlatform(datasetGenreProdTrend, index)
        var regionSalesData = getGenreRegionSales(datasetGenreSalesRegions, index)
        updateVisSection(index, productionData, platformProdData, regionSalesData)
    }

    /**
     * Function to extract the production trend based in the genre
     * @param dataset 
     * @param gnereIndex 
     * @returns 
     */
    var getGenreTrend = (dataset, gnereIndex) => {
        foundGenre = dataset.find(element => element.genre == genreList[gnereIndex]);
        return foundGenre.production;
    };

    var getGenrePlatform = (dataset, gnereIndex) => {
        foundGenre = dataset.find(element => element.genre == genreList[gnereIndex]);
        return foundGenre.platformProduction;
    };

    var getGenreRegionSales = (dataset, gnereIndex) => {
        foundGenre = dataset.find(element => element.genre == genreList[gnereIndex]);
        return foundGenre.regions;
    };

    /**
 * activate -
 *
 * @param index - index of the activated section
 */
    chart.activate = function (index) {
        activeIndex = index;
        var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
        var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
        scrolledSections.forEach(function (i) {
            d3.select('#piechart').attr('opacity', 0)
            showLineChart(i);
        });
        lastIndex = activeIndex;
    };

    // return chart function
    return chart;

};

async function setupScrollSection(filename, scrollSection) {
    // Data
    const dataset = await d3.json(filename);

    var nSections = dataset.length;
    var bubblesDistance = 600;
    var maxRadius = 175;

    let dimensions = {
        width: maxRadius,
        height: nSections * bubblesDistance,
        margins: {
            top: 30,
            bottom: 25,
            left: 30,
            right: 30,
        }
    }

    const genreAccessor = (d) => d.genre;
    const qtAccessor = (d) => d.qta;

    var widthSectionsDiv = parseInt(d3.select('#sections').style('width'), 10)

    dimensions.width = widthSectionsDiv - dimensions.margins.left - dimensions.margins.right;
    maxRadius = Math.min(dimensions.width, dimensions.height) / 2;
    bubblesDistance = dimensions.width * 1.8
    dimensions.height = nSections * bubblesDistance;

    const radiusScaler = d3.scaleLinear()
        .domain(d3.extent(dataset, qtAccessor))
        .range([0, maxRadius])
        .nice();

    //Draw the scrolling bubbles
    var svgSections = scrollSection.append('svg')
        .attr('id', 'svgSections')
        .attr('height', dimensions.height + maxRadius);

    var labelSpace = maxRadius * 0.08;
    var topPadding = (dimensions.width) + labelSpace;

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
        .attr('cx', dimensions.width / 2)
        .attr('cy', (d, i) => bubblesDistance * ((i % dataset.length)))
        .style('fill', (d, i) => genrePalette[genreList.length - 1 - i]);

    const labelsGruop = ctr.append('g');
    const fontSize = maxRadius * 0.165;
    labelsGruop.selectAll('text')
        .data(dataset)
        .join('text')
        .call(
            text => text.append('tspan')
                .text(d => genreAccessor(d))
                .attr('x', dimensions.width / 2)
                .attr('y', (d, i) =>
                    (bubblesDistance * ((i % dataset.length))) - labelSpace - radiusScaler(qtAccessor(d)))
                .attr("text-anchor", "middle")
                .style('font-size', fontSize + 10)
        )
        .call(
            text => text.append('tspan')
                .text(d => qtAccessor(d) + ' - Produced Games')
                .attr('x', dimensions.width / 2)
                .attr('y', (d, i) =>
                    (bubblesDistance * ((i % dataset.length))) + labelSpace + 20 + radiusScaler(qtAccessor(d)))
                .attr("text-anchor", "middle")
                .style('font-size', fontSize)
        );

    // create a new plot and
    // display it
    var plot = await scrollVis();

    d3.select('#vis').call(plot);

    // setup scroll functionality
    var scroll = scroller()
        .container(scrollSection);

    // pass in .step selection as the steps
    scroll(d3.selectAll('.step'));

    // setup event handling
    scroll.on('active', function (index) {
        // highlight current step text
        d3.selectAll('.step')
            .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });

        // activate current section
        plot.activate(index);
    });
}

function salesRange(data, startYear, endYear) {
    var sales = []
    data.forEach(element => {
        var genreSales = { genre: element.genre }
        var accumulator = 0;
        element.production.forEach(genreElement => {
            const elemYear = genreElement.year;
            if (elemYear >= startYear && elemYear <= endYear) {
                accumulator += genreElement.sales;
            }
        });
        genreSales.sales = Math.round(accumulator * 100) / 100;
        sales.push(genreSales);
    });
    return sales;
}

function generateArrayOfYears() {
    var years = [];
    var endYear = 2015;
    var startYear = 1980;
    while (startYear <= endYear) {
        years.push(startYear++);
    }
    return years;
}


function darwDonutChart(datasetDonut) {
    var width = parseInt(d3.select('#svgsumup').style('width'), 10);
    var height = parseInt(d3.select('#svgsumup').style('height'), 10);
    var widthSlider = parseInt(d3.select('#slider').style('width'), 10);
    var heightSlider = parseInt(d3.select('#slider').style('height'), 10);
    var margin = 50;
    height = (width * 0.85 / 2);

    //setup svg area and tooltip for the initial donut chart
    const donutSvg = d3.select('#svgsumup')
        .attr('height', height)

    const donutGroup = donutSvg.append('g')
        .attr('id', 'donutchart')
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const donutTooltip = d3.select('#sumup')
        .append('div')
        .attr('id', 'donutTooltip')
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .style("opacity", 0)
        .style('position', 'absolute')
        .style('background', 'rgba(0,0,0,0.6)')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .style("padding", "10px")

    //Setup donut chart
    setupSlider()

    function setupSlider() {
        var data = generateArrayOfYears();
        // Step
        var sliderStep = d3
            .sliderLeft()
            .min(d3.min(data))
            .max(d3.max(data))
            .width(widthSlider)
            .height(height * 0.9)
            .tickFormat(d3.format(''))
            .ticks(10)
            .step(1)
            .default([1980, 2016])
            .fill('#2196f3')
            .on('onchange', val => {
                updateDonutChart(val[0], val[1]);
            });

        var gStep = d3
            .select('#slider')
            .append('svg')
            .attr('width', 100)
            .attr('height', height)
            .append('g')
            .attr("transform", `translate(80, 30)`);

        gStep.call(sliderStep);
    }

    function updateDonutChart(startYear, endYear) {
        var data = salesRange(datasetDonut, startYear, endYear)
        donutChart(donutGroup, data, width - margin, height - margin, genrePalette)
    }
    updateDonutChart(1980, 2016);

}

function drawTrendSumup(datasetTrend) {
    var width = parseInt(d3.select('#svgtrendsumup').style('width'));
    var height = parseInt(d3.select('#svgtrendsumup').style('height'));
    var margin = 100;
    width = width - (margin * 2);
    height = (width * 0.6) - margin * 2;
    //setup svg area and tooltip for the initial donut chart
    const trendSumup = d3.select('#svgtrendsumup')
        .attr('height', height)

    const trendGroup = trendSumup.append('g')
        .attr('id', 'trendchart')
        .attr("transform", `translate(${margin}, ${margin / 2})`);

    const parseDate = d3.timeParse('%Y');
    const xAccessor = d => parseDate(d.year)
    const yAccessor = d => parseInt(d.sales)

    const marginLeft = 50

    const xScale = d3.scaleTime()
        .domain([d3.min(datasetTrend, xAccessor), d3.max(datasetTrend, xAccessor)])
        .range([0, width - marginLeft]);

    const yScale = d3.scaleLinear()
        .range([height-margin, 0])
        .nice();

    const stack = d3.stack()
        .keys(genreList);

    const stackedData = stack(datasetTrend);
    yScale.domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])])


    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    // Initialise lineChart X axis:
    trendGroup.append("g")
        .attr("id", "trendChartXAxis")
        .attr("transform", `translate(${0}, ${height - margin})`);

    //Aggiugo la label all'asse x
    d3.select('#trendChartXAxis')
        .append('text')
        .text('Years')
        .attr("text-anchor", "middle")
        .style('font-size', height * 0.04)
        .attr('x', width / 2)
        .attr('y', marginBarChart.bottom + 5)
        .attr('fill', 'black');

    // Initialize trend Chart Y axis
    trendGroup.append("g")
        .attr("id", "trendChartYAxis")
    //Aggiugo la label all'asse y
    d3.select('#trendChartYAxis').append('text')
        .attr('x', - (height / 2) + margin / 2)
        .attr('y', - margin / 2)
        .text('Videogames Sold (in millions $)')
        .attr("text-anchor", "middle")
        .style('font-size', height * 0.04)
        .attr('fill', 'black').style('transform', 'rotate(270deg)');

    // Create the line chart X axis:
    trendGroup.select("#trendChartXAxis")
        .transition()
        .duration(500)
        .call(xAxis);

    // create the line chart Y axis
    trendGroup.select("#trendChartYAxis")
        .transition()
        .duration(500)
        .call(yAxis);

    stackedLineChart(trendGroup, datasetTrend, width, height - margin, marginLeft, genrePalette)
}



function setSizes() {
    dimensions.svgVis.width = parseInt(d3.select('#visSvgMain').style('width'), 10);
    dimensions.svgVis.height = parseInt(d3.select('#visSvgMain').style('height'), 10);

    widthLineChart = dimensions.svgVis.width * 0.5 - marginLineChart.left - marginLineChart.right;
    heightLineChart = dimensions.svgVis.height / 2 - marginLineChart.top - marginLineChart.bottom;

    widthBarChart = dimensions.svgVis.width * 0.8 - marginBarChart.left - marginBarChart.right;
    heightBarChart = dimensions.svgVis.height / 2 - marginBarChart.top - marginBarChart.bottom;

    widthPieChart = dimensions.svgVis.width * 0.5 - marginPieChart.left - marginPieChart.right;
    heightPieChart = widthPieChart;

    widthDonutChart = dimensions.svgSumup.width - marginDonutChart.left - marginDonutChart.right;
    heightDonutChart = widthDonutChart;
};

async function drawing() {
    const filenameBubble = '../data_cleaning/dataset/bubble_data.json';
    const filenameDonut = '../data_cleaning/dataset/genreSales_data.json';
    const filenameGenreSalesYearTrend = '../data_cleaning/dataset/salesTrend_data.json'
    const filenameGenreTrend = '../data_cleaning/dataset/salesTrendStack_data.json'
    const datasetDonut = await d3.json(filenameGenreSalesYearTrend);
    const datasetTrend = await d3.json(filenameGenreTrend);
    darwDonutChart(datasetDonut);
    drawTrendSumup(datasetTrend);
    var scrollSection = d3.select('#sections');
    setupScrollSection(filenameBubble, scrollSection);
}

drawing()