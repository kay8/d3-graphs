(function() {
//http://www.ico.org/new_historical.asp
const url = '../data/coffee_price_to_growers.json';
d3.json(url, (err, data) => {

  const dataset = [];
  dataset.push(data[0]);
  dataset.push(data[8]);
  dataset.push(data[9]);
  dataset.push(data[11]);
  dataset.push(data[12]);
  dataset.push(data[14]);
  dataset.push(data[15]);
  const countries = [];
  const prices = [];

  for (let i = 0; i < dataset.length; i++) {
    let tmp = '';
    let tmp_prices = [];

    countries.push(dataset[i].Country);
    delete dataset[i].Country;
    tmp = dataset[i];

    for (const key of Object.keys(tmp)) {
      tmp_prices.push({ year: key, value: tmp[key] });
    }
    prices.push(tmp_prices);
  }
  console.log(countries);
  console.log(prices);



  const graph_bcr = document.getElementById('graph').getBoundingClientRect();
  const svg_w = graph_bcr.width;
  const svg_h = graph_bcr.height;
  const x_offset = 30; // space for scale
  const y_offset = 20; // space for scale
  const scale = 2.0;
  //const max_year = prices[0][prices[0].length - 1].year;
  let max_price = 0;

  for (i = 0; i < prices[0].length; i++) {
    max_price < prices[0][i].value ? max_price = prices[0][i].value : max_price = max_price;
  }

  const colors = d3.scaleOrdinal(d3.schemeCategory10);

  const margin = (svg_w - x_offset) / (prices[0].length);

  function drawGraph(prices, className, color) {
    const line = d3.line()
      .x((d, i) => {
        return x_offset + i * margin;
      })
      .y((d, i) => {
        return svg_h - (d.value * scale) - y_offset;
      })
      .curve(d3.curveLinear);

    const line_els = d3.select('#graph')
      .append('path')
      .attr('class', `line ${className}`)
      .attr('d', line(prices))
      .attr('fill', 'none')
      .attr('stroke', 'transparent')
      //.attr('transform', 'scale(0, 1)')
      .transition()
      .duration(500)
      //.attr('transform', 'scale(1, 1)')
      .attr('stroke', color);
  }

  function drawScale() {
    const y_scale = d3.scaleLinear()
      .domain([0, max_price])
      .range([scale * max_price, 0]);

    const graph = d3.select('#graph');

    graph
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${x_offset}, 1.5)`)
      .call(d3.axisLeft(y_scale));

    const x_scale = d3.scaleLinear()
      .domain([1990, 2015])
      .range([0, svg_w - x_offset * 2]);

    graph
      .append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${x_offset}, ${svg_h - y_offset})`)
      .call(d3
            .axisBottom(x_scale)
            .ticks(10, '0f')
            //.tickFormat(d => d)
            );


    // graph
    //   .append('rect')
    //   .attr('class', 'axis-x')
    //   .attr('width', svg_w)
    //   .attr('height', 1)
    //   .attr('transform', `translate(${x_offset}, ${svg_h - y_offset - 0.5})`);
  }

  drawGraph(prices[0], countries[0], colors(1));
  drawGraph(prices[1], countries[1], colors(2));
  drawGraph(prices[2], countries[2], colors(3));
  drawGraph(prices[3], countries[3], colors(4));
  drawGraph(prices[4], countries[4], colors(5));
  drawGraph(prices[5], countries[5], colors(6));
  drawGraph(prices[6], countries[6], colors(7));
  drawScale();


});
})();