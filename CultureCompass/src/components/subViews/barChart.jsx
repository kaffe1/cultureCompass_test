import * as d3 from "d3";
import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";

export default function BarChart({ data }) {
  const mockdata = [
    { Wave: 5, Sex: "Male", Amount: 15 },
    { Wave: 5, Sex: "Female", Amount: 15 },
    { Wave: 6, Sex: "Male", Amount: 15 },
    { Wave: 6, Sex: "Female", Amount: 15 },
  ];
  const containerRef = useRef();

  useEffect(() => {
    if (data === undefined) return;

    const plot = Plot.plot({
      height: 200,
      width: 400,
      x: { axis: null },
      y: { tickFormat: "s", grid: true },
      color: { scheme: "Accent", legend: true },
      marks: [
        Plot.barY(data, { x: "Sex", y: "Amount", fill: "Sex", fx: "Wave" }), //X = Title X Y = Title Y  Fx = "Group by What?" , USE THIS: {x: "Sex", y: "Amount", fill:"Sex", fx:"Wave"}, ALT {x: "Wave", y: "Amount", fill:"Wave", fx:"Sex"} | Maybe this for data {x: "sex", y: "sex", fill:"sex", fx:"wave"}
        Plot.ruleY([0]),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);
  return (
    <>
      <div ref={containerRef}></div>
    </>
  );
}
