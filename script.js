const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

// canvas sizes and padding
const width = 800
const height = 600
const padding = 60

let xScale // heightScale
let yScale
let xAxisScale
let yAxisScale

const svg = d3.select('svg')

function drawCanvas () {
  svg.attr('width', width)
  svg.attr('height', height)
}

// determins where to position bars and axis on the canvas
function positionScales (data) {
  xScale = d3.scaleLinear()
  // limit to max values in data
    .domain([0, d3.max(data, (d) => {
      return d[1]
    })])
  // limit to canvas size - padding
    .range([0, height - (2 * padding)])
  yScale = d3.scaleLinear()
  // limit to max index in data
    .domain([0, data.length - 1])
  // start from padding and limit to canvas - padding
    .range([padding, width - padding])

  // convert strings into dates
  const dates = data.map((d) => {
    return new Date(d[0])
  })

  xAxisScale = d3.scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding])

  yAxisScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => {
      return d[1]
    })])
    .range([height - padding, padding])
}

function drawBars (data) {
  const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('width', 'auto')
    .style('height', 'auto')

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', (width - (2 * padding)) / data.length)
    .attr('data-date', (d) => {
      return d[0]
    })
    .attr('data-gdp', (d) => {
      return d[1]
    })
    .attr('height', (d) => {
      return xScale(d[1])
    })
    .attr('x', (d, i) => {
      return yScale(i)
    })
    .attr('y', (d) => {
      return (height - padding) - xScale(d[1])
    })
    .attr('fill', '#032AA5')
  // .append("title")
  // .attr("id", "tooltip")
  // .text((d) => "Year: " + new Date(d[0]).getUTCFullYear() + ", GDP: " + d[1])
    .on('mouseover', (d) => {
      tooltip.transition()
        .style('visibility', 'visible')
      tooltip.text('Year: ' + new Date(d[0]).getUTCFullYear() + ', GDP: ' + d[1])
      document.querySelector('#tooltip').setAttribute('data-date', d[0])
    })
    .on('mouseout', (d) => {
      tooltip.transition()
        .style('visibility', 'hidden')
    })
}

function drawAxis () {
  const xAxis = d3.axisBottom(xAxisScale)
  svg.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0, ' + (height - padding) + ')')
  const yAxis = d3.axisLeft(yAxisScale)
  svg.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
}

// getting data
const req = new XMLHttpRequest()
req.open('GET', url, true)
req.send()
req.onload = function () {
  let data = JSON.parse(req.responseText)
  data = data.data
  // console.log(data)
  drawCanvas()
  positionScales(data)
  drawBars(data)
  drawAxis()
}

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     jsonData = JSON.stringify(data)
//     jsonData = JSON.parse(jsonData)
//     jsonData = jsonData.data
//     processData(jsonData)
//   })

// function processData(data) {
//   console.log(data);
// }

// lsof -i :3000
// kill -9 24549