// https://bl.ocks.org/mbostock/4063269

(function() {

const svg = d3.select('#graph');
const width = 600;
const height = 600;

const format = d3.format(',d');
const color = d3.scaleOrdinal(d3.schemeCategory20);

const pack = d3.pack()
  .size([width, height])
  .padding(1.5);


d3.csv('../data/crime_csv_2003_2017.csv', d=> {
  d.frequency = +d.frequency;
  if (d.frequency) {
    return d;
  }
}, (error, data) => {
  console.log(data);
  if (error) {
    throw error;
  }

const root = d3.hierarchy({children: data})
  .sum(d => {
    //console.log(d);
    return d.frequency;
  });

const node = svg.selectAll('.node')
  .data(pack(root).leaves())
  .enter().append('g')
    .attr('class', 'node')
    .attr('transform', d => {
      // console.log(data);
      return `translate(${d.x} ,${d.y})`; });

node.append('circle')
  .attr('r', d => {
    // console.log(d);
    return d.r;
  })
  .style('fill', (d, i) => color(i) );

node.append('text')
  // .attr('x', d => { return 0; })
  // .attr('y', d => { return 0; })
  // .text( d => {
  //   return d.data.type + format(d.data.frequency);
  // })
  .selectAll("tspan")
  .data(function(d) { return d.data.type.split(/(?=[A-Z][^A-Z])/g); })
  .enter().append("tspan")
    .attr("x", 0)
    .attr("y", (d, i, nodes) => { return 16 + (i - nodes.length / 2 - 0.5) * 13; })
    .text((d) => { return d; });

node.append('title')
      .text(d =>  `${d.data.type} \n ${format(d.data.frequency)}`);

});
})();