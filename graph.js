// graph dims
let dims = { height: 300, width: 400, radius: 150 };

const container = d3.select(".graph-container");

const svg = container
  .append("svg")
  .attr("height", dims.height + 150)
  .attr("width", dims.width + 150 + 100);

const graph = svg
  .append("g")
  .attr("height", dims.height)
  .attr("width", dims.width)
  .attr("class", "graph")
  .attr(
    "transform",
    `translate(${(dims.width + 150) / 2}, ${(dims.height + 150) / 2})`
  );

const legend = svg
  .append("g")
  .attr("transform", `translate(${dims.width + 50}, 70)`)
  .attr("class", "legend");

const pie = d3
  .pie()
  .sort(null)
  .value((d) => d.cost);

const arc = d3
  .arc()
  .outerRadius(dims.radius)
  .innerRadius(dims.radius / 2);

const colorScale = d3.scaleOrdinal(d3["schemeSet3"]);

// Visualisation
let render = (values) => {
  // 1. Scales update
  colorScale.domain(values.map((item) => item.id));

  // 2. Join data
  let paths = graph.selectAll("path").data(pie(values));
  let texts = legend.selectAll("text").data(pie(values));
  let circles = legend.selectAll("circle").data(pie(values));
  // 3. Exit the unwanted
  paths.exit().remove();

  // 4. Update the existing
  paths
    .attr("d", (d) => arc(d))
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("stroke", "white")
    .attr("stroke-width", 2);

  // 5. Enter the new paths
  paths
    .enter()
    .append("path")
    // .attr("d", (d) => arc(d))
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("stroke", "white")
    .attr("stroke-width", 2)
    .attr("class", "arc")
    .transition()
    .duration(800)
    .attrTween("d", (d) => arcTweenEnter(d));

  texts.exit().remove();

  texts
    .text((d) => d.data.name)
    .attr("y", (d, i) => i * 20)
    .attr("x", 10)
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("font-weight", "500");

  texts
    .enter()
    .append("text")
    .text((d) => d.data.name)
    .attr("y", (d, i) => i * 20)
    .attr("x", 10)
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("font-weight", "500")
    .attr("font-size", 0)
    .transition()
    .delay((d, i) => i * 100)
    .duration(800)
    .attr("font-size", 15);

  circles.exit().remove();

  circles
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("cy", (d, i) => i * 20 - 5);

  circles
    .enter()
    .append("circle")
    .attr("fill", (d) => colorScale(d.data.id))
    .attr("cy", (d, i) => i * 20 - 5)
    .attr("r", 0)
    .transition()
    .delay((d, i) => i * 200)
    .duration(800)
    .attr("r", 5);
};

let arcTweenEnter = (d) => {
  let i = d3.interpolate(d.endAngle, d.startAngle);

  return function (t) {
    d.startAngle = i(t);

    return arc(d);
  };
};

let values = [];

db.collection("investment").onSnapshot((res) => {
  res.docChanges().forEach((change) => {
    let doc = { ...change.doc.data(), id: change.doc.id };

    if (change.type == "added") {
      values.push(doc);
    } else if (change.type == "modified") {
      values.map((item) => {
        if (item.id === doc.id) {
          item.cost = doc.cost;
        }
      });
    } else if (change.type == "removed") {
      values = values.filter((item) => item.id !== doc.id);
    }
  });

  render(values);
  console.log("render done");
});
