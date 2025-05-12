import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

export const BubbleChart = ({ chartData }) => {
  const [emojisData, setEmojisData] = useState([]);
  const svgRef = useRef(null);

  useEffect(() => {
    if (chartData) {
      setEmojisData([]);
      let chartSortData = chartData;

      const newEmojisData = [];
      for (let i = 0; i < chartSortData.length; i++) {
        if (chartSortData[i]) {
          let emojiData = {
            text: chartSortData[i].emoji,
            value: chartSortData[i].count,
          };
          newEmojisData.push(emojiData);
        }
      }
      setEmojisData(newEmojisData);
    }
  }, [chartData]);

  useEffect(() => {
    if (emojisData.length > 0 && svgRef.current) {
      renderWordCloud();
    }
  }, [emojisData]);

  const renderWordCloud = () => {
    const width = svgRef.current.parentNode.offsetWidth;
    const height = svgRef.current.parentNode.offsetHeight || 500;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up the layout
    const layout = cloud()
      .size([width, height])
      .words(emojisData)
      .padding(50)
      .rotate(0)
      .fontSize((d) => Math.sqrt(d.value) * 5 + 9) // Scale font size between 9 and ~90
      .spiral("rectangular")
      .on("end", draw);

    layout.start();

    function draw(words) {
      // Create the visualization
      d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", (d) => `${d.size}px`)
        .style(
          "fill",
          () => d3.schemeCategory10[Math.floor(Math.random() * 10)]
        )
        .attr("text-anchor", "middle")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .text((d) => d.text)
        .append("title") // Add tooltip
        .text((d) => `${d.text}: ${d.value}`);
    }
  };

  return (
    <div id="word-cloud" style={{ minHeight: "100%", position: "relative" }}>
      <svg ref={svgRef} style={{ width: "100%", height: "100%" }}></svg>
    </div>
  );
};
