import { useEffect, useRef } from "react";
import * as d3 from "d3";

// placeholder data to check if density plots work
const scoresA = {
  1: 0,
  2: 25,
  3: 25,
  4: 50,
};

const scoresB = {
  1: 0,
  2: 25,
  3: 50,
  4: 25,
};

function Density_plot({ Wave1, Wave2, small = false }) {
  const ref = useRef();

  useEffect(() => {
    // check for okay waves
    if (!Wave1 || !Wave2) return;

    // waves for plotting
    // console.log("Wave1: ", Wave1);
    // console.log("Wave2: ", Wave2);

    // clearing previous svg
    d3.select(ref.current).selectAll("*").remove();

    // size for graph
    const margin = small
        ? { top: 10, right: 10, bottom: 10, left: 10 }
        : { top: 30, right: 60, bottom: 30, left: 60 },
      width = (small ? 240 : 740) - margin.left - margin.right,
      height = (small ? 80 : 600) - margin.top - margin.bottom;

    // appending svg
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    //appending x and for now invisable y axis
    const x = d3.scaleLinear().domain([1, 4]).range([0, width]);

    const y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

    if (!small) {
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(
          d3
            .axisBottom(x)
            .ticks(4)
            .tickFormat((d) => {
              if (d === 1) return "1 (Not at all important)";
              if (d === 2) return "2 (Not very important)";
              if (d === 3) return "3 (Rather important)";
              if (d === 4) return "4 (Very important)";
              return d;
            }),
        );
    } else {
      // Small version - subtle bottom line across the width, no labels
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", height)
        .attr("x2", width)
        .attr("y2", height)
        .attr("stroke", "#ccc")
        .attr("stroke-width", 1);
    }

    //trying to convert waves to values for density function
    const distA = Wave1.dist;
    const distB = Wave2.dist;

    console.log("distA: ", Wave1.dist);

    // converting objects to arrays
    const valuesA = Object.entries(Wave1.dist).flatMap(([score, percentage]) =>
      Array(Math.round(percentage)).fill(Number(score)),
    );
    const valuesB = Object.entries(Wave2.dist).flatMap(([score, percentage]) =>
      Array(Math.round(percentage)).fill(Number(score)),
    );

    // Kernel density functions
    function kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map(function (x) {
          return [
            x,
            d3.mean(V, function (v) {
              return kernel(x - v);
            }),
          ];
        });
      };
    }

    function kernelEpanechnikov(k) {
      return function (v) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
      };
    }

    // kde with 0.5 for bandwith and 4 as threshold (need to look more in to the KDE to really understand why, I just tried thes and it looked ok)
    const kde = kernelDensityEstimator(kernelEpanechnikov(0.75), x.ticks(4));

    // computing kernel distance estimates
    const densityA = kde(valuesA);
    const densityB = kde(valuesB);

    //appending density plots
    svg
      .append("path")
      .datum(densityA)
      .attr("fill", small ? "none" : "none") // light fill for large chart
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", small ? 1.5 : 2)
      .style("opacity", small ? 0.7 : 1)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveMonotoneX)
          .x((d) => x(d[0]))
          .y((d) => y(d[1])),
      );

    svg
      .append("path")
      .datum(densityB)
      .attr("fill", small ? "none" : "none") // light fill for large chart
      .attr("stroke", "#404080")
      .attr("stroke-width", small ? 1.5 : 2)
      .style("opacity", small ? 0.7 : 1)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveMonotoneX)
          .x((d) => x(d[0]))
          .y((d) => y(d[1])),
      );

    // Add mean lines without intersection points
    function addMeanLine(meanValue, color) {
      if (meanValue === undefined || meanValue === null || isNaN(meanValue))
        return;

      const xPos = x(meanValue);

      const group = svg.append("g");

      // Dashed mean line
      group
        .append("line")
        .attr("x1", xPos)
        .attr("y1", height)
        .attr("x2", xPos)
        .attr("y2", 0)
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,4")
        .style("pointer-events", "none");

      // Tooltips container for Mean
      const tooltips = group
        .append("g")
        .style("opacity", 0)
        .style("pointer-events", "none");

      // Top label rect
      tooltips
        .append("rect")
        .attr("x", xPos - 35)
        .attr("y", -25)
        .attr("width", 70)
        .attr("height", 20)
        .attr("rx", 4)
        .attr("fill", color);

      // // Top label rect
      tooltips
        .append("polygon")
        .attr("points", `${xPos - 5},-5 ${xPos + 5},-5 ${xPos},0`)
        .attr("fill", color);

      // Top label text
      tooltips
        .append("text")
        .attr("x", xPos)
        .attr("y", -11)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(`Mean: ${meanValue.toFixed(1)}`);

      // Overlay line to capture hover interaction
      group
        .append("line")
        .attr("x1", xPos)
        .attr("y1", height)
        .attr("x2", xPos)
        .attr("y2", -25)
        .attr("stroke", "transparent")
        .attr("stroke-width", 20)
        .style("cursor", "crosshair")
        .on("mouseover", () => {
          tooltips.transition().duration(150).style("opacity", 1);
        })
        .on("mouseout", () => {
          tooltips.transition().duration(150).style("opacity", 0);
        });
    }

    // Add points and hover tooltips for the actual curves at 1, 2, 3, 4
    function addDataPoints(densityData, trueDist, color) {
      densityData.forEach((d) => {
        const xVal = d[0];
        const yVal = d[1];

        const xPos = x(xVal);
        const yPos = y(yVal);
        const percentage = Math.round(trueDist[xVal]) || 0;

        const group = svg.append("g");

        // Circle on the curve (constantly visible)
        group
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", yPos)
          .attr("r", 4)
          .attr("fill", color)
          .style("pointer-events", "none");

        // Tooltips container (visible on hover)
        const tooltips = group
          .append("g")
          .style("opacity", 0)
          .style("pointer-events", "none");

        // Percentage label
        tooltips
          .append("rect")
          .attr("x", xPos - 20)
          .attr("y", yPos - 30)
          .attr("width", 40)
          .attr("height", 20)
          .attr("rx", 4)
          .attr("fill", color);

        tooltips
          .append("polygon")
          .attr(
            "points",
            `${xPos - 5},${yPos - 10} ${xPos + 5},${yPos - 10} ${xPos},${yPos - 5}`,
          )
          .attr("fill", color);

        tooltips
          .append("text")
          .attr("x", xPos)
          .attr("y", yPos - 16)
          .attr("text-anchor", "middle")
          .attr("fill", "white")
          .attr("font-size", "12px")
          .attr("font-weight", "bold")
          .text(`${percentage}%`);

        // Invisible larger circle for easier hover area
        group
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", yPos)
          .attr("r", 15)
          .attr("fill", "transparent")
          .style("cursor", "crosshair")
          .on("mouseover", () => {
            tooltips.transition().duration(150).style("opacity", 1);
          })
          .on("mouseout", () => {
            tooltips.transition().duration(150).style("opacity", 0);
          });
      });
    }

    if (!small) {
      addMeanLine(Wave1.mean, "#69b3a2");
      addMeanLine(Wave2.mean, "#404080");

      addDataPoints(densityA, Wave1.dist, "#69b3a2");
      addDataPoints(densityB, Wave2.dist, "#404080");
    }
  }, [Wave1, Wave2, small]);

  if (!Wave1 || !Wave2) return null;

  return <div ref={ref}></div>;
}

export default Density_plot;
