(function () {
	
	var Game = window.Game = window.Game || {};
	
	if (!Game.player) {
		
		// Initialise Player on load to a character with default stats
		Game.player = Game.Character();
		
	}
	
	
	if (!Game.time) {
		
		// Initialise Game.Time
		Game.time = {
			frequency: 250,
			previous: new Date(),
			passed: 0
		};
		
	}
	

	/* Updating variables on page when the document loads */
	$(document).ready(function (e) {
	
		// Initiate stats on screen
		update_stats();
	
		// Game Loop
		var game_tick = setInterval(function () {
			
			// Ensures that the game still functions when the tab is closed
			var current_time = new Date();
			var time_difference = (current_time.getTime() - Game.time.previous.getTime());
			
			// Calculates the difference in time and returns multiplier
			if (time_difference > Game.time.frequency) {

				if (Math.floor(time_difference / Game.time.frequency > 1)) {

					Game.time.passed = Math.floor(time_difference / Game.time.frequency);

				} else {

					Game.time.passed = 1;

				}

			} else {

				Game.time.passed = 1;

			}
			
			Game.time.previous = new Date();
			update_game();

		}, Game.time.frequency);

	});
	

	var update_stats = function () {
		
		// Updating stats
		$("#stat_points").html(Game.player.stat_points);
		$("#level").html(Game.player.level);
		$("#health").html(Game.player.health);
		$("#max-health").html(Game.player.max_health);
		$("#strength").html(Game.player.strength);
		$("#intellect").html(Game.player.intellect);
		$("#dexterity").html(Game.player.dexterity);
		$("#exp").html(Game.player.experience);
		$("#exp_tnl").html(Game.player.experience_tnl);

	};
	

	var update_game = function () {
		
		// Adds exp each game tick
		Game.player.experience += 10 * Game.time.passed;
		
		if (Game.player.experience > Game.player.experience_tnl) {

			Game.player.experience -= Game.player.experience_tnl;
			Game.player.experience_tnl = Game.Character.get_experience_tnl(Game.player);
			Game.player.level += 1;
			Game.player.stat_points += 2;
			Game.player.max_stat_points += 2;

		}
	
		// Updates stats on the screen
		update_stats();
	
		// Checks if stats can be upgraded
		check_player_can_level();

	};
	
	var take_damage = function(amount){
		
		if(Game.player.health - amount > 0){
			Game.player.health -= amount;
			adjust_health_bar();
		}
		
	};
	
	
	var adjust_health_bar = function(){
		
		var health_remaining = $("#health-remaining");
		var health_bar = $("#health-bar");
		
		var width = (Game.player.health / Game.player.max_health) * health_bar.width();
		
		health_remaining.width(width)
		
	};
	
	// Checks if stats can be upgraded and shows + symbols if player can level stats
	var check_player_can_level = function () {
		
		Game.Character.check_can_level_stats(Game.player);
		
		if (Game.player.can_level_stats) {

			$(".add_stat").show();

		} else {

			$(".add_stat").hide();

		}
			
	};
	
	/* Checks for clicks on stat upgrades */

	// Health
	$("#health_add").click(function () {

		if (Game.player.can_level_stats) {

			Game.player.health += 10;
			Game.player.max_health = Game.player.health;
			Game.player.stat_points -= 1;
			adjust_health_bar();
			check_player_can_level();

		}

	});

	// Strength
	$("#strength_add").click(function () {

		if (Game.player.can_level_stats) {

			Game.player.strength += 1;
			Game.player.stat_points -= 1;
			check_player_can_level();

		}

	});

	//Intellect
	$("#intellect_add").click(function () {

		if (Game.player.can_level_stats) {

			Game.player.intellect += 1;
			Game.player.stat_points -= 1;
			check_player_can_level();

		}

	});

	//Dexterity
	$("#dexterity_add").click(function () {

		if (Game.player.can_level_stats) {

			Game.player.dexterity += 1;
			Game.player.stat_points -= 1;
			check_player_can_level();

		}

	});
	
	$("#take-damage").click(function(){
		take_damage(10);
	});

} ());
