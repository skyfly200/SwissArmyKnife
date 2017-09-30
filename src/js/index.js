import React from 'react';
import ReactDOM from 'react-dom';

import $ from "jquery";
import Charts from "../charts.json";

import '../css/style.css';

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'table']});

// TODO: move this into the page state or function scope and out of global scope
var device = 0;

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(load);

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="device"]').onchange = deviceSelectHandler;
    document.getElementById("refresh").addEventListener("click", function(event){
        event.preventDefault();
        load();
    });
},false);

// call handler on default selection at load
function load() {
  drawDashboard(device);
}

function deviceSelectHandler(event) {
    if(event.target.value) device = event.target.value;
    drawDashboard(device);
}

function drawDashboard(device) {
  // You can use “this” to refer to the selected element.
  var url = "/data/" + device;
  // show loader
  var loader = $(".load-wrapp");
  loader.show();
  $.ajax({url: url}).done(function( data ) {
    // hide loader
    loader.hide();
    // draw charts
    // TODO: import charts to draw from dashboard.json file and dynamicly draw them al
    drawChart(data, "bubble_q", "bubble_q");
    drawChart(data, "signal_histo", "histo");
    drawChart(data, "rx_tx", "bandwidth");
    drawChart(data, "station_table", "table");
  });
}


// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(data_obj, chart_id, dom_id) {
  var graph = Charts[chart_id];

  // Create the data table.
  var data = new google.visualization.DataTable();

  // Set chart options and type
  var options = graph.options;
  var type = graph.type;

  switch(type) {
    case 'scatter':
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.ScatterChart(document.getElementById(dom_id));
      break;
    case 'table':
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.Table(document.getElementById(dom_id));
      break;
    case 'histogram':
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.Histogram(document.getElementById(dom_id));
      break;
    case 'bubble':
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BubbleChart(document.getElementById(dom_id));
      break;
    default:
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.Table(document.getElementById(dom_id));
  }

  // build data array from stations objects
  buildArray(data_obj.data, graph.columns, (dataArray)=>{
   var data = google.visualization.arrayToDataTable(dataArray);
   chart.draw(data, options);
  });
}

// build array from the station list to convert to a data table
// Stations:JSONObject titles:StringArray values:2DArray
function buildArray(stations, columns, callback) {
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

  // pass callback the
  callback(a);
};
