//Internal Dependencies
var db = require('./db.js');

function Queue(locationId, concurrency) {
	this.locationId = locationId;
	this.queue = [];
	var hours = db.getHours(locationId);
	for (var i = hours.open; i < hours.close; i++) {
		this.queue[i] = [[], [], [], []];
	}
	this.hours = Object.keys(this.queue);
	this.concurrency = concurrency;
	this.nextId = 0;
}

Queue.prototype.iterate = function(cb) {
	for (var i in this.hours) {
		var hour = this.hours[i];
		for (var quarterHour = 0; quarterHour < 4; quarterHour++) {
			if (!cb(this.queue[hour][quarterHour], hour, quarterHour)) break;
		}
	}
}

Queue.prototype.getAppointments = function() {
	var ret = [];
	this.iterate(function(q) {
		for (var key in q) {
			ret.push(q[key]);
		}
		return true;
	});
	return ret;
}

Queue.prototype.getAvailableTimes = function() {
	var ret = [];
	var queue = this;
	this.iterate(function(q, hour, quarterHour) {
		var time = 0;
		for (var key in q) {
			var appointment = q[key];
			if (appointment.status != "done") {			
				time += (appointment.task.time_unprepared + appointment.task.time_prepared) / 2;
			}
		}
		if (time < 15 * queue.concurrency) {
			ret.push(hour + ":" + (quarterHour == 0 ? "00" : (quarterHour * 15)));
		}
		return true;
	});
	return ret;
}

Queue.prototype.getAllTimes = function() {
	var ret = [];
	var queue = this;
	this.iterate(function(q, hour, quarterHour) {
		var time = 0;
		for (var key in q) {
			var appointment = q[key];
			if (appointment.status != "done") {
				time += (appointment.task.time_unprepared + appointment.task.time_prepared) / 2;
			}
		}
		ret.push({
			string: hour + ":" + (quarterHour == 0 ? "00" : (quarterHour * 15)),
			available: time < 15 * queue.concurrency
		});
		return true;
	});
	return ret;	
}

Queue.prototype.getQ = function(timeString) {
	var split = timeString.split(":");
	var hour = parseInt(split[0]);
	var quarterHour = parseInt(split[1]) / 15;
	return this.queue[hour][quarterHour];
}

Queue.prototype.getAppointment = function(id) {
	var appointment = false;
	this.iterate(function(q) {
		for (var key in q) {
			if (q[key].id == id) {
				appointment = q[key];
				return false;
			}
		}
		return true;
	});
	if (appointment) {
		return appointment;
	}
	throw "Appointment not found";
}

Queue.prototype.add = function(personId, selectedTime, task) {
	if (this.getAvailableTimes().includes(selectedTime)) {
		this.getQ(selectedTime).push({
			person: db.getPerson(personId),
			task: task,
			time: selectedTime,
			id: this.nextId,
			forms: "Status Unknown",
			status: "On time"
		});
		this.nextId++;		
		return this.nextId - 1;		
	}
	else {
		throw "Time not available";
	}
}

Queue.prototype.getPosition = function(appointmentId) {
	var position = 0;
	for (var item in this.queue) {
		if (item.id == appointmentId) {
			return position;
		}
		position++;
	}
	throw "Appointment not in queue";
}

module.exports = Queue;