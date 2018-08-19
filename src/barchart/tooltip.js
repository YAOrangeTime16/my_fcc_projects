import { h } from './variables';
// Tooltip
export const tt = d3.select("body").append("div").attr("id", "tooltip").style("opacity", 0);

const quater = (d)=>{
  switch(d[0].slice(5, 7)){
    case '01':
      return 'Q1';
    case '04':
    return 'Q2';
    case '07':
      return 'Q3';
    case '10':
      return 'Q4';
    default:
      return;
  }
}

export const callTooltip = (d)=>{
  tt.html(`<p>${d[0].slice(0, 4)} ${quater(d)}</p><p>$${d[1]} billion</p>`)
  .attr("data-date", d[0])
  .style("opacity", 1)
  .style("left", d3.event.pageX - 80 + "px")
  .style("bottom", h - d3.event.pageY + 160 + "px")
}