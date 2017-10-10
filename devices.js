// mongo DB info
const MongoClient = require('mongodb').MongoClient;
const uri = require('./db-creds').uri;

// querry single devices

exports.getDeviceByIP = function(ip, cb) {
  MongoClient.connect(uri, function(err, db) {
    if (err === null) {
      db.collection('devices').findOne({'ip': ip}).then(function(device) {
        db.close();
	      cb(null, device);
	    });
    } else { cb(err, false); }
  });
}

exports.getDeviceByName = function(name, cb) {
  MongoClient.connect(uri, function(err, db) {
    if (err === null) {
      db.collection('devices').findOne({'name': name}).then(function(device) {
        db.close();
	      cb(null, device);
	    });
    } else { cb(err, false); }
  });
}

// querry list of devices

exports.getDevices = function(subnet, cb) {
  MongoClient.connect(uri, function(err, db) {
    if (err === null) {
      db.collection('devices').find({}).then(function(list) {
        db.close();
	      cb(null, list);
	    });
    } else { cb(err, false); }
  });
}


// adds a device to the devices collection in the database
exports.addDevice = function(ip, subnet, name, user, key, location, cb) {
  var device = {
    ip: ip,
    subnet: subnet,
    name: name,
    user: user,
    key: key,
    location: location,
    added: new Date()
  };
  MongoClient.connect(uri, function(err, db) {
    db.collection('devices').insertOne(devices).then( function(obj) {
      db.close();
    });
  });
  cb();
}

// delete device
exports.deleteDevice = function(name, cb) {
  MongoClient.connect(uri, function(err, db) {
    db.collection('devices').remove({'name': name});
    db.close();
  });
  cb();
}
