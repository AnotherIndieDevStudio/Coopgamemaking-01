(function () {

	var Game = window.Game = window.Game || {};

	/**
	 * Game.Wound
	 * @struct
	 * @param {Game.Wound=} obj
	 * @return {Game.Wound}
	 */
	Game.Wound = function (obj) {

		var wound = {

			id: /** {string} */Game.Math.UUID(),
			size: /** {number} */(!obj || !obj.size) ? HEAL_AT_OR_UNDER_SIZE : obj.size,
			character: /** {Game.Character} */(!obj || !obj.character) ? null : obj.character,
			inflicted: /** {number} */(!obj || !obj.inflicted) ? 0 : obj.inflicted

		};
		
		// Clamp size to allowed range
		wound.size = Game.Math.clamp(wound.size, MIN_SIZE, MAX_SIZE);
		
		Game.Wound.by_id[wound.id] = wound;

		return wound;

	};


	// All Wounds keyed by id
	Game.Wound.by_id = {};
	
	// Size range
	var MAX_SIZE = 1;
	var MIN_SIZE = 0.001;
	
	// Grow and self-heal limits
	var GROW_AT_OR_OVER_SIZE = 0.7;
	var HEAL_AT_OR_UNDER_SIZE = 0.3;
	
	// Rate of -health that Wound at MAX_SIZE will apply to character in one Game day  
	var MAX_INFLICTED_PER_DAY = 100;
	
	
	/**
	 * Game.Wound.update
	 * 
	 * NOTE: The main game loop should be the only caller of this function, calling it once per loop.
	 */
	Game.Wound.update = function () {
		
		var wound_ids = Object.getOwnPropertyNames(Game.Wound.by_id);

		for (var wound_id in wound_ids) {

			var wound = Game.Wound.by_id[wound_ids[wound_id]];
			
			// Destroy Wounds that don't have a valid Character assign to them or are already dead
			if (!wound.character || !Game.Character.by_id.hasOwnProperty(wound.character.id)) {
				
				console.log('Wound destroyed due to invalid character {' + wound.id + '} ');
				delete Game.Wound.by_id[wound.id];
				continue;
				
			}
			
			// Destroy Wounds whos character is already dead
			if (Game.Character.by_id[wound.character.id].health <= 0) {
				
				console.log('Wound destroyed due to character being dead {' + wound.id + '} ');
				delete Game.Wound.by_id[wound.id];
				continue;
				
			}
			
			// Apply Wound to Characters health
			wound.inflicted += wound.size * (MAX_INFLICTED_PER_DAY / Game.time.ELAPSED_PER_DAY);
			console.log('Wound {' + wound.id + '} size: ' + wound.size + ', inflict: -' + wound.inflicted);
			
			if (wound.inflicted >= 1) {
				
				Game.Character.by_id[wound.character.id].health -= ~~wound.inflicted;
				wound.inflicted -= ~~wound.inflicted;
				
			}
			
			// Notify the death of a Character
			if (wound.character.health <= 0) {
				
				Game.add_event({ description: wound.character.name + ' is dead' });
				
			}
			
			// Shrink or grow wound based on severity
			if (wound.size <= HEAL_AT_OR_UNDER_SIZE) {
				
				wound.size -= 1 / Game.time.ELAPSED_PER_DAY;
				
			} else if (wound.size > GROW_AT_OR_OVER_SIZE && wound.size < MAX_SIZE) {
				
				wound.size += 1 / Game.time.ELAPSED_PER_DAY;
				
			}
			
			// Wound is completely healed at zero size
			if (wound.size <= 0) {
				
				console.log('Wound healed {' + wound.id + '}');
				delete Game.Wound.by_id[wound.id];
				
			}

		}

	};

} ());
