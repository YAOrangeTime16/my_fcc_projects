import { cyclistData } from "./api";
import { tooltip } from "./tooltip";
import "./scatterplot.scss";

const svgW = 1000;
const svgH = 800;
const padding = 100;
const graphW = svgW - padding;
const graphH = svgH - padding;
const styles = {
  pink: "#e96d6d",
  green: "#4d914d"
};

const svg = d3
  .selectAll("#scatterplot")
  .append("svg")
  .attr("width", svgW)
  .attr("height", svgH);

const xg = svg.append("g").attr("id", "x-axis");
const yg = svg.append("g").attr("id", "y-axis");

const xScale = d3.scaleLinear().range([0, graphW - padding]);

const yScale = d3.scaleTime().range([0, graphH - padding]);

cyclistData.then(data => {
  data.forEach(function(d) {
    const parsedTime = d.Time.split(":");
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });

  const minYear = d3.min(data, d => d.Year);
  const maxYear = d3.max(data, d => d.Year);
  xScale.domain([+minYear - 1, +maxYear + 1]);

  const minTime = d3.min(data, d => d.Time);
  const maxTime = d3.max(data, d => d.Time);
  yScale.domain([minTime, maxTime]);

  const formatTime = d3.timeFormat("%M:%S");
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);
  xg.attr("transform", `translate(${padding}, ${graphH})`).call(xAxis);
  yg.attr("transform", `translate(${padding}, ${padding})`).call(yAxis);

  svg
    .append("text")
    .attr("x", 50)
    .attr("y", svgH / 2)
    .text("Time in minutes")
    .attr("transform", "rotate(270)")
    .style("transform-origin", "20px center");

  const dot = svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 7)
    .attr("cx", d => padding + xScale(d.Year))
    .attr("cy", d => padding + yScale(d.Time))
    .attr("class", "dot")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time)
    .style("fill", d => (d.Doping ? "#e96d6d" : styles.green));

  dot
    .on("mouseover", d => {
      tooltip
        .attr("data-year", d.Year)
        .html(
          `
      <p>${d.Name} ( ${d.Nationality} )</p>
      <p>Year: ${d.Year}, Time: ${formatTime(d.Time)}</p>
      ${d.Doping && `<p>Doping: ${d.Doping}</p>`}
    `
        )
        .style("left", d3.event.pageX + 10 + "px")
        .style("bottom", graphH - d3.event.pageY + 140 + "px")
        .style("background", d.Doping ? styles.pink : styles.green)
        .style("display", "block");
    })
    .on("mouseout", () => {
      tooltip.style("display", "none");
    });

  const legendClassOne = svg.append("g").attr("id", "legend");
  const legendClassTwo = svg.append("g").attr("id", "legend");

  legendClassOne
    .append("rect")
    .attr("x", graphW - 50)
    .attr("y", graphH - 200)
    .attr("width", "15px")
    .attr("height", "15px")
    .style("fill", styles.green);

  legendClassOne
    .append("text")
    .attr("x", graphW - 53)
    .attr("y", graphH - 188)
    .style("text-anchor", "end")
    .text("No doping allegations");

  legendClassTwo
    .append("rect")
    .attr("x", graphW - 50)
    .attr("y", graphH - 220)
    .attr("width", "15px")
    .attr("height", "15px")
    .style("fill", styles.pink);

  legendClassTwo
    .append("text")
    .attr("x", graphW - 53)
    .attr("y", graphH - 208)
    .style("text-anchor", "end")
    .text("Doping allegations");
});

// Title
svg
  .append("text")
  .attr("id", "title")
  .attr("x", svgW / 2)
  .attr("y", padding - 20)
  .style("text-anchor", "middle")
  .style("font-size", "36px")
  .text("Doping in Professional Bicycle Racing");

svg
  .append("text")
  .attr("x", svgW / 2)
  .attr("y", padding + 10)
  .style("text-anchor", "middle")
  .style("font-size", "22px")
  .text("35 Fastest times up Alpe d'Huez");
