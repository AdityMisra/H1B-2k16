const data = [
  { EMPLOYER_STATE: "CA", Total_Certified: 10567 },
  { EMPLOYER_STATE: "TX", Total_Certified: 8934 },
  { EMPLOYER_STATE: "NY", Total_Certified: 7621 },
  { EMPLOYER_STATE: "FL", Total_Certified: 5120 },
  { EMPLOYER_STATE: "WA", Total_Certified: 4823 },
  { EMPLOYER_STATE: "IL", Total_Certified: 4700 },
  { EMPLOYER_STATE: "NJ", Total_Certified: 4500 },
  { EMPLOYER_STATE: "PA", Total_Certified: 4000 },
  { EMPLOYER_STATE: "GA", Total_Certified: 3800 },
  { EMPLOYER_STATE: "MA", Total_Certified: 3700 },
  { EMPLOYER_STATE: "OH", Total_Certified: 3500 },
  { EMPLOYER_STATE: "MI", Total_Certified: 3300 },
  { EMPLOYER_STATE: "NC", Total_Certified: 3200 },
  { EMPLOYER_STATE: "VA", Total_Certified: 3100 },
  { EMPLOYER_STATE: "AZ", Total_Certified: 3000 },
  { EMPLOYER_STATE: "CO", Total_Certified: 2900 },
  { EMPLOYER_STATE: "MD", Total_Certified: 2800 },
  { EMPLOYER_STATE: "TN", Total_Certified: 2700 },
  { EMPLOYER_STATE: "MN", Total_Certified: 2600 },
  { EMPLOYER_STATE: "IN", Total_Certified: 2500 },
  { EMPLOYER_STATE: "MO", Total_Certified: 2400 },
  { EMPLOYER_STATE: "WI", Total_Certified: 2300 },
  { EMPLOYER_STATE: "CT", Total_Certified: 2200 },
  { EMPLOYER_STATE: "SC", Total_Certified: 2100 },
  { EMPLOYER_STATE: "AL", Total_Certified: 2000 },
  { EMPLOYER_STATE: "NV", Total_Certified: 1900 },
  { EMPLOYER_STATE: "KY", Total_Certified: 1800 },
  { EMPLOYER_STATE: "OR", Total_Certified: 1700 },
  { EMPLOYER_STATE: "OK", Total_Certified: 1600 },
  { EMPLOYER_STATE: "LA", Total_Certified: 1500 },
  { EMPLOYER_STATE: "UT", Total_Certified: 1400 },
  { EMPLOYER_STATE: "IA", Total_Certified: 1300 },
  { EMPLOYER_STATE: "AR", Total_Certified: 1200 },
  { EMPLOYER_STATE: "MS", Total_Certified: 1100 },
  { EMPLOYER_STATE: "KS", Total_Certified: 1000 },
  { EMPLOYER_STATE: "NM", Total_Certified: 900 },
  { EMPLOYER_STATE: "NE", Total_Certified: 800 },
  { EMPLOYER_STATE: "ID", Total_Certified: 700 },
  { EMPLOYER_STATE: "HI", Total_Certified: 600 },
  { EMPLOYER_STATE: "WV", Total_Certified: 500 },
  { EMPLOYER_STATE: "NH", Total_Certified: 400 },
  { EMPLOYER_STATE: "ME", Total_Certified: 300 },
  { EMPLOYER_STATE: "MT", Total_Certified: 200 },
  { EMPLOYER_STATE: "RI", Total_Certified: 100 },
  { EMPLOYER_STATE: "DE", Total_Certified: 50 },
  { EMPLOYER_STATE: "SD", Total_Certified: 40 },
  { EMPLOYER_STATE: "ND", Total_Certified: 30 },
  { EMPLOYER_STATE: "AK", Total_Certified: 20 },
  { EMPLOYER_STATE: "VT", Total_Certified: 10 },
  { EMPLOYER_STATE: "WY", Total_Certified: 5 },
];

// Dimensions of the SVG canvas
const width = 800;
const height = 600;
const margin = { top: 50, right: 50, bottom: 100, left: 100 };

