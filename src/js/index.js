import $ from "jquery";

// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart', 'table']});

var device = 0;

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(load);

document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[name="device"]').onchange = deviceSelectHandler;
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
  getChart(device, chart_type);
}

function getChart(ap_id, chart_id) {
  // You can use “this” to refer to the selected element.
  var url = "/data/" + ap_id;
  // show loader
  var loader = $(".load-wrapp");
  loader.show();
  $.ajax({url: url}).done(function( data ) {
    // hide loader
    loader.hide();
    // draw chart
    drawChart(data, chart_id);
  });
}

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart(data_obj, id) {
  $.getJSON("/charts.json", function(charts) {
    var graph = charts[id];

    // Create the data table.
    var data = new google.visualization.DataTable();

    // Set chart options and type
    var options = graph.options;
    var type = graph.type;

    switch(type) {
      case 'scatter':
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));
        break;
      case 'table':
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.Table(document.getElementById('chart_div'));
        break;
      case 'histogram':
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.Histogram(document.getElementById('chart_div'));
        break;
      case 'bubble':
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.BubbleChart(document.getElementById('chart_div'));
        break;
      default:
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.Table(document.getElementById('chart_div'));
    }

    // build data array from stations objects
    buildArray(data_obj.data, graph.columns, (dataArray)=>{
     var data = google.visualization.arrayToDataTable(dataArray);
     chart.draw(data, options);
   });
  }).fail(function(jqxhr, textStatus, error) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
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
