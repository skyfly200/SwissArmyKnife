import React from 'react';
import ReactDOM from 'react-dom';
import Chart from './chart.js';

class Table extends Chart {
  constructor(props) {
    super(props);
    //this.state = {data: {}, options: {}};
  }
  drawCharts() {
    var data = google.visualization.arrayToDataTable(this.props.data);

    var chart = new google.visualization.Table(
      document.getElementById(this.props.graphName)
    );
    chart.draw(data, this.props.options);
  }
}

export default Table;
