(function() {
	
	var Game = window.Game = window.Game || {};
	
	Game.Item = function(obj) {
		
		/**
		* A Character
		* @struct
		* @param {Character=} obj
		* @return {Character}
		*/
		
		var item = {
			id: /** {number} **/ (!obj || !obj.id) ? 0 : obj.id,
			name: /** {string} **/ (!obj || !obj.name) ? "Nameless" : obj.name,
			type: /** {string} **/ (!obj || !obj.type) ? "undefined" : obj.type,
			description: /** {string} **/ (!obj || !obj.description) ? "No Description" : obj.description,
			// Attributes are changes to the characters stats
			attributes: {
				health: /** {number} **/ (!obj || !obj.attributes.health) ? 0 : obj.attributes.health,
				strength: /** {number} **/ (!obj || !obj.attributes.strength) ? 0 : obj.attributes.strength,
				dexterity:  /** {number} **/ (!obj || !obj.attributes.dexterity) ? 0 : obj.attributes.dexterity,
				intellect: /** {number} **/ (!obj || !obj.attributes.intellect) ? 0 : obj.attributes.intellect,
			}
		};
		
		// Indexing items by type
		if(!Game.Item.by_type.hasOwnProperty(item.type)){
			Game.Item.by_type[item.type] = [];
		};
		
		Game.Item.by_type[item.type].push(item);
		
		return item;
	
	};
	
	Game.Item.by_type = {};
	
	Game.Items = {};
	/* Some predefined items */
	Game.Items.items = [
		Game.Item({id: 1, name: "Hat", type: "Armour", description: "A simple hat", attributes: {health: 5, strength: 1, dexterity: 0, intellect: 1}}),
		Game.Item({id: 2, name: "Wooden Sword", type: "Weapon", description: "A weak training sword", attributes: {health: 0, strength: 10, dexterity: 3, intellect: 0}})
	];
	
	
} ());