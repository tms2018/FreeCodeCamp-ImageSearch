var mongoose = require ('mongoose');
var readLine = require ('readline');

var dbUri = process.env.DB_URI;

//If running on windows, forces the SIGINT signal when the process terminates
if (process.platform === 'win32') {
  var rl = readLine.createInterface ({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', function () {
    process.emit ('SIGINT');
  })
}

// Connect to the database and register callbacks for event signals
mongoose.connect (dbUri);
mongoose.connection.on ('connected', function() {
  console.log ('Mongoose connected to: ' + dbUri);
});
mongoose.connection.on ('error', function(err) {
  console.log ('Mongoose connection error: ' + err);
});
mongoose.connection.on ('disconnected', function() {
  console.log ('Mongoose disconnected');
});

// Register callbacks for process termination signals
// to close the db connection
process.on ('SIGINT', function() {
  closeConnection ('App shutdown', function() {
    process.exit (0);
  });
});

process.on ('SIGTERM', function() {
  closeConnection ('Heroku app shutdown', function() {
    process.exit (0);
  });
});

function closeConnection ( reasonForClose, callback ) {
  console.log ('Mongoose disconnected from: ' + reasonForClose);
  callback();
}
