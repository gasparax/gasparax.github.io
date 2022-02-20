
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

const genrePalette = [
    "#9b2226",
    "#ae2012",
    "#bb3e03",
    "#ca6702",
    "#ee9b00",
    "#e9d8a6",
    "#94d2bd",
    "#0a9396",
    "#005f73",
    "#aacc00",
    "#55a630",
    "#007f5f"
];

// constants to define the size
// and margins of the vis area.
dimensions = {
    svgVis: {
        width: 800,
        height: 800
    }
}
var marginLineChart = { top: 50, right: 30, bottom: 30, left: 50 };
var widthLineChart = 600 - marginLineChart.left - marginLineChart.right;
var heightLineChart = 400 - marginLineChart.top - marginLineChart.bottom;

var marginBarChart = { top: 50, right: 30, bottom: 30, left: 50 };
var widthBarChart = 600 - marginBarChart.left - marginBarChart.right;
var heightBarChart = 400 - marginBarChart.top - marginBarChart.bottom;

var marginPieChart = { top: 50, right: 30, bottom: 30, left: 100 };
var widthPieChart = dimensions.svgVis.width - marginLineChart.left - marginLineChart.right;
var heightPieChart = widthPieChart;

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
    // If a section has an update function
    // then it is called while scrolling
    // through the section with the current
    // progress through the section.
    var updateFunctions = [];
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

        setSizesUpdate()

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
                `translate(${marginLineChart.left + widthLineChart + marginPieChart.left},${marginBarChart.top})`)
            .attr('opacity', 0);
    };


    var updateVisSection = function (index, lineChartData, barChartData, pieChartData) {
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

        lineChart(lineChartSelection, lineChartData, widthLineChart, heightLineChart);
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
        histChart(barChartSelection, barChartData, widthBarChart, heightBarChart, genrePalette[index])

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

    var svgSections = scrollSection.append('svg')
        .attr('id', 'svgSections')
        .attr('height', dimensions.height);

    var labelSpace = 20;
    var topPadding = (dimensions.maxRadius / 2) + labelSpace;

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
        .style('fill', (d, i) => genrePalette[i]);

    const labelsGruop = ctr.append('g');
    const fontSize = 22;
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
                    (bubblesDistance * ((i % dataset.length))) + labelSpace + 10 + radiusScaler(qtAccessor(d)))
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

function setSizesUpdate() {
    dimensions.svgVis.width = parseInt(d3.select('#visSvgMain').style('width'), 10);
    dimensions.svgVis.height = parseInt(d3.select('#visSvgMain').style('height'), 10);

    widthLineChart = dimensions.svgVis.width * 0.5 - marginLineChart.left - marginLineChart.right;
    heightLineChart = dimensions.svgVis.height / 2 - marginLineChart.top - marginLineChart.bottom;

    widthBarChart = dimensions.svgVis.width * 0.8 - marginBarChart.left - marginBarChart.right;
    heightBarChart = dimensions.svgVis.height / 2 - marginBarChart.top - marginBarChart.bottom;

    widthPieChart = dimensions.svgVis.width * 0.5 - marginPieChart.left - marginPieChart.right;
    heightPieChart = widthPieChart;
};

function drawing() {
    const filename_bubble = '../data_cleaning/dataset/bubble_data.json';

    var scrollSection = d3.select('#sections');
    setupScrollSection(filename_bubble, scrollSection);
}

drawing()
// window.addEventListener('resize', setSizesUpdate);