// Create an SVG container
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Tooltip for interactivity
const tooltip = d3.select(".tooltip")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "1px solid #ccc")
  .style("padding", "5px")
  .style("border-radius", "5px")
  .style("pointer-events", "none");

// Track selected states
let selectedStates = [];

// Populate the dropdown menu with all states
const dropdown = d3.select("#stateDropdown");
dropdown.selectAll("option")
  .data(data.map(d => d.EMPLOYER_STATE))
  .enter()
  .append("option")
  .attr("value", d => d)
  .text(d => d);

// Function to update the chart
function updateChart() {
  // Filter data based on selected states
  const filteredData = data.filter(d => selectedStates.includes(d.EMPLOYER_STATE));

  // Create scales
  const xScale = d3.scaleBand()
    .domain(filteredData.map(d => d.EMPLOYER_STATE))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.Total_Certified)])
    .range([height - margin.bottom, margin.top]);

  // Remove old axes and labels
  svg.selectAll(".x-axis").remove();
  svg.selectAll(".y-axis").remove();
  svg.selectAll(".x-axis-label").remove();
  svg.selectAll(".y-axis-label").remove();
  svg.selectAll(".chart-title").remove();
  svg.selectAll(".value-text").remove();

  // Add new axes
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add axis labels and title
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height - 20)
    .style("text-anchor", "middle")
    .text("States");

  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .style("text-anchor", "middle")
    .text("Total Certified Applications");

  svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", 30)
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Certified H1B Applications by State");

  // Bind data to bars
  const bars = svg.selectAll(".bar")
    .data(filteredData, d => d.EMPLOYER_STATE);

  // Remove exiting bars
  bars.exit().remove();

  // Add new bars
  bars.enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", d => xScale(d.EMPLOYER_STATE))
  .attr("y", d => yScale(d.Total_Certified))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.Total_Certified))
  .attr("fill", "steelblue")
  .on("mouseover", (event, d) => {
    tooltip.style("visibility", "visible")
      .html(`<strong>State:</strong> ${d.EMPLOYER_STATE}<br><strong>Total Certified:</strong> ${d.Total_Certified}`);
    d3.select(event.target).attr("fill", "orange"); // Highlight the bar
  })
  .on("mousemove", event => {
    tooltip.style("top", `${event.pageY - 10}px`)
      .style("left", `${event.pageX + 10}px`);
  })
  .on("mouseout", (event, d) => {
    tooltip.style("visibility", "hidden");
    d3.select(event.target).attr("fill", "steelblue");
  });
  
const barText = svg.selectAll(".bar-text")
    .data(filteredData, d => d.EMPLOYER_STATE);

  // Remove old text
  barText.exit().remove();

  // Add new text
  barText.enter()
    .append("text")
    .attr("class", "bar-text")
    .attr("x", d => xScale(d.EMPLOYER_STATE) + xScale.bandwidth() / 2) // Center horizontally
    .attr("y", d => yScale(d.Total_Certified) - 5) // Slightly above the bar
    .attr("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "12px")
    .text(d => d.Total_Certified);

  // Update existing bars
  bars
    .attr("x", d => xScale(d.EMPLOYER_STATE))
    .attr("y", d => yScale(d.Total_Certified))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - margin.bottom - yScale(d.Total_Certified))
    .attr("fill", "steelblue");
}

// Handle "Add State" button click
d3.select("#addStateButton").on("click", () => {
  const selectedState = dropdown.node().value;
  if (!selectedStates.includes(selectedState)) {
    selectedStates.push(selectedState); // Add selected state
    updateChart(); // Update the chart
  }
});

// Handle "Remove State" button click
d3.select("#removeStateButton").on("click", () => {
  const selectedState = dropdown.node().value;
  const index = selectedStates.indexOf(selectedState);
  if (index > -1) {
    selectedStates.splice(index, 1); // Remove selected state
    updateChart(); // Update the chart
  }
});

// Initialize the chart with no states
updateChart();
