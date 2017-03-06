(function() {

const url = '../data/coffee_price_to_growers.json';
d3.json(url, (err, data) => {
  const data_year  =[];
  const data_country  =[];
  const l = data.length;
  for (let i = 0; i < l; i++) {
    //data_year.push(data[i][2010]);
    // remove undefined
    if (!isNaN(data[i][2010])) {
      data_year.push(data[i][2010]);
    } else {
      data_year.push('');
    }

    data_country.push(data[i].Country);
  }

  const graph_bcr = document.getElementById('graph').getBoundingClientRect();
  const svg_w = graph_bcr.width;
  const svg_h = graph_bcr.height;
  const y_offset = 25; // space for scale
  const x_offset = 100; // space for scale
  const height = (svg_h - y_offset) / l;
  const width = svg_w;
  const font_offset = 9;
  //const max_year = Math.max(...data_year);
  const max_year = d3.max(data_year);
  const scale_bar_ratio = width / max_year;
  const colors = d3.scaleOrdinal(d3.schemeCategory10);


  const graph = d3.select('#graph');
  const bar_els = graph
    .selectAll('rect')
    .data(data_year);

  bar_els.enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('width', 0)
    .attr('height', height)
    .attr('x', x_offset)
    .attr('y', (d, i) => {
      return i * (height + 5) + y_offset;
    })
    .attr('fill', (d, i) => {
      return colors(i);
    })
    .transition()
    .duration(1000)
    .delay((d, i) => {
      return i * 50;
    })
    .attr('width', (d, i) => {
      return d * scale_bar_ratio;
    });

  bar_els.enter()
    .append('text')
    .attr('class', 'bar-val')
    .attr('x', x_offset * 2)
    .attr('y', (d, i) => {
      return i * (height + 5) + font_offset + y_offset;
    })
    .text((d, i) => {
      return d;
    });

  const x_scale = d3.scaleLinear()
    .domain([0, max_year])
    .range([x_offset, width]);

  graph
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0, 19)')
    .call(d3.axisTop(x_scale));

  bar_els.enter()
    .append('text')
    .attr('class', 'bar-name')
    .attr('x', 10)
    .attr('y', (d, i) => {
      return i * (height + 5) + font_offset + y_offset;
    })
    .text((d, i) => {
      return data_country[i];
    });

});

})();