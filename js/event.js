(function () {
	
	var Game = window.Game = window.Game || {};
	
	/**
	 * An Event
	 * @struct
	 * @param {Event=} obj
	 * @return {Event}
	 */
	Game.Event = function (obj) {
		
		return {
			// Don't copy another events id. All Event instances should have a unique id.
			id: /** {string} */Game.Math.UUID(),
			type: /** {string} */(!obj || !obj.type) ? 'undefined' : obj.type,
			time: /** {number} */(!obj || !obj.time) ? (Game.time ? Game.time.elapsed : 0) : obj.time,
			description: /** {string} */(!obj || !obj.description) ? 'This event has no description' : obj.description
		};
		
	};
	
	
	// Events to be fired, queued by time 
	Game.Event.queued_by_time = {};
	
	
	/**
	 * Queues an Event to be fired when its time is earlier and at the current Game elapsed time.
	 * 
	 * @param {Event} event
	 */
	Game.Event.queue = function (event) {
		
		if (!Game.Event.queued_by_time.hasOwnProperty(event.time)) {
			
			Game.Event.queued_by_time[event.time] = [];
			
		}
		
		Game.Event.queued_by_time[event.time].push(event);
		
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
	
	
	// The frequency range (in Game.time.elapsed ticks) of which above events are picked to fire
	Game.Events.event_frequency_max = 20;		// Minimum elapsed ticks till next event
	Game.Events.event_frequency_min = 200;		// Maximum elapsed ticks till next event
	
	
	// Queue the very first Event to be an informational welcome message
	Game.Event.queue(Game.Event({type: 'information', description: 'Welcome to CoopGameMaking', on_event: function (event) {
		
		var next_event = Game.Events.events[~~(Math.random() * Game.Events.events.length - 0.1)];
		next_event.time = event.time + Game.Events.event_frequency_max +
				~~(Math.random() * (Game.Events.event_frequency_min - Game.Events.event_frequency_max));
		Game.Event.queue(next_event); 
		
	}}));
	
	
	/**
	 * Updates the events timeline.
	 */
	Game.Events.update = function () {
		
		// Find queued events that are ready to fire at or before current elapsed time and sort them by time
		var ordered_events_to_fire = [];
		var queued_event_times = Object.getOwnPropertyNames(Game.Event.queued_by_time);
		
		for (var queued_event_time in queued_event_times) {
			
			if (queued_event_time <= Game.time.elapsed) {
				
				var ordered_index = 0;
				
				while (ordered_index < ordered_index.length && ordered_events_to_fire[0].time < queued_event_time) {
					
					++ordered_index;
					
				}
				
				for (var event in Game.Event.queued_by_time[queued_event_time]) {
					
					ordered_events_to_fire.splice(ordered_index, event);
					
				}
				
			}
			
		}
		
		// Iterate events that are ready to be fired 
		for (var event in ordered_events_to_fire) {
					
			event = ordered_events_to_fire[event];
			
			// Add the Event bubble to the timeline
			var $bubble = $([
				'<div class="event_bubble">',
				'    <div class="event_time">t+' + event.time + '</div>',
				'    <div class="event_description">' + event.description + '</div>',
				'</div>'
			].join('\n'));
			
			$("#events").prepend($bubble);
			
			$bubble.animate({marginTop: 10, opacity: 1}, 1000);
			
			// Execute the events on_event function
			event.on_event(event);
			
		}
		
	};
	
} ());
