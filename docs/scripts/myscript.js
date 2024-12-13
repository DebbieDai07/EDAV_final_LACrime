const data = [
  { year: 2020, class: 100, frequency: 1917 },
  { year: 2020, class: 200, frequency: 32959 },
  { year: 2020, class: 300, frequency: 68979 },
  { year: 2020, class: 400, frequency: 39430 },
  { year: 2020, class: 500, frequency: 30957 },
  { year: 2020, class: 600, frequency: 49018 },
  { year: 2020, class: 700, frequency: 33227 },
  { year: 2020, class: 800, frequency: 9794 },
  { year: 2020, class: 900, frequency: 19007 },
  { year: 2021, class: 100, frequency: 764 },
  { year: 2021, class: 200, frequency: 14596 },
  { year: 2021, class: 300, frequency: 28630 },
  { year: 2021, class: 400, frequency: 14046 },
  { year: 2021, class: 500, frequency: 12615 },
  { year: 2021, class: 600, frequency: 18663 },
  { year: 2021, class: 700, frequency: 14304 },
  { year: 2021, class: 800, frequency: 3490 },
  { year: 2021, class: 900, frequency: 7601 },
  { year: 2022, class: 100, frequency: 1340 },
  { year: 2022, class: 200, frequency: 26084 },
  { year: 2022, class: 300, frequency: 72929 },
  { year: 2022, class: 400, frequency: 27276 },
  { year: 2022, class: 500, frequency: 26057 },
  { year: 2022, class: 600, frequency: 36777 },
  { year: 2022, class: 700, frequency: 22941 },
  { year: 2022, class: 800, frequency: 6943 },
  { year: 2022, class: 900, frequency: 14854 },
  { year: 2023, class: 100, frequency: 1246 },
  { year: 2023, class: 200, frequency: 25386 },
  { year: 2023, class: 300, frequency: 64465 },
  { year: 2023, class: 400, frequency: 31750 },
  { year: 2023, class: 500, frequency: 26766 },
  { year: 2023, class: 600, frequency: 37375 },
  { year: 2023, class: 700, frequency: 22404 },
  { year: 2023, class: 800, frequency: 8225 },
  { year: 2023, class: 900, frequency: 14648 },
  { year: 2024, class: 100, frequency: 298 },
  { year: 2024, class: 200, frequency: 7529 },
  { year: 2024, class: 300, frequency: 31332 },
  { year: 2024, class: 400, frequency: 23485 },
  { year: 2024, class: 500, frequency: 21127 },
  { year: 2024, class: 600, frequency: 10671 },
  { year: 2024, class: 700, frequency: 10623 },
  { year: 2024, class: 800, frequency: 6668 },
  { year: 2024, class: 900, frequency: 4838 },
];

const classColors = {
  100: "#FBC4BF",
  200: "#ADD8E6",
  300: "#AEDCAE",
  400: "#CEC2EB",
  500: "#FED8B1",
  600: "#ACDFDD",
  700: "#FB9280",
  800: "#FAD16B",
  900: "#808080",
};

let selectedYear = "All";
let selectedClass = "All";

function updateChart() {
  let filteredData;
  if (selectedYear === "All" && selectedClass === "All") {
    filteredData = data;
  } else if (selectedYear === "All") {
    filteredData = data.filter((d) => d.class === +selectedClass);
  } else if (selectedClass === "All") {
    filteredData = data.filter((d) => d.year === +selectedYear);
  } else {
    filteredData = data.filter(
      (d) => d.year === +selectedYear && d.class === +selectedClass
    );
  }
  drawChart(filteredData);
}

function drawChart(filteredData) {
  const svg = d3.select("#chart");
  svg.selectAll("*").remove();

  const margin = { top: 20, right: 20, bottom: 50, left: 70 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const xDomain = [...new Set(filteredData.map((d) => d.year))];
  const xScale = d3.scaleBand().domain(xDomain).range([0, width]).padding(0.2);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(filteredData, (d) => d.frequency) || 0])
    .range([height, 0]);

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  g.append("g").call(d3.axisLeft(yScale)).attr("font-size", "12px");

  g.append("g")
    .call(d3.axisBottom(xScale))
    .attr("transform", `translate(0, ${height})`)
    .attr("font-size", "12px");
    
  svg.append("text")
  .attr("class", "x-axis-label")
  .attr("text-anchor", "middle")
  .attr("x", width / 2)
  .attr("y", height + margin.bottom - 3)
  .text("Year");

  
  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", `rotate(-90)`)
    .attr("x", -height / 2)
    .attr("y", margin.left - 55)
    .text("Frequency");


  if (selectedYear === "All" && selectedClass === "All") {
    const groupedData = d3.group(filteredData, (d) => d.year);
    const groupWidth = xScale.bandwidth();

    groupedData.forEach((values, year) => {
      values.forEach((d, i) => {
        g.append("rect")
          .attr("x", xScale(year) + (groupWidth / 9) * i)
          .attr("y", yScale(d.frequency))
          .attr("width", groupWidth / 9)
          .attr("height", height - yScale(d.frequency))
          .attr("fill", classColors[d.class]);
      });
    });
  } else {

    g.selectAll("rect")
      .data(filteredData)
      .join("rect")
      .attr("x", (d) => xScale(d.year))
      .attr("y", (d) => yScale(d.frequency))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.frequency))
      .attr("fill", (d) => classColors[d.class]);
  }
}


d3.selectAll(".year-button").on("click", function () {
  selectedYear = d3.select(this).attr("data-year");
  d3.selectAll(".year-button").classed("selected", false);
  d3.select(this).classed("selected", true);
  updateChart();
});

d3.selectAll(".class-button").on("click", function () {
  selectedClass = d3.select(this).attr("data-class");
  d3.selectAll(".class-button").classed("selected", false);
  d3.select(this).classed("selected", true);
  updateChart();
});


updateChart();
