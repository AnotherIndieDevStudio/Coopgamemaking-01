(function () {
	
	var Game = window.Game = window.Game || {};
	
	var xmlhttp;
	var id_displayed = false;
	var saveID;


	var getObject = function () {
	
		// Handle all modern browsers 
		if (window.XMLHttpRequest) {
			//IE7+, Firefox, Chrome, Opera and Safari
			xmlhttp = new XMLHttpRequest();
		} else {
			//IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	};

	/* Save game function will grab all stats in game currently and save them with an Unique ID */
	var saveGame = function () {
	
		//Calling the object depending on browser
		getObject();
	
		// Checks for state change and then transmits data to needed places within HTML document
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4) {
				if (xmlhttp.status == 200) {
					
					saveID = xmlhttp.responseText;
					
					// Move the player Character by_id to its new ID
					if (saveID !== Game.player.id) {
						
						delete Game.Character.by_id[Game.player.id];
						Game.player.id = saveID;
						Game.Character.by_id[Game.player.id] = Game.player;
						
					}
					
					$("#load_id").val(saveID);
					$("#id-text").html("Save ID: " + saveID);
					$("#id-display").show(1000);
					id_displayed = true;
					
				}
			}
		};
		
		
		// Wounds will get reconstructed against the Character it was saved to, so
		// we only need to serialise the important bits that need to persist
		var wounds = [];
		
		for (var wound_index = 0; wound_index < Game.player.wounds.length; ++wound_index) {
			
			var wound = Game.player.wounds[wound_index];
			wounds.push({size: wound.size, inflicted: wound.inflicted});
			
		}
		
		
		// Retrieving information from PHP file
		var save_params = [
			'id=' + Game.player.id,
			'name=' + encodeURIComponent(Game.player.name),
			'type=' + encodeURIComponent(Game.player.type),
			
			'location=' + encodeURIComponent(Game.player.location.name),
			
			'health=' + Game.player.health,
			'max_health=' + Game.player.max_health,
			'defence=' + Game.player.defence,
			'strength=' + Game.player.strength,
			'intellect=' + Game.player.intellect,
			'dex=' + Game.player.dexterity,
			'level=' + Game.player.level,
			
			'inventory=' + encodeURIComponent(JSON.stringify(Game.player.inventory)),
			
			'exp=' + Game.player.experience,
			'exp_tnl=' + Game.player.experience_tnl,
			'statpoints=' + Game.player.stat_points,
			'maxstatpoints=' + Game.player.max_stat_points,
			
			'wounds=' + encodeURIComponent(JSON.stringify(wounds)),
			
			'need_id=' + (saveID ? false : true)
		].join('&');
		
		xmlhttp.open("GET", "savegame.php?" + save_params, true);
		xmlhttp.send();
		
	};
	

	/* Load Game function will load stats based on UID */
	var loadGame = function () {
	
		//Calling the object depending on browser
		getObject();
	
		// Checks for state change and then transmits data to needed places within HTML document
		xmlhttp.onreadystatechange = function () {
			
			if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
				
				var response = xmlhttp.responseText;
				console.log(response);
				var data = JSON.parse(response);
				
				if (data.loadError) {
					
					alert(data.loadError);
					
				} else {
					
					// Remove the now old by_id reference
					delete Game.Character.by_id[Game.player.id];
					
					// Remove existing Wounds
					for (var wound_index = 0; wound_index < Game.player.wounds.length; ++wound_index) {
						
						var wound = Game.player.wounds[wound_index];
						$("#player-wounds").html("");
						delete Game.Wound.by_id[wound.id];
						
					};
					
					
					Game.player.id = data.id;
					Game.player.name = data.name;
					Game.player.type = data.type;
					
					Game.player.location = Game.Location.by_name[data.location];
					
					Game.player.health = data.health;
					Game.player.max_health = data.max_health;
					Game.player.defence = data.defence;
					Game.player.strength = data.strength;
					Game.player.intellect = data.intellect;
					Game.player.dexterity = data.dexterity;
					Game.player.level = data.level;
					
					Game.player.inventory = data.inventory;

					Game.player.experience = data.experience;
					Game.player.experience_tnl = data.experience_tnl;
					Game.player.stat_points = data.stat_points;
					Game.player.max_stat_points = data.max_stat_points;
					
					// Add the new by_id reference
					Game.Character.by_id[Game.player.id] = Game.player;
					
					// Reconstruct Wounds
					for (var wound_index = 0; wound_index < data.wounds.length; ++wound_index) {
						
						var wound = data.wounds[wound_index];
						wound.character = Game.player; 
						Game.Wound(wound);
						
					};
					
					$("#load_id").val(Game.player.id);
					$("#id-text").html("Save ID: " + Game.player.id);
					$("#id-display").show(1000);
					
					id_displayed = true;
					
					saveID = Game.player.id;
					
					// Alerts the player of load successful 
					alert("Your game has been loaded successfully");
					
				}
					
			}
			
		};

		var load_id = $("#load-input").val();
	
		// Retrieving information from PHP file
		xmlhttp.open("GET", "loadgame.php?id=" + load_id, true);
		xmlhttp.send();
		
	};



	/* Checks if the buttons that control the game were pressed */

	// If save game is pressed, hide the button for a period of time to prevent spamming (If it is abused, it will be taken away)
	$("#save-button").click(function () {
		
		$("#save-button").hide(500);
		setTimeout(function () {
			$("#save-button").show(500);
		}, 5000);
		saveGame();
		
	});

	$("#load-button").click(function () {
		
		$('#load-box').show(500);
		
	});

	$("#submit-load").click(function () {
		
		loadGame();
		
	});

	$("#toggle-id").click(function () {
		
		$("#id-text").toggle();

	});

} ());
