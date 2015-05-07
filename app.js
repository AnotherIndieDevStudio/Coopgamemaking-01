var express = require('express');
var app = express();

//this hosts the files located in the ./js directory;
app.use('/js', express.static(__dirname + '/js'));
//this hosts the files located in the ./style directory
app.use('/style', express.static(__dirname + '/style'));
//this hosts the files located in the ./public directory
app.use(express.static(__dirname + '/public'));

// I find that app.use is better to host a directory, 
// however I didn't want to host the entire '/' of the project, 
// since I don't know if this is risky. 
// :13-15 is a workaround without moving the index file.
app.get('/',function(req,res){ 
	res.sendFile(__dirname + '/index.html');
});//this hosts the ./index.html file when '/' is requested.

//check if node was run with sudo
if(process.env.USERNAME == 'root')
	app.locals.port = 80;
else //if node wasn't run as root, host server on :8000
	app.locals.port = 8000;

//listen for requests at ipaddress:port specified at :19
app.listen(app.locals.port, function(){ 
	console.log("Server is running on port " + app.locals.port);

	if(process.env.USERNAME == 'root'){
		// code snippet to change user after port is listened to for security, 
		// found at http://syskall.com/dont-run-node-dot-js-as-root/

		// Find out which user used sudo through the environment variable
		var uid = parseInt(process.env.SUDO_UID);
		// Set our server's uid to that user
		if (uid) process.setuid(uid);
		console.log('Server\'s UID is now ' + process.getuid());
	} // end if root

});
