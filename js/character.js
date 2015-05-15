(function () {

	var Game = window.Game = window.Game || {};

	/**
	 * Game.Character
	 * @struct
	 * @param {Character=} obj
	 * @return {Character}
	 */
	Game.Character = function (obj) {

		var character = {
			// Don't copy another characters id. All Character instances should have a unique id.
			id: /** {string} */Game.Math.UUID(),

			name: /** {string} */(!obj || !obj.name) ? 'Unnamed' : obj.name,
			type: /** {string} */(!obj || !obj.type) ? 'Generic' : obj.type,

			health:	/** {number} */(!obj || !obj.health) ? 100 : obj.health,
			max_health:/** {number} */(!obj || !obj.max_health) ? 100: obj.max_health,
			defence:/** {number} */(!obj || !obj.defence) ? 1 : obj.defence,
			strength: /** {number} */(!obj || !obj.strength) ? 1 : obj.strength,
			intellect: /** {number} */(!obj || !obj.intellect) ? 1 : obj.intellect,
			dexterity: /** {number} */(!obj || !obj.dexterity) ? 1 : obj.dexterity,
			level: /** {number} */(!obj || !obj.level) ? 1 : obj.level,
			
			inventory: /** {array} */(!obj || !obj.inventory) ? [] : obj.inventory,

			experience:	/** {number} */(!obj || !obj.experience) ? 0 : obj.experience,
			experience_tnl: /** {number} */(!obj || !obj.experience_tnl) ? 50 : obj.experience_tnl,
			stat_points: /** {number} */(!obj || !obj.stat_points) ? 0 : obj.stat_points,
			max_stat_points: /** {number} */(!obj || !obj.max_stat_points) ? 0 : obj.max_stat_points,
			can_level_stats: /** {boolean} */(!obj || !obj.can_level_stats) ? false : obj.can_level_stats,
			
		};

		Game.Character.by_id[character.id] = character;

		if (!Game.Character.by_type.hasOwnProperty(character.type)) {

			Game.Character.by_type[character.type] = [];

		}

		Game.Character.by_type[character.type].push(character);

		return character;

	};


	// All Characters keyed by id
	Game.Character.by_id = {};

	// Lists of Characters by type
	Game.Character.by_type = {};


	/**
	 * Returns a Character based on a templated type.
	 *
	 * @param {string} name
	 * 				A named template to base the Character on
	 * @return {Character}
	 */
	Game.Character.from_template = function (name) {

		var template = {name: name};

		if (name === 'My Character') {

			template.type = 'Hero';
			// Default Character property values are correct for 'My Character'

		} else if (name === 'Rat') {

			template.type = 'Beast';
			template.health = 0.75;
			template.max_health = 0.75;
			template.strength = 0.5;
			template.intellect = 0;
			template.dexterity = 2;

		}

		return Game.Character(template);

	};


	// Gets the exp until next level based on advanced algorithm
	Game.Character.get_experience_tnl = function (character) {

		//Reasonable algorithm to calculat experience tnl
		return (Math.pow((character.level * 10), 2));

	};


	// Checks if stats can be upgraded
	Game.Character.check_can_level_stats = function (character) {

		if (character.stat_points > 0 && character.stat_points <= character.max_stat_points) {

			character.can_level_stats = true;

		} else if (character.stat_points === 0 || character.stat_points > character.max_stat_points) {

			character.can_level_stats = false;

		}

	};
	
	/**
	 * Game.Character.update
	 * 
	 * NOTE: The main game loop should be the only caller of this function, calling it once per loop.
	 */
	Game.Character.update = function () {
		
		var character_ids = Object.getOwnPropertyNames(Game.Character.by_id);

		for (var character_id in character_ids) {

			var character = Game.Character.by_id[character_ids[character_id]];
			
			// Destroy Characters (other than Game.player) that have zero health
			if (character !== Game.player && character.health <= 0) {
				
				Game.debug_info('Character "' + character.name + '" destroyed due to zero health');
				delete Game.Character.by_id[character.id];
				continue;
				
			}
			
		}
		
	};
	
	/* Used to add an item to the inventory. */
	Game.Character.add_to_inv = function(Item){
		
		// Check if items is being referenced by search (example: by_id) or direct from Game.Items.items
		Item = (Item[0]) ? Item[0] : Item;
		
		if(Game.player.inventory === "[]"){
			Game.player.inventory = Game.Character.prepare_inv_for_game(Game.player.inventory);	
		};
		Game.player.inventory.push(Item);
			
	};
	
	/* In order to save to the database, needs to be converted to a string */
	Game.Character.prepare_inv_for_save = function(inv){
	
		var new_inv = JSON.stringify(inv);
		return new_inv;
		
	};
	
	/* Will probably never be used but here just in case. Also gives insight as to how the inventory system works */
	Game.Character.prepare_inv_for_game = function(inv_str){
		
		var new_inv = JSON.parse(inv_str);
		return new_inv;
		
	};

} ());
