// Creating the monster object
Monster = function(id, name, type, level, health, max_health, strength, dexterity, intellect){
	
	// General monster information
	this.id = id;
	this.name = name;
	this.type = type;
	
	//  Stats
	this.level = level;
	this.health = health;
	this.max_health = max_health;
	this.strength = strength;
	this.dexterity = dexterity;
	this.intellect = intellect;
	
};

// Where the monsters are created
var rat = new Monster(01, "Rat", "Beast", 1, 0.75, 0.75, 0.5, 2, 0);

// Array of monsters for random selection
var monster_list = [rat];

var get_monster = function(id){
		
		var amt_of_monsters = monster_list.length;
		
		if(!id){
			// Selects a random monster from the monster_list and returns the monster object
			var monster_select = Math.floor((Math.random() * amt_of_monsters));
			console.log(monster_select);
			return(monster_list[monster_select]);	
		}else{
			// If id is specified, return the monster with the same ID.
			for(var monster in monster_list){
				if(monster.id == id){
					return(monster);	
				}
			}
		}
		
};

