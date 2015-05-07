var serve = require('serve-static')('.');
var fs = require('fs');

var PORT = 8000;

require('http').createServer(function (req, res) {

	if (req.url.indexOf('/savegame.php?') === 0) {

		return save(req, res);

	} else if (req.url.indexOf('/loadgame.php?') === 0) {

		return load(req, res);

	}

	serve(req, res, function (err) {

		res.statusCode = err ? (err.statusCode || err.status) : 404;
		res.end(err ? err.toString() : 'Cannot ' + req.method + ' ' + req.url + '\n');

	});

}).listen(PORT);


var s4 = function () {

	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

};


var save = function (req, res) {

	var obj = {};
	var params = req.url.split('?')[1].split('&');

	for (var param in params) {

		param = params[param].split('=');
		obj[param[0]] = param[1];

	}

	var UUID = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();

	fs.writeFile(UUID, JSON.stringify(obj), function (err) {

		if (err) return console.log(err);
		console.log('Saved ' + UUID);
		res.setHeader('Content-Type', 'text/plain');
		res.end(UUID);

	});

};



var load = function (req, res) {

	var UUID = req.url.split('=')[1];

	fs.readFile(UUID, { encoding: 'utf-8' }, function (err, data) {
		
		if (!err) {
			
			var obj = JSON.parse(data);
			console.log('Loaded ' + UUID);
			res.setHeader('Content-Type', 'text/javascript');
			res.end([
				"<script>",
				"	level = " + obj.level + ";",
				"	health = " + obj.health + ";", 
				"	experience = " + obj.exp + ";",
				"	experience_tnl = " + obj.exp_tnl + ";",
				"	strength = " + obj.strength + ";",
				"	dexterity = " + obj.dex + ";",
				"	intellect = " + obj.intellect + ";",
				"	stat_points = " + obj.statpoints + ";",
				"	max_stat_points = " + obj.maxstatpoints + ";",
				"	alert('Successfully loaded the game');",
				"	$('#load-box').hide(500);",
				"	userID = '" + UUID + "';",
			    "</script>"
			].join('\n'));
			
		} else {
			
			console.log(err);
			res.setHeader('Content-Type', 'text/plain');
			res.end(UUID);
			
		}

	});

};

console.log('Develoment instance running at http://localhost:' + PORT + '/');
