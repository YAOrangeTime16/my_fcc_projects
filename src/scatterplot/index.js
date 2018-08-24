import { cyclistData } from './api';
import { tooltip } from './tooltip';
import './scatterplot.scss';

const svgW = 1000;
const svgH = 800;
const padding = 80;
const graphW = svgW - padding;
const graphH = svgH - padding;

const svg = d3.selectAll("#scatterplot").append("svg").attr("width", svgW).attr("height", svgH);

const xg = svg.append("g").attr("id", "x-axis");
const yg = svg.append("g").attr("id", "y-axis");

const xScale = d3.scaleLinear()
              .range([0, graphW - padding]);

const yScale = d3.scaleTime()
              .range([0, graphH - padding]);

cyclistData.then(data => {
  data.forEach(function (d) {
    const parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  const minYear = d3.min(data, d => d.Year)
  const maxYear = d3.max(data, d => d.Year)
  xScale.domain([+minYear - 1, +maxYear+1]);

  const minTime = d3.min(data, d => d.Time)
  const maxTime = d3.max(data, d => d.Time)
  yScale.domain([minTime, maxTime])

  const formatTime = d3.timeFormat("%M:%S");
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(formatTime)
  xg.attr("transform", `translate(${padding}, ${graphH})` ).call(xAxis);
  yg.attr("transform", `translate(${padding}, ${padding})`).call(yAxis);

  const dot = svg.selectAll("circle")
  .data(data)
  .enter()
  .append("circle")
  .attr("r", 7)
  .attr("cx", d => padding + xScale(d.Year))
  .attr("cy", d => padding + yScale(d.Time))
  .attr("class", "dot")
  .attr("data-xvalue", d => d.Year)
  .attr("data-yvalue", d => d.Time)
  .style("fill", d => d.Doping ? "#e96d6d" : "#4d914d")

  dot
  .on('mouseover', (d) => {
    tooltip
    .html(`
      <p>${d.Name} ( ${d.Nationality} )</p>
      <p>Year: ${d.Year}, Time: ${formatTime(d.Time)}</p>
      ${d.Doping && `<p>Doping: ${d.Doping}</p>` }
    `)
    .style("left", d3.event.pageX + 10 + "px")
    .style("bottom", graphH - d3.event.pageY + 120 + "px")
    .style("background", d.Doping ? "#e96d6d" : "#4d914d")
    .style("display", "block")
  })
  .on('mouseout', () => {
    tooltip.style("display", "none")
  })
})

