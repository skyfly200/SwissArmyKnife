const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
const auth = require('./auth');
const dev = require('./devices');
const devices = require('./devices.json').devices;
const ssh = require('./ssh');

// use basicAuth for user authorizations scheme
router.use(basicAuth( auth.authObj ));

// server static public directory
router.use(express.static('public'));

//support parsing of application/json type post data
router.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/', function (req, res) {
  res.render('index');
})

router.get('/new-user', function (req, res) {
  res.render('user-form');
})

router.post('/add-user', function (req, res) {
  addUser(req.body.username, req.body.password, req.body.email, ()=>{
    res.render('user-conf', {user: req.body.username, email: req.body.email});
  });
})

router.get('/data/:device', function (req, res) {
  if (req.params.device in devices) {
    var device = devices[req.params.device];
    var command = 'wstalist';
    ssh.runSSH(device, command, (r)=> {res.json(r)});
  } else {
    res.send('Invalid Device ID');
  }
});

router.get('/devices', function (req, res) {
  dev.getDevices( (err, list)=>{
    if (list) {
      res.json(list);
    } else {
      res.send('Error retieving device list: '.err);
    }
  });
});

router.get('/devices-sub/:subnet', function (req, res) {
  dev.getDevicesInSubnet(req.params.subnet, (err, list)=>{
    if (list) {
      res.json(list);
    } else {
      res.send('Error retieving device list: '.err);
    }
  });
});

router.get('/device-ip/:ip', function (req, res) {
  dev.getDeviceByIP(req.params.ip, (err, device)=>{
    if (device) {
      res.json(device);
    } else {
      res.send('Error retieving device list: '.err);
    }
  });
});

router.get('/device-name/:name', function (req, res) {
  dev.getDeviceByName(req.params.name, (err, device)=>{
    if (device) {
      res.json(device);
    } else {
      res.send('Error retieving device list: '.err);
    }
  });
});

module.exports = router
