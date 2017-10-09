// react imports
import React from 'react';
import ReactDOM from 'react-dom';

import ScatterChart from './c/scatter-chart.js';
import BubbleChart from './c/bubble-chart.js';
import Histogram from './c/histogram-chart.js';

import $ from "jquery";
import Charts from "../charts.json";

import '../css/style.css';

var options = {
  dataType: "script",
  cache: true,
  url: "https://www.google.com/jsapi",
};
$.ajax(options).done(function(){
  google.load("visualization", "1", {
    packages:["corechart", 'table'],
    callback: function() { init();}
  });
});

function init() {
  var device = 0;
  var url = "/data/" + device;
  $.ajax({url: url}).done(function( data ) {
    let graph_sca = Charts["ccq_signal"];
    let graph_bub = Charts["bubble_q"];
    //let graph_his = Charts["signal_histo"];
    //let data_his = buildArray(data.data, graph_his.columns);
    let data_sca = buildArray(data.data, graph_sca.columns);
    let data_bub = buildArray(data.data, graph_bub.columns);
    ReactDOM.render(
      <div>
        <ScatterChart
          graphName="Scatter"
          options={graph_sca.options}
          data={data_sca}
        />
        <BubbleChart
          graphName="Bubble"
          options={graph_bub.options}
          data={data_bub}
        />
      </div>,
      document.getElementById('root')
    );
  });
}

// document.addEventListener('DOMContentLoaded',function() {
//     document.querySelector('select[name="device"]').onchange = deviceSelectHandler;
//     document.getElementById("refresh").addEventListener("click", function(event){
//         event.preventDefault();
//         load();
//     });
// },false);

function deviceSelectHandler(event) {
    if(event.target.value) device = event.target.value;
    drawDashboard(device);
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
