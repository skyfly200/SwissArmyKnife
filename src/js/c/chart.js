import React from 'react';
import ReactDOM from 'react-dom';

class Chart extends React.Component {
  constructor(props) {
    super(props);
    // this.chartEvents = [
    //   {
    //     eventName: 'select',
    //     callback(Chart) {
    //       // Returns Chart so you can access props and the ChartWrapper object from chart.wrapper
    //       console.log('Selected ', Chart.chart.getSelection());
    //     },
    //   },
    // ];
    this.state = {data: {}, options: {}};
  }
  render() {
    return <div id={this.props.graphName} />;
  }
  componentDidMount() {
    this.drawCharts();
  }
  componentDidUpdate() {
    this.drawCharts();
  }
  drawCharts() {
    var data = google.visualization.arrayToDataTable(this.props.data);

    var chart = new google.visualization.Table(
      document.getElementById(this.props.graphName)
    );
    chart.draw(data, this.props.options);
  }
}

export default Chart;
