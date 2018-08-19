import './barchart.scss';
import { allData } from './api.js';
import { tt, callTooltip } from './tooltip.js';
import {
  w,
  h,
  padding,
  svgInnerHeight,
  svgInnerWidth,
  barWidth,
  placeChart,
  svg,
  xg,
  yg
} from './variables';

allData.then(data => {
  let dataset = data.data;
  const dateFrom = new Date(data.from_date);
  const dateTo = new Date(data.to_date);
  const maxX = dataset.length;
  const maxY = d3.max(dataset, d => d[1]);
  
  //Scale for Axis values
  const xScale = d3.scaleTime()
                    .domain([dateFrom, dateTo])
                    .range([padding, svgInnerWidth]);
  const yScale = d3.scaleLinear()
                    .domain([0, maxY])
                    .range([svgInnerHeight, padding]);
  //Scale for x-axis's value x
  const xAxisRange = d3.scaleLinear()
                    .domain([0, maxX])
                    .range([padding, svgInnerWidth])

  //create bars
  const bar = svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("data-date", d=>d[0])
  .attr("data-gdp", d=>d[1])
  .style("height", d => svgInnerHeight - yScale(d[1]) )
  .style("width", barWidth + 'px')
  .attr("x", (d, i) => xAxisRange(i))
  .attr("y", (d) => yScale(d[1]));

  bar
  .on('mouseover', d => callTooltip(d))
  .on('mouseout', d => {
    tt.style("opacity", 0)
  })

  // setup axis
  const formatTime = d3.timeFormat("%Y");
  const xAxis = d3.axisBottom(xScale).tickFormat(formatTime);
  const yAxis = d3.axisLeft(yScale);
  
  const xAxisElement = xg.attr("transform", `translate(0, ${ svgInnerHeight })`).call(xAxis);
  const yAxisElement = yg.attr("transform", `translate(${padding}, 0)`).call(yAxis);

  yAxisElement.append("text").attr("className", "gdp")
  .style("fill", "#000")
  .style("font-size", 16)
  .style("text-anchor", "end")
  .attr("y", 30)
  .attr("x", -50)
  .attr("transform", "rotate(-90)")
  .text("Gross Domestic Product");
})

