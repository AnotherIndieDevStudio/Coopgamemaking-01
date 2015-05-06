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

app.locals.port = 80; //change this to change port to listen to.

//listen for requests at ipaddress:port specified at :19
app.listen(app.locals.port, function(){ 
	console.log("Server is running on port " + app.locals.port);
});
