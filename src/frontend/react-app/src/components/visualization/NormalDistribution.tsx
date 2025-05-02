import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface NormalDistributionProps {
  mean?: number;
  stdDev?: number;
  width?: number;
  height?: number;
  updatedBy?: string;
}

const NormalDistribution: React.FC<NormalDistributionProps> = ({
  mean = 0,
  stdDev = 1,
  width = 600,
  height = 300,
  updatedBy = 'System'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentMean, setCurrentMean] = useState(mean);
  const [currentStdDev, setCurrentStdDev] = useState(stdDev);
  const [lastUpdatedBy, setLastUpdatedBy] = useState(updatedBy);

  // Function to calculate normal distribution PDF
  const normalPDF = (x: number, mean: number, stdDev: number) => {
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) *
           Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
  };

  // Generate data points
  const generateDistributionData = (mean: number, stdDev: number) => {
    const data = [];
    for (let x = -5; x <= 5; x += 0.1) {
      data.push({
        x: x,
        y: normalPDF(x, mean, stdDev)
      });
    }
    return data;
  };

  useEffect(() => {
    if (!svgRef.current) return;

    // Update state
    setCurrentMean(mean);
    setCurrentStdDev(stdDev);
    setLastUpdatedBy(updatedBy);

    // Set up D3.js visualization
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Remove any existing SVG elements
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X axis
    const x = d3.scaleLinear()
      .domain([-5, 5])
      .range([0, innerWidth]);

    svg.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x));

    // Y axis
    const y = d3.scaleLinear()
      .domain([0, 0.5])
      .range([innerHeight, 0]);

    svg.append("g")
      .call(d3.axisLeft(y));

    // Draw the distribution curve
    const line = d3.line<{x: number, y: number}>()
      .x(d => x(d.x))
      .y(d => y(d.y))
      .curve(d3.curveBasis);

    // Add the path with a unique ID
    svg.append("path")
      .datum(generateDistributionData(mean, stdDev))
      .attr("id", "distribution-curve")
      .attr("fill", "none")
      .attr("stroke", "var(--primary-color)")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add a vertical line at the mean
    svg.append("line")
      .attr("id", "mean-line")
      .attr("x1", x(mean))
      .attr("x2", x(mean))
      .attr("y1", 0)
      .attr("y2", innerHeight)
      .attr("stroke", "var(--primary-color)")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "5,5");

    // Add labels
    svg.append("text")
      .attr("id", "mean-label")
      .attr("text-anchor", "middle")
      .attr("x", x(mean))
      .attr("y", innerHeight + margin.bottom - 5)
      .style("font-size", "12px")
      .style("fill", "var(--primary-color)")
      .text(`μ = ${mean.toFixed(1)}, σ = ${stdDev.toFixed(1)}`);

  }, [mean, stdDev, updatedBy, width, height]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg ref={svgRef} className="chart" />
      <p style={{ fontStyle: 'italic', color: '#666', fontSize: '0.9em', marginTop: '5px' }}>
        Last updated by: {lastUpdatedBy}
      </p>
    </div>
  );
};

export default NormalDistribution;
