(function() {

const svg = d3.select('#graph');
const width = 600;
const height = 600;

const format = d3.format(',d');
const color = d3.scaleOrdinal(d3.schemeCategory20);

const pack = d3.pack()
  .size([width, height])
  .padding(1.5);

d3.json('../data/coffee_price_to_growers.json', (error, data) => {

  if (error) {
    throw error;
  }

  const dataset = [];
  const prices = [];


  data.forEach((value, i) => {
    let tmp = '';
    let tmp_prices = [];
    let tmp_country = '';
    let tmp_obj = {};
    let sum = 0;

    tmp_country = data[i].Country;
    delete data[i].Country;
    tmp = data[i];

    for (const key of Object.keys(tmp)) {
      sum += +tmp[key];
    }
    if (sum > 0) {
      tmp_obj['country'] = tmp_country;
      tmp_obj['value'] = Math.round(sum);
      dataset.push(tmp_obj);
    }

  });

  const obj = {"data": dataset};

  const root = d3.hierarchy({children: obj.data})
    .sum(d => {
      return d.value;
    });

  const node = svg.selectAll('.node')
    .data(pack(root).leaves())
    .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => {
        //console.log(d);
        return `translate(${d.x} ,${d.y})`;
      });

  node.append('circle')
    .attr('r', d => {
      // console.log(d);
      return d.r;
    })
    .style('fill', (d, i) => color(i) );

  node.append('text')
    .selectAll("tspan")
    .data(function(d) { return d.data.country.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")
      .attr("x", 0)
      .attr("y", (d, i, nodes) => { return 16 + (i - nodes.length / 2 - 0.5) * 13; })
      .text((d) => { return d; });

  node.append('title')
        .text(d =>  `${d.data.country} \n ${format(d.data.value)}`);

});


})();