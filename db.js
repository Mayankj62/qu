var people = [
	{
		'name': 'Brad',
		'image': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Brad_Pitt_Fury_2014.jpg',
	},
	{
		'name': 'Kathleen',
		'image': 'https://d3v7qf8zyypult.cloudfront.net/profiles/kathleen-wynne/small/headshot.jpg'
	},
	{
		'name': 'Il Sung',
		'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Kim_Il_Sung_Portrait-2.jpg/220px-Kim_Il_Sung_Portrait-2.jpg'
	}
];

var locations = [
	{
		'company': 'BMO',
		'location': 'Bloor/Lansdowne',
		'color1': 'blue',
		'color2': 'white',
		'tasks': [
			{
				'name': 'Wire Transfer',
				'time_prepared': 1,
				'time_unprepared': 5
			},
			{
				'name': 'Mortgage',
				'time_prepared': 10,
				'time_unprepared': 30
			},
			{
				'name': 'New Account',
				'time_prepared': 5,
				'time_unprepared': 20
			},
			{
				'name': "Line of Credit",
				'time_prepared': 8,
				'time_unprepared': 20
			}
		]
	},
	{
		'company': 'ServiceOntario',
		'location': 'College/Bathurst',
		'color1': 'green',
		'color2': 'white',
		'tasks': [
			{
				'name': 'G1 License',
				'time_prepared': 5,
				'time_unprepared': 10
			},
			{
				'name': 'Health Card',
				'time_prepared': 3,
				'time_unprepared': 10
			}
		]
	}
]

module.exports.getLocations = function() {
	return locations;
}

module.exports.getLocation = function(id) {
	return locations[id];
}

module.exports.getTasks = function(locationId) {
	return locations[locationId].tasks;
}

module.exports.getPerson = function(id) {
	return people[id];
}

module.exports.setQueue = function(locationId, queue) {
	locations[locationId].queue = queue;
}

module.exports.getQueue = function(locationId) {
	return locations[locationId].queue;
}

module.exports.getHours = function(locationId, date) {
	return {
		'open': 8,
		'close': 18
	}
}