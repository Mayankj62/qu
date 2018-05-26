//External Dependencies
var express = require('express');
var bodyParser = require('body-parser');
//Internal Dependencies
var Queue = require('./queue.js');
var db = require('./db.js');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var q = new Queue(0, 1);
q.add(0, "8:00", db.getTasks(0)[1]);
q.add(1, "9:15", db.getTasks(0)[1]);

//console.log(q.getAppointments());

app.get('/api/getAppointments', function(req, res) {
	var apps = q.getAppointments();
	var ret = [];
	for (var i = 0; i < apps.length; i++) {
		if (apps[i].status != "done") {
			ret.push(apps[i]);
		}
	}
	res.json(ret);
});

app.get('/api/getAvailableTimes', function(req, res) {
	res.json(q.getAvailableTimes());
});

app.get('/api/getAllTimes', function(req, res) {
	res.json(q.getAllTimes());
});

app.post('/api/finishAppointment', function(req, res) {
	q.getAppointment(req.body.id).status = "done";
	res.json({success: true});	
});

app.post('/api/handleAppointment', function(req, res) {
	var appointment = q.getAppointment(req.body.id);
	appointment.status = "handling";
	appointment.agent = req.body.agent;
	res.json({success: true});
});

app.post('/api/setAppointmentValue', function(req, res) {
	var appointment = q.getAppointment(req.body.id);
	appointment[req.body.key] = req.body.value;
	res.json({success: true});
});

app.post('/api/newAppointment', function(req, res) {
	res.json({
		success: true,
		id: q.add(req.body.personId, req.body.time, db.getTasks(0)[req.body.task])
	});
	console.log(q.getAppointments());
});

app.post('/api/formStatus', function(req, res) {
	console.log(req.body);
	var appointment = q.getAppointment(req.body.id);
	appointment.forms = req.body.status;
	res.json({
		success: true
	});
})

app.get('/api/getAppointment', function(req, res) {
	res.json({
		success: true,
		data: q.getAppointment(req.query.id)
	});
});

app.listen(80, function() {
	console.log("Listening on port 80");
});