(function () {

	var Game = window.Game = window.Game || {};
	
	
	Game.DEBUG = true;
	
	Game.debug_info = function (info) {
		
		if (Game.DEBUG) {
			
			console.log('[DEBUG] ' + info);
			
		}
		
	};
	
	
	// Easily fire off events
	Game.add_event = function (obj){
		
		var event = Game.Event(obj);
		Game.Event.queue(event);
		
	};
	
	

	if (!Game.player) {

		// Initialise Player on load to a 'My Character' templated Character
		Game.player = Game.Character.from_template('My Character');
		
		// Move the Player to a starting location
		Game.Location.move_character(Game.player, Game.Location.TOWNCENTRE);

	}
	

	
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
			fighting: false	
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

		// Updating stats
		$("#stat-points").html(Game.player.stat_points);
		$("#level").html(Game.player.level);
		$("#health").html(Game.player.health);
		$(".max-health").html(Game.player.max_health);
		$("#strength").html(Game.player.strength);
		$("#intellect").html(Game.player.intellect);
		$("#dexterity").html(Game.player.dexterity);
		$("#exp").html(Game.player.experience);
		$("#exp-tnl").html(Game.player.experience_tnl);

		// Updates stat visuals
		change_stat_button_status();
		update_healthbar();

	};

	/* Main game loop */
	var update_game = function () {
		
		// Update systems
		Game.Wound.update();
		Game.Character.update();
		Game.Event.update();
		Game.Location.update();

		// Adds exp each game tick
		Game.player.experience += 10 * Game.time.passed;

		// Checks if the player can level up
		if (Game.player.experience > Game.player.experience_tnl) {

			Game.player.experience -= Game.player.experience_tnl;
			Game.player.experience_tnl = Game.Character.get_experience_tnl(Game.player);
			Game.player.level += 1;
			Game.player.stat_points += 2;
			Game.player.max_stat_points += 2;

		}

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
	var update_healthbar = function(){

		var health_remaining = $("#health-remaining");
		var health_bar = $("#health-bar");

		var width = (Game.player.health / Game.player.max_health) * health_bar.width();

		health_remaining.width(width)

	};
	
	/* Checks for clicks on stat upgrades */
	$(".add-stat").click(function (e) {
		/*Check if button can be pressed*/
		if(!Game.player.can_level_stats) {
			return alert("Sorry, not enough points!");
		}
		/* Check button's data-stat */
		var stat = $(this).data('stat'),
			amount = (stat === "health") ? 10 : 1;
		if (Game.player.can_level_stats) {
			/* if stat is 'health', update by 10, if not, then 1 */
			Game.player[stat] += amount;
			/* Setting player's max health */
			if (stat === "health") {

				Game.player.max_health = Game.player.health;
			}
			Game.player.stat_points -= 1;

		}

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
	

} ());
