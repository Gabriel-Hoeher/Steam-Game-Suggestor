import * as imageSearch from './imagesearch.js';

window.onload = () => {
    //Sets background image
    const id = document.getElementById('ID').innerHTML;
    imageSearch.getBackgroundImage(id);

    //Sets header 
    let headerImg = document.getElementById('gameImg');
    headerImg.appendChild(imageSearch.getHeaderImage(id));
    
    // gets the ratings and determisn the positive to negative ratio, this data will be passed onto the graph
    let ratingData = [
        {"rating": "Positive", "score": parseInt(document.getElementById("ratingData").innerHTML)},
        {"rating": "Negative", "score": parseInt(100-document.getElementById("ratingData").innerHTML)}
    ]
    // Generates the ratings graph
    generateGraph(ratingData)    
}


// Generates the ratings graph based on the positive to negative reviews ratios
function generateGraph(ratingData){
    $('svg').remove();

    // Assigns parameters for size 
    const margin = 50;
    const width = 300;
    const height = 400;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Gets the scale for the axis' and assigns the colours
    const colourScale = d3.scaleLinear()
                            .domain([0, 100])
                            .range(['#d10808', '#3ded1a']);

    // Gets the data for the x scale
    const xScale = d3.scaleBand() // discrete, bucket
                        .domain(ratingData.map((data) => data.rating))
                        .range([0, chartWidth])
                        .padding(0.1);
                        
    // Gets the data for the y scale
    const yScale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([chartHeight, 0]);

    // Sets the width and the height for the svg
    let svg = d3.select('body')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);

    // Appends the data, applies an ID, and formats the text for the title of the graph
    svg.attr("id", "graph")
    svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .style('fill', '#f0f8ff')
            .text('Rating');

    // Creates a group of bars
    let g = svg.append('g')
                    .attr('transform', `translate(${margin}, ${margin})`);

    // Sets the y-Axis
    g.append('g')
        .style('color', '#f0f8ff')
        .call(d3.axisLeft(yScale));


    // Sets the x-Axis
    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .style('color', '#f0f8ff')
        .call(d3.axisBottom(xScale));

    // recieves the data and generates the rectangles
    let x = 0;
    let rectangles = g.selectAll('rect')
        .data(ratingData)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.rating))
                .attr('y', (data) => chartHeight)
                .attr('width', xScale.bandwidth())
                .attr('height', (data) => 0)
                .attr('fill', (data) => {
                    if (x == 0) {
                        x += 1; 
                        return 'rgb(0,255,0)';
                    } 
                    else {
                        return 'rgb(255,0,0)';
                    }
                });

    // Properly sets the rectangles in the graph
    rectangles.transition()
        .ease(d3.easeElastic)
        .attr('height', (data) => chartHeight - yScale(data.score))
        .attr('y', (data) => yScale(data.score))
        .duration(1000)
        .delay((data, index) => index * 50);
}