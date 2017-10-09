const crypto = require('crypto');

// mongo DB info
const MongoClient = require('mongodb').MongoClient;
const uri = require('./db-creds').uri;

exports.authObj = {
    authorizer: checkAuth,
    authorizeAsync: true,
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
    realm: 'Hsu8e4Ds3x2sd3'
};


function checkAuth(username, password, cb) {
  MongoClient.connect(uri, function(err, db) {
    if (err === null) {
      db.collection('users').findOne({user: username}).then(function(user) {
        db.close();
        if (user.salt) {
          var passwordData = sha512(password, user.salt);
    	  var valid = passwordData.passwordHash === user.hash;
	  cb(null, valid);
	}
      });
    } else {
      cb(err, false);
    }
  });
}

function getUnauthorizedResponse(req) {
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

// user auth functions
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', new Buffer(salt)); /** Hashing algorithm sha512 */
    hash.update(new Buffer(password));
    var value = hash.digest('hex');
    return { salt:salt, passwordHash:value };
};

// adds a user to the database
exports.addUser = function(username, password, email, cb) {
  var passwordData = sha512(password, genRandomString(16));
  var user = {
    user: username,
    salt: passwordData.salt,
    hash: passwordData.passwordHash,
    perms: ['stats'],
    email: email,
    created: new Date()
  };
  MongoClient.connect(uri, function(err, db) {
    db.collection('users').insertOne(user).then( function(obj) {
      db.close();
    });
  });
  cb();
}
