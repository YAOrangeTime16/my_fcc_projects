export const w = 1000;
export const h = 600;
export const padding = 80;
export const svgInnerHeight = h - padding;
export const svgInnerWidth = w - padding;
export const barWidth = 3;

export const placeChart = d3.select("#chart");
export const svg = placeChart.append("svg").attr("id", "title").attr("width", w).attr("height", h);
export const xg = svg.append("g").attr("id", "x-axis").attr("class", "tick");
export const yg = svg.append("g").attr("id", "y-axis").attr("class", "tick");