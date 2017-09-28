// Nedernet Swiss Army Knife
// Written by Skyler Fly-Wilson 09/27/17
// Creative Commons Attribution-ShareAlike 4.0 International License

const exec = require('child_process').exec;
const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');

// contant variables for ssh session
const key = './.ssh/nededge_dsa';
const devices = require('./devices').devices;
const command = 'wstalist';

const charts = require('./public/charts.json');

// use pug templating engine
app.set('view engine', 'pug');

app.use(basicAuth({
    users: { 'admin': 'test1234' },
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
    realm: 'Hsu8e4Ds3x2sd3'
}));

// server static public directory
app.use(express.static('public'))

// list station info
app.get('/list/:device', function (req, res) {
  if (req.params.device in devices) {
    var device = devices[req.params.device];
    runSSH(device, command, (r)=> {
      res.render('list', { title: "Station List", message: 'Station List', list: r.data, err: r.error });
    });

  } else {
    res.render('list', { title: "Error", message: 'Invalid Device ID#', list: [], err: '' })
  }
})

app.get('/graphs', function (req, res) {
  res.render('graph', { title: "AP Graphs", message: 'AP Graphs', devices: devices, charts: charts});
})

app.get('/data/:device', function (req, res) {
  if (req.params.device in devices) {
    var device = devices[req.params.device];
    runSSH(device, command, (r)=> {res.json(r)});
  } else {
    res.send('Invalid Device ID');
  }
});

app.listen(80, function () {
  console.log('App listening on port 80!')
});

function getUnauthorizedResponse(req) {
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

function runSSH(device, command, callback) {
  var ip = device.ip;
  var user = device.user;
  var ssh_command = 'ssh -q -i ' + key + ' ' + user + '@' + ip + ' ' + command;

  exec(ssh_command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
    }
    var data = JSON.parse(stdout);
    callback({"data": data, "error": stderr});
  });
}
