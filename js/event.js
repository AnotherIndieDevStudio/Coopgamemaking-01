(function () {
	
	var Game = window.Game = window.Game || {};
	
	/**
	 * An Event
	 * @struct
	 * @param {Event=} obj
	 * @return {Event}
	 */
	Game.Event = function (obj) {
		
		var event = {
			// Don't copy another events id. All Event instances should have a unique id.
			id: /** {string} */Game.Math.UUID(),
			type: /** {string} */(!obj || !obj.type) ? 'undefined' : obj.type,
			time: /** {number} */(!obj || !obj.time) ? (Game.time ? Game.time.elapsed : 0) : obj.time,
			description: /** {string} */(!obj || !obj.description) ? 'This event has no description' : obj.description
		};
		
		// Index event by_id
		Game.Event.by_id[event.id] = event;
		
		// Index event by_type
		if (!Game.Event.by_type.hasOwnProperty(event.type)) {
			
			Game.Event.by_type[event.type] = [];
			
		}
		
		Game.Event.by_type[event.type].push(event);
		
		// Index event by_time
		if (!Game.Event.by_time.hasOwnProperty(event.time)) {
			
			Game.Event.by_time[event.time] = [];
			
		}
		
		Game.Event.by_time[event.time].push(event);
		
		return event;
		
	};
	
	
	// Events by id 
	Game.Event.by_id = {};
	
	// Events by type
	Game.Event.by_type = {};
	
	// Events by time
	Game.Event.by_time = {};
	
	
	
	/**
	 * Adds the event bubble to the timeline.
	 * 
	 * @param {Event} event
	 */
	Game.Event.add_to_timeline = function (event) {
		
		var $bubble = $([
			'<div class="event_bubble">',
			'    <div class="event_time">t+' + event.time + '</div>',
			'    <div class="event_description">' + event.description + '</div>',
			'</div>'
		].join('\n'));
			
		$("#events").prepend($bubble);
		
		$bubble.animate({marginTop: 10, opacity: 1}, 1000);
		
	};
	
	
	
	Game.Events = {};
	
	Game.Events.events = [
		Game.Event({type: 'environment', description: 'The smell of a sweet chicken broth circles about'}),
		Game.Event({type: 'environment', description: 'The streets grow quieter as dusk approaches'}),
		Game.Event({type: 'environment', description: 'The sun rises, a new day begins'}),
		Game.Event({type: 'environment', description: 'A foul wind blows from the west'}),
		Game.Event({type: 'confrontation', description: 'A mischief of rats darts towards you from behind a pile of garbage'}),
		Game.Event({type: 'confrontation', description: 'You feel the touch of a thiefs delicate fingers slipping into your back pocket'}),
		Game.Event({type: 'confrontation', description: 'A woman cries out "HELP! Somebody please help me!" as a man holding her purse heads in your general direction'}),
		Game.Event({type: 'exchange', description: 'Growing weary, you find the closest tavern, take a load off your feet and engage the old bartender in conversation'}),
		Game.Event({type: 'exchange', description: 'A pedler of foreign appearances rattles his staff as he hobbles on by'})
	];
	
	
	Game.Events.event_frequency_max = 20;
	Game.Events.event_frequency_min = 200;
	
	Game.Events.next_event = Game.Event({type: 'information', description: 'Welcome to CoopGameMaking'});
	
	/**
	 * Updates the events timeline.
	 */
	Game.Events.update = function () {
		
		if (Game.time.elapsed >= Game.Events.next_event.time) {
			
			Game.Event.add_to_timeline(Game.Events.next_event);
			
			var events_index = ~~(Math.random() * Game.Events.events.length);
			
			if (events_index === Game.Events.events.length) {
				--events_index;
			}
			
			Game.Events.next_event = Game.Events.events[events_index];
			Game.Events.next_event.time = Game.time.elapsed + Game.Events.event_frequency_max +
				~~(Math.random() * (Game.Events.event_frequency_min - Game.Events.event_frequency_max));
			
		}
		
	};
	
} ());
