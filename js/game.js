/* Creating global Vars */

// Stats 
var health = 100;
var strength = 1;
var intellect = 1;
var dexterity = 1;
// Level control
var level = 1;
var experience = 0;
var experience_tnl = 50;
var stat_points = 0;
var max_stat_points = 0;
var can_level_stats = false;

// Time
var game_time = 250;
var prev_time = new Date();
var passed_time = 0;

/* Updating variables on page when the document loads */
$(document).ready(function(e) {
	
	// Initiate stats on screen
	update_stats();
	
	// Game Loop
	var game_tick = setInterval(function(){
		
			// Ensures that the game still functions when the tab is closed
			var current_time = new Date();
			var time_difference = (current_time.getTime() - prev_time.getTime());
			
			// Calculates the difference in time and returns multiplier
			if(time_difference > game_time){
				if(Math.floor(time_difference/game_time > 1)){
					passed_time = Math.floor(time_difference/game_time)
				}else{
					passed_time = 1;	
				}
			}else{
				passed_time = 1;	
			}
			prev_time = new Date();
			update_game(passed_time);
			
		}, game_time);
	
});

var update_stats = function(){
	
	// Updating stats
	$("#stat_points").html(stat_points);
	$("#level").html(level);
	$("#health").html(health);
	$("#strength").html(strength);
	$("#intellect").html(intellect);
	$("#dexterity").html(dexterity);
	$("#exp").html(experience);
	$("#exp_tnl").html(experience_tnl);
	
};

var update_game = function(passed_time){
		
	// Adds exp each game tick
	experience += 10*passed_time;
	if(experience > experience_tnl){
		experience -= experience_tnl;
		experience_tnl = get_experience_tnl();
		level += 1;
		stat_points += 2;
		max_stat_points += 2;
	}
	
	// Updates stats on the screen
	update_stats();
	
	// Checks if stats can be upgraded
	check_stat_points();
	
};

// Gets the exp until next level based on advanced algorithm
var get_experience_tnl = function(){
	
	//Random algorithm that doesn't make sense at all
	return (Math.pow((level*10), 2));
	
};


// Checks if stats can be upgraded and shows + symbols
var check_stat_points = function(){
	
	if(stat_points > 0 && stat_points <= max_stat_points){
		can_level_stats = true;
		$(".add_stat").show();
	}else if(stat_points == 0 || stat_points > max_stat_points){
		can_level_stats = false	
		$(".add_stat").hide();
	}
	
}

/* Checks for clicks on stat upgrades */

// Health
$("#health_add").click(function(){
	if(can_level_stats){
		health += 10;
		stat_points -= 1;
		check_stat_points();
	}
});


// Strength
$("#strength_add").click(function(){
	if(can_level_stats){
		strength += 1;
		stat_points -= 1;
		check_stat_points();
	}
});


//Intellect
$("#intellect_add").click(function(){
	if(can_level_stats){
		intellect += 1;
		stat_points -= 1;
		check_stat_points();
	}
});


//Dexterity
$("#dexterity_add").click(function(){
	if(can_level_stats){
		dexterity += 1;
		stat_points -= 1;
		check_stat_points();
	}
});
