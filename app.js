var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));//this hosts the files located in the ./public directory

app.locals.port = 80;
console.log(app.locals.port);
app.listen(app.locals.port, function(){ //listen for requests at ipaddress:1337
	console.log("Server is running on port " + app.locals.port);		//callback function, completely optional.
});
