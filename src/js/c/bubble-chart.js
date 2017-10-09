import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './chart.js';

class BubbleChart extends Chart {
  constructor(props) {
    super(props);
    this.state = {data: {}, options: {}};
  }
  drawCharts() {
    var data = google.visualization.arrayToDataTable(this.props.data);

    var chart = new google.visualization.BubbleChart(
      document.getElementById(this.props.graphName)
    );
    chart.draw(data, this.props.options);
  }
}

export default BubbleChart;
