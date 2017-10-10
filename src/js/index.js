// react imports
import React from 'react';
import ReactDOM from 'react-dom';

// import react components
import Selector from './c/selector.js';
import ScatterChart from './c/scatter-chart.js';
import BubbleChart from './c/bubble-chart.js';
import Histogram from './c/histogram-chart.js';
import Table from './c/table-chart.js';

import charts from "../charts.json";

$.ajax({url: "/devices"}).done(function( data ) {
  let devices = data;
  // Load the Visualization API and the corechart package.
  google.charts.load('current', {'packages':["corechart", 'table']});

  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback( ()=>{ drawDash(devices, 0); } );
});

function drawDash(devices, device) {
  var url = "/data/" + device;
  $.ajax({url: url}).done(function( data ) {
    // --- React components ---
    // Graph components
    // Bubble Quality Graph
    let graph_bub = charts["bubble_q"];
    let data_bub = buildArray(data.data, graph_bub.columns);
    const bubbleComp = <BubbleChart
      graphName="Bubble"
      options={graph_bub.options}
      data={data_bub}
    />;
    // Scatter Quality Graph
    let graph_sca = charts["ccq_signal"];
    let data_sca = buildArray(data.data, graph_sca.columns);
    const scatterComp = <ScatterChart
      graphName="Scatter"
      options={graph_sca.options}
      data={data_sca}
    />;
    // Signal Quality Histogram
    let graph_his = charts["signal_histo"];
    let data_his = buildArray(data.data, graph_his.columns);
    const histoComp = <Histogram
      graphName="Histo"
      options={graph_his.options}
      data={data_his}
    />;
    // Table Graph
    let graph_tab = charts["station_table"];
    let data_tab = buildArray(data.data, graph_tab.columns);
    const tableComp = <Table
      graphName="Table"
      options={graph_bub.options}
      data={data_bub}
    />;
    ReactDOM.render(
      <div>
        <h2>AP: {devices[device].name} - {devices[device].ip}</h2>
        <Selector devices={devices} selected={device} cb={deviceSelectHandler}/>
        {bubbleComp}
        {scatterComp}
        {histoComp}
        {tableComp}
      </div>,
      document.getElementById('root')
    );
  });
}

function deviceSelectHandler(device) {
  console.log(device);
  $.ajax({url: "/devices"}).done(function( data ) {
    let devices = data;
    drawDash(devices, device);
  });
}

// build array from the station list to convert to a data table
// Stations:JSONObject columns:JSONArray
function buildArray(stations, columns) {
  // initialize array
  var a = [];

  // insert header row from titles array
  var head = [];
  var rowFields = [];
  $.each(columns, function( index, c) {
    head.push(c.cfg);
  });
  a.push(head);

  // insert values from stations based on values array
  $.each(stations, function( index, obj ) {
    var row = [];
    $.each(columns, function( index, c ) {
      if (Array.isArray(c.value)) {
        var x = obj;
        $.each(c.value, (i, v)=>{
          x = x[v];
        });
        row.push(x);
      } else {
        row.push(obj[c.value]);
      }
    });
    a.push(row);
  });

  return a;
};
