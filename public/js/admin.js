var appointments = {};
var currentAppointment = null;

function addAppointment(appointment) {
	var newAppointment = $("#customer-card-example").clone();
	newAppointment.insertAfter(".customer-card:last-child");
	updateAppointment(appointment.id, newAppointment);
	newAppointment.attr('style', '');
}

function removeAppointment(id) {
	$(".customer-card[data-id='" + id + "']").remove();
	delete appointments[id];
}

function updateAppointment(id, newAppointment) {
	if (!newAppointment) {
		newAppointment = $(".customer-card[data-id='" + id + "']");
	}
	var appointment = appointments[id];
	//console.log(appointment);
	newAppointment.attr('data-id', appointment.id);
	newAppointment.removeAttr('id');
	newAppointment.find(".customer-name").text(appointment.person.name);
	newAppointment.find("img").attr('src', appointment.person.image);
	newAppointment.find(".customer-issue").text(appointment.task.name);
	newAppointment.find(".customer-time").text(appointment.time);	
	newAppointment.find(".customer-forms").text(appointment.forms);
	newAppointment.find(".customer-status").text(appointment.status);	
	newAppointment.find(".customer-checkin").on('click', function() {
		handleAppointment(id);
	});
}

function updateAppointments() {
	$.get('/api/getAppointments', function(data) {
		$(".customer-card[data-id]").remove();
		for (var i = 0; i < data.length; i++) {
			appointments[data[i].id] = data[i];
			addAppointment(data[i]);
		}
	});
}

function setCustomer(appointment) {
	currentAppointment = appointment;
	$(".no-customer-row").css('display', 'none');
	$(".current-customer-row").css('display', 'block');
	$(".current-customer-row").find("img").attr('src', appointment.person.image);
	$(".current-customer-row").find(".customer-name").text(appointment.person.name);
	$(".current-customer-row").find(".customer-issue").text(appointment.task.name);	
	$(".current-customer-row").find(".customer-forms").text(appointment.forms);		
}

function clearCustomer() {
	$(".current-customer-row").css('display', 'none');
	$(".no-customer-row").css('display', 'block');	
}

function handleAppointment(id) {
	$.post('/api/handleAppointment', {
		id: id,
		agent: 0
	}, function(data) {
		setCustomer(appointments[id]);
	});
}

function finishAppointment() {
	$.post('/api/finishAppointment', {
		agent: 0,
		id: currentAppointment.id
	}, function(data) {
		clearCustomer();
		updateAppointments();
	});
}

$(document).on('ready', function() {
	clearCustomer();
	updateAppointments();
	setInterval(updateAppointments, 1000);
});