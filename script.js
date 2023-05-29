 let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json" 

 let req = new XMLHttpRequest()

 let data 
 let values = []

 let heighScale
 let xScale
 let xAxisScale
 let yAxisScale

 let width = 800
 let height = 600
 let padding = 40

 let svg = d3.select('svg')

 let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {
    heighScale = d3.scaleLinear()
    .domain([0,d3.max(values, (item) =>{
        return item[1]
    })])
    .range([0, height -(2*padding)])

    xScale = d3.scaleLinear()
    .domain([0, values.length -1])
    .range([padding, width - padding])

    let datesArray = values.map((item) =>{
        return new Date(item[0])
    })
    
    xAxisScale = d3.scaleTime()
    .domain([d3.min(datesArray), d3.max(datesArray)])
    .range([padding, width - padding])

    yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(values, (item) =>{
        return item[1]
    })])
    .range([height - padding, padding])
}

let drawBars = () => {

    let toolTip = d3.select('.chart')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility','hidden')

    svg.selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width -(2 * padding )) / values.length )
    .attr('data-date', (item) =>{
        return item[0]
    })
    .attr('data-gdp', (item) =>{
        return item[1]
    })
    .attr('height', (item) =>{
        return heighScale(item[1])
    })
    .attr('x', (item, index) =>{
        return xScale(index,item)
    })
    .attr('y', (item) => {
        return (height - padding) - heighScale(item[1])
    })
    .on('mouseover', (item) => {
        var posX = d3.event.pageX;
        var posY = d3.event.pageY;
        toolTip
          .attr('style','left:'+ posX +'px;top:'+ posY +'px; visibility: visible;')
          .html(item[0] + '<br /><strong>'+item[1]+'</strong>')
          document.querySelector('#tooltip').setAttribute('data-date', item[0])
        d3.select(this);
        
      })
      .on('mouseout', (item) => {
        d3.select(this);
        toolTip.attr('style', 'visibility: hidden;');
      })
      
    
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale)
    let yAxis = d3.axisLeft(yAxisScale)

    svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate('+ padding + ', 0)')
}

req.open("GET", url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)
    values = data.data
    console.log(values)
    drawCanvas()
    generateScales()
    drawBars()
    generateAxes()
}
req.send()