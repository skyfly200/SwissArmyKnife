// contant variables for ssh session
const key = './.ssh/nededge_dsa';
const devices = require('./devices').devices;
const exec = require('child_process').exec;

exports.runSSH = function(device, command, callback) {
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
