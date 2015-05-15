(function () {

	var Game = window.Game = window.Game || {};
	
	/**
	 * Game.Location
	 * @struct
	 * @param {Game.Location=} obj
	 * @return {Game.Location}
	 */
	Game.Location = function (obj) {

		var location = {

			id: /** {string} */Game.Math.UUID(),
			name: /** {string} */(!obj || !obj.name) ? 'Unnamed' : obj.name,
			characters: /** {Game.Character[]} */[],
			items: /** {Game.Item[]} */[]

		};
		
		if (obj && obj.characters) {
			
			for (var character_index = 0; character_index < obj.characters.length; ++character_index) {
				
				location.characters.push(obj.characters[character_index]);
				
			}
			
		}
		
		if (obj && obj.items) {
			
			for (var item_index = 0; item_index < obj.items.length; ++item_index) {
				
				location.items.push(obj.items[item_index]);
				
			}
			
		}
		
		Game.Location.by_id[location.id] = location;
		Game.Location.all_locations.push(location);

		return location;

	};
	
	
	/**
	 * Moves a {Game.Character} to a {Game.Location}.
	 * 
	 * The character is first removed from its existing location (if one exists), before being added to the new.
	 * 
	 * @param {Game.Character} character
	 * @param {Game.Location} location
	 */
	Game.Location.move_character = function (character, location) {
		
		if (!character || !location) {
			
			Game.debug_info('Game.Location.move_character: Bad parameters (' + character + ', ' + location + ')');
			
		}
		
		// If character has a current location
		if (character.location) {
			
			// If characters current location is the same as the move location, do nothing
			if (character.location === location) {
				
				return;
				
			}
			
			// Else find the characters index in its current location and remove it
			var index = character.location.characters.indexOf(character);
			
			if (index > -1) {
				
				
				character.location.characters.splice(index, 1);
				
			}
			
		}
		
		// Add character to new location
		location.characters.push(character);
		character.location = location;
		
		Game.debug_info('Game.Location.move_character: Character "' + character.name + '" moved to Location "' + location.name + '"');
		
	};
	
	
	/**
	 * Moves a {Game.Item} to a {Game.Location}.
	 * 
	 * The item is first removed from its existing location (if one exists), before being added to the new.
	 * 
	 * @param {Game.Item} item
	 * @param {Game.Location} location
	 */
	Game.Location.move_item = function (item, location) {
		
		// If item has a current location
		if (item.location) {
			
			// If items current location is the same as the move location, do nothing
			if (item.location === location) {
				
				return;
				
			}
			
			// Else find the items index in its current location and remove it
			var index = item.location.items.indexOf(item);
			
			if (index > -1) {
				
				
				item.location.items.splice(index, 1);
				
			}
			
		}
		
		// Add item to new location
		location.items.push(item);
		item.location = location;
		
		Game.debug_info('Game.Location.move_item: Item "' + item.name + '" moved to Location "' + location.name + '"');
		
	};
	
	
	// Map of all Game.Locations keyed by id
	Game.Location.by_id = {};
	
	// List of all Game.Locations
	Game.Location.all_locations = [];
	
	
	
	
	/**
	 * Game.Location.update
	 * 
	 * NOTE: The main game loop should be the only caller of this function, calling it once per loop.
	 */
	Game.Location.update = function () {
		
		for (var location in Game.Location.all_locations) {
			
			 

		}

	};
	
	
	
	Game.Location.THEVOID = Game.Location({name: 'The Void'});
	Game.Location.TOWNCENTRE = Game.Location({name: 'Town centre'});
	
	

} ());
