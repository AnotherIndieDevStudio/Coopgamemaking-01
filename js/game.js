(function () {

	var Game = window.Game = window.Game || {};
	
	Game.DEBUG = false;
	
	Game.debug_info = function (info) {
		
		if (Game.DEBUG) {
			
			console.log('[DEBUG] ' + info);
			
		}
		
	};
	

	if (!Game.player) {

		// Initialise Player on load to a 'My Character' templated Character
		Game.player = Game.Character.from_template('My Character');
		
		// Move the Player to a starting location
		Game.Location.move_character(Game.player, Game.Location.TOWNCENTRE);

	}


	// Easily fire off events
	Game.add_event = function(obj){

		var event = Game.Event(obj);
		Game.Event.queue(event);

	};


	if (!Game.time) {

		// Initialise Game.Time
		Game.time = {
			frequency: 250,
			previous: new Date(),
			passed: 0,
			elapsed: 0,
			paused: false,
			day: 1,
			hour12: '12am',
			hour24: 0,
			ELAPSED_PER_DAY: 500
		};

		Game.status = {
			idle: true,
			fighting: false, 
			current_enemy: "",
			fight_ticks: 0
		};

	}


	/* Updating variables on page when the document loads */
	$(document).ready(function (e) {

		// Initiate stats on screen
		update_stats();

		// Game Loop
		var game_tick = setInterval(function () {

			// Check if the game is paused. If not, run game.
			if(!Game.time.paused){

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

				Game.time.elapsed += Game.time.passed;
				Game.time.day = ~~(Game.time.elapsed / Game.time.ELAPSED_PER_DAY) + 1;
				Game.time.hour24 = ~~((Game.time.elapsed % Game.time.ELAPSED_PER_DAY) / (Game.time.ELAPSED_PER_DAY / 24));
				Game.time.hour12 = Game.time.hour24 > 12 ? Game.time.hour24 % 12 : Game.time.hour24 === 0 ? 12 : Game.time.hour24;
				Game.time.hour12 += Game.time.hour24 > 11 ? 'pm' : 'am';

				Game.time.previous = new Date();
				update_game();

			// If game is paused, still allow the player to update stats
			}else{
				update_stats();
			}

		}, Game.time.frequency);

	});

	/* Grabs html stat objects and updates them */
	var update_stats = function () {
		
		// Updates stat visuals
		change_stat_button_status();

		// Updating stats
		$("#stat-points").html(Game.player.stat_points);
		$("#level").html(Game.player.level);
		$(".health").html(Math.floor(Game.player.health));
		$(".max-health").html(Game.player.max_health);
		$("#defence").html(Game.player.defence);
		$("#strength").html(Game.player.strength);
		$("#intellect").html(Game.player.intellect);
		$("#dexterity").html(Game.player.dexterity);
		$("#exp").html(Game.player.experience);
		$("#exp-tnl").html(Game.player.experience_tnl);

		
		update_healthbar("player");

	};
/* Main game loop */
	var update_game = function () {
		
		// Update systems
		Game.Wound.update();
		Game.Character.update();
		Game.Event.update();
		Game.Location.update();
		
		regen_health();

		// Adds exp each game tick
		Game.player.experience += 10 * Game.time.passed;

		// Checks if the player can level up
		if (Game.player.experience > Game.player.experience_tnl) {

			Game.player.experience -= Game.player.experience_tnl;
			Game.player.experience_tnl = Game.Character.get_experience_tnl(Game.player);
			Game.player.level += 1;
			Game.player.stat_points += 2;
			Game.player.max_stat_points += 2;

		};
		
		if(Game.status.fighting){
			
			update_healthbar("enemy");
			fight_turn();
			
		};

		// Updates the players stats
		update_stats();

	};



	// Checks if stats can be upgraded and shows + symbols if player can level stats
	var change_stat_button_status = function () {

		Game.Character.check_can_level_stats(Game.player);
		if (Game.player.can_level_stats) {
			$(".add-stat").addClass('purchase');
		} else {
			$(".add-stat").removeClass('purchase');
		}

	};

	/* Adjusts the players visual health bar */
	var update_healthbar = function(type){

		if(type==="player"){
			var health_remaining = $(".health-remaining");
			var health_bar = $(".health-bar");
			var width = (Game.player.health / Game.player.max_health) * health_bar.width();
		}else if(type === "enemy"){
			var health_remaining = $(".enemy-health-remaining");
			var health_bar = $(".enemy-health-bar");
			var width = (Game.status.current_enemy.health / Game.status.current_enemy.max_health) * health_bar.width();
			$(".enemy-health").html(Math.floor(Game.status.current_enemy.health));		
			$(".enemy-max-health").html(Math.floor(Game.status.current_enemy.max_health));
		};

		health_remaining.width(width);

	};
	
	var regen_health = function(){
		
		var regen_amount = 1;
		
		if(Game.player.wounds[0]){
			regen_amount = 0.0;	
		};
		
		if(Game.status.fighting){
			regen_amount = 0.0;
		};
		
		if(Game.player.health <= Game.player.max_health){
			Game.player.health += regen_amount;
			if(Game.player.health > Game.player.max_health){
				Game.player.health = Game.player.max_health;	
			};
		};
		
		// Check if heealth is above health
		
	};
	
	var setup_enemy = function(enemy){
		
		enemy["health"] *= Game.player.max_health;
		enemy["max_health"] *= Game.player.max_health;
		enemy["defence"] *= Game.player.defence;
		enemy["strength"] *= Game.player.strength;
		enemy["dexterity"] *= Game.player.dexterity;
		enemy["intellect"] *= Game.player.intellect;
		
		$(".enemy-name").html(enemy['name']);
		
		$(".enemy-health").html(enemy['health']);		
		$(".enemy-max-health").html(enemy['max_health']);
		
		return enemy;
		
	};
	
	var start_battle = function(){
		
		// Grabs enemy
		Game.status.current_enemy = setup_enemy(Game.Character.from_template("Rat"));
		
		$("#battle-container").show(500);
		Game.status.fighting = true;
		
	};
	
	var end_battle = function(winner){
		
		Game.status.fighting = false;
		
		if(winner === "player"){
			Game.player.experience += Game.status.current_enemy.experience * Game.player.level;
			Game.add_event({description: "You have won the fight"});
		}else{
			Game.add_event({description: "You have lost the fight"});
		};
		
		$("#battle-container").hide(500, function(){
			$("#stats-container").show(500);
			$("#battle-show").html("Battle");
			
		});
		
		Game.fight_ticks = 0;
		
	};
	
	var fight_turn = function(){
		
		if(Game.status.fight_ticks === 2){
			
			Game.status.fight_ticks = 0;
			
			// Calculates the damage dealt based on strength
			var player_hit_dmg = (Game.player.strength * Math.random() + 1) - (Math.random() * Game.status.current_enemy.defence);
			var enemy_hit_dmg = (Game.status.current_enemy.strength * Math.random() + 1) - (Math.random() * Game.player.defence);
			
			// Calculates the hit chance based on dexterity
			var player_hit = (Math.random() * Game.player.dexterity);
			var enemy_hit = (Math.random() * Game.status.current_enemy.dexterity);
			
			if(player_hit != 0){
				// Checks for critical
				if(player_hit > (Math.floor(Game.player.dexterity/2)) + 1){
					player_hit_dmg += Math.floor(Math.random() * player_hit_dmg) + 1;
					console.log("Critical hit");
				};
				Game.status.current_enemy.health -= player_hit_dmg;
			};
			
			if(Game.status.current_enemy.health <= 0){
				end_battle("player");
			};
			
			if(enemy_hit != 0){
				if(enemy_hit > (Math.floor(Game.status.current_enemy.dexterity/2)) + 1){
					enemy_hit_dmg += Math.floor(Math.random() * enemy_hit_dmg) + 1;
					console.log("Enemy Critical hit");
				};
				Game.player.health -= enemy_hit_dmg;
			};
			
			update_healthbar("enemy");
			
			if(Game.player.health <= 0){
				Game.player.health = 0;
				end_battle("enemy");
			};
			
		}else{
			Game.status.fight_ticks += 1;
		};
			
	};

	/* Checks for clicks on stat upgrades */
	$(".add-stat").click(function (e) {
		/*Check if button can be pressed*/
		if(!Game.player.can_level_stats) {
			return alert("Sorry, not enough points!");
		}
		/* Check button's data-stat */
		var stat = $(this).data('stat');
		if(stat === "health"){
			amount = 10;
			stat = "max_health";
		}else{
			amount = 1;	
		}
		if (Game.player.can_level_stats) {
			/* if stat is 'health', update by 10, if not, then 1 */
			Game.player[stat] += amount;
			/* Setting player's max health */
			if (stat === "max_health") {

				Game.player.health += 10;
			};
			Game.player.stat_points -= 1;

		};

		var pageY = e.pageY - 15,
			pageX = e.pageX - 10,
			effect = $("<span class='plusone unselectable' style='left:"+pageX+"px;top:"+pageY+"px;'>+"+amount+"</span>").insertAfter('body');

			effect.show();
			effect.animate({
				opacity:0,
				top: pageY - 50,
			}, 1000, function(){
				effect.remove();
			});

	});

	/* Checks if game is being paused */
	$("#pause-button").click(function(){

		// If game is running
		if(!Game.time.paused){
			$("#pause-button").html("Resume Game");
			Game.time.paused = true;
		}else{
			$("#pause-button").html("Pause Game");
			Game.time.paused = false;

			// Ensure no progress is made when game is paused. Kind of defeats purpose of having a paused game.
			Game.time.previous = new Date();
		}

	});
	
	$("#battle-show").click(function(){
		if(!Game.status.fighting){
			$("#stats-container").hide(500, function(){
				start_battle();
				$("#battle-show").html("Run away");
			});
		}else{
			$("#battle-container").hide(500, function(){
				$("#stats-container").show(500);
				Game.status.fighting = false;
				$("#battle-show").html("Battle");
			});
		};
	});
	
	

} ());
