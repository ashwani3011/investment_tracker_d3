const container = d3.select(".graph-container");

const svg = container.append("svg").attr("height", 500).attr("width", 600);

let render = (values) => {
  console.log(values);
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
});
