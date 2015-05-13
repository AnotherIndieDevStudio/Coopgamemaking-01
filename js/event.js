(function () {

	var Game = window.Game = window.Game || {};


	/**
	 * An Event.
	 *
	 * Examples of use:
	 * 		Game.Event({type: 'information', description: 'This is a an example'});
	 *
	 * 		Game.Event({type: 'environment', description: 'A train rattles passed', on_event: function () {
	 * 			console.log('Choo Choo!');
	 * 		}});
	 *
	 * @struct
	 * @param {Game.Event=} obj
	 * @return {Game.Event}
	 */
	Game.Event = function (obj) {

		var event = {
			// Don't copy another events id. All Event instances should have a unique id.
			id: /** {string} */Game.Math.UUID(),
			type: /** {string} */(!obj || !obj.type) ? Game.Event.Type.INFORMATION : obj.type,
			time: /** {number} */(!obj || !obj.time) ? (Game.time ? Game.time.elapsed : 0) : obj.time,
			description: /** {string} */(!obj || !obj.description) ? 'This event has no description' : obj.description,

			on_event: /** {function} */(!obj || !obj.on_event) ? function (event) { } : obj.on_event,
			on_interact: /** {function} */(!obj || !obj.on_interact) ? function (event) { } : obj.on_interact,
			on_expired: /** {function} */(!obj || !obj.on_expired) ? function (event) { } : obj.on_expired
		};

		return event;

	};



	/**
	 * Queues an Event to be fired when its time is older or at the current Game elapsed time.
	 *
	 * Examples of use:
	 * 		Game.Event.queue(Game.Event({type: 'information', description: 'This is a an example'}))
	 *
	 * @param {Game.Event} event
	 */
	Game.Event.queue = function (event) {

		if (!Game.Event.queued_by_time.hasOwnProperty(event.time)) {

			Game.Event.queued_by_time[event.time] = [];

		}

		Game.Event.queued_by_time[event.time].push(event);

	};


	var welcome_message_shown = false;


	/**
	 * Updates the events timeline.
	 *
	 * Internal use only. Called by main game loop, once per loop.
	 */
	Game.Event.update = function () {

		$("#hour_of_day").html(Game.time.hour12 + ' on Day ' + Game.time.day);

		if (!welcome_message_shown) {

			Game.Event.queue(Game.Event({ type: Game.Event.Type.INFORMATION, description: 'Welcome to CoopGameMaking.', on_event: queue_random_future_event }));
			welcome_message_shown = true;

		}

		// Find queued events that are ready to fire at or before current elapsed time
		var ordered_events = [];
		var queued_event_times = Object.getOwnPropertyNames(Game.Event.queued_by_time);

		for (var time in queued_event_times) {

			time = queued_event_times[time];

			if (time <= Game.time.elapsed) {

				// Sort events from queue into ordered_events list
				var ordered_index = 0;

				while (ordered_index < ordered_events.length && ordered_events[ordered_index][0].time < time) {

					++ordered_index;

				}

				for (var index in Game.Event.queued_by_time[time]) {

					var event = Game.Event.queued_by_time[time][index];
					ordered_events.splice(ordered_index, 0, event);

				}

				// Remove events from queue
				delete Game.Event.queued_by_time[time];

			}

		}

		// Iterate events that are ready to be fired
		for (var event in ordered_events) {

			event = ordered_events[event];

			// Add the Event bubble to the timeline
			var $bubble = $([
				'<div class="event_bubble ' + event.type.style + '">',
				'    <div class="event_time">' + Game.time.hour12 + ' on Day ' + Game.time.day + '</div>',
				'    <div class="event_description">' + event.description + '</div>',
				'</div>'
			].join('\n'));

			$("#events").prepend($bubble);

			$bubble.animate({ marginTop: 10, opacity: 1 }, 1000);

			// Updates the notification count when notifications are hidden
			if (Game.Event.events_hidden) {

				Game.Event.event_count += 1;
				$("#event-count").html("(" + Game.Event.event_count + ")");
				$(".event_bubble").hide();

			}

			// Checks if there are too many notifications. If so, remove the last one.
			delete_overflow_events();

			// Execute the events on_event function
			event.on_event(event);

		};


	};

	// Deletes overflowing event bubbles from the page
	var delete_overflow_events = function(){

		$(".event_bubble").each(function(){

			// Checks if bottom of the event bubble is overlapping the bottom information (will change to get exact position later)
			if( $(this).position().top + $(this).outerHeight(true) > Game.Math.window_height - 175){
				$(this).remove();
			};

		});

	};


	// Events hidden
	Game.Event.events_hidden = false;

	// Events missed while events were hidden
	Game.Event.event_count = 0;

	// Events to be fired, queued by time
	Game.Event.queued_by_time = {};

	// The frequency range (in Game.time.elapsed ticks) of which above events are picked to fire
	var event_frequency_max = 30;
	var event_frequency_min = 100;



	/**
	 * An Event Type.
	 *
	 * Examples of use:
	 * 		Game.Event.Type({name: 'information', border: 0});
	 *
	 * 		Game.Event.Type({name: 'environment', border: '1px solid gray'});
	 *
	 * @struct
	 * @param {Game.Event.Type=} obj
	 * @return {Game.Event.Type}
	 */
	Game.Event.Type = function (obj) {

		var type = {
			name: /** {string} */(!obj || !obj.name) ? 'undefined' : obj.name,
			style: /** {string} */(!obj || !obj.style) ? 'event_information' : obj.style
		};

		return type;

	};


	Game.Event.Type.INFORMATION = Game.Event.Type({name: 'information', style: 'event_information'});
	Game.Event.Type.ENVIRONMENT = Game.Event.Type({name: 'environment', style: 'event_environment'});
	Game.Event.Type.CONFRONTATION = Game.Event.Type({name: 'confrontation', style: 'event_confrontation'});
	Game.Event.Type.EXCHANGE = Game.Event.Type({name: 'exchange', style: 'event_exchange'});
	Game.Event.Type.FIGHT_TURN = Game.Event.Type({name: 'fight_turn', style: 'event_fight_turn'});


	/**
	 * Template on_event for random events to use as a "queue next random event".
	 *
	 * @param {Game.Event} event
	 */
	var queue_random_future_event = function (event) {

		var next_event = Game.Event.events[~~(Math.random() * Game.Event.events.length - 0.1)];

		next_event.time = event.time + event_frequency_max +
		~~(Math.random() * (event_frequency_min - event_frequency_max));

		Game.Event.queue(next_event);

	};



	// List of all possible random events
	Game.Event.events = [
		Game.Event({ type: Game.Event.Type.ENVIRONMENT, description: 'The smell of a sweet chicken broth circles about', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.ENVIRONMENT, description: 'The streets grow quieter as dusk approaches', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.ENVIRONMENT, description: 'The sun rises, a new day begins', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.ENVIRONMENT, description: 'A foul wind blows from the west', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.CONFRONTATION, description: 'A mischief of rats darts towards you from behind a pile of garbage', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.CONFRONTATION, description: 'You feel the touch of a thiefs delicate fingers slipping into your back pocket', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.CONFRONTATION, description: 'A woman cries out "HELP! Somebody please help me!" as a man holding her purse heads in your general direction', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.EXCHANGE, description: 'Growing weary, you find the closest tavern, take a load off your feet and engage the old bartender in conversation', on_event: queue_random_future_event }),
		Game.Event({ type: Game.Event.Type.EXCHANGE, description: 'A peddler of foreign appearances rattles his staff as he hobbles on by', on_event: queue_random_future_event })
	];


	Game.Event.fire_event = function(event){
		
		// Add the Event bubble to the timeline
		var $bubble = $([
			'<div class="event_bubble ' + event.type.style + '">',
			'    <div class="event_time">' + Game.time.hour12 + ' on Day ' + Game.time.day + '</div>',
			'    <div class="event_description">' + event.description + '</div>',
			'</div>'
		].join('\n'));
		
		$("#events").prepend($bubble);

		$bubble.animate({ marginTop: 10, opacity: 1 }, 1000);
		
		delete_overflow_events();
			
	};
	
	/* Hide events */
	$("#event-toggle").click(function(){
		if(!Game.Event.events_hidden){
			$(".event_bubble").hide(1000);
			$(this).html("Show Events");
			$("#event-count").html("(" + Game.Event.event_count + ")");
			Game.Event.events_hidden = true;
		}else{
			$(".event_bubble").show(function(){
				delete_overflow_events();
			});
			$(this).html("Hide Events");
			$("#event-count").html("");



			Game.Event.events_hidden = false;
			Game.Event.event_count = 0;
		}
	});

} ());
