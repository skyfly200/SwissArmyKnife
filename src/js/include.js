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

export default buildArray;
