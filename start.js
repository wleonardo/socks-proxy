var argv = process.argv[1];
var exec = require('child_process').exec;

if (argv === 'stop') {
  exec('pm2 delete demo.js', (err, stdout, stderr) => {
    if (err) throw err;
    console.log(stdout);
  });
} else if (argv === 'status') {
  exec('pm2 show demo', (err, stdout, stderr) => {
    if (err) throw err;
    console.log(stdout);
  });
} else {
  exec('pm2 start demo.js', (err, stdout, stderr) => {
    if (err) throw err;
    console.log(stdout);
  });
}
