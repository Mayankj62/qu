function cookieGet(key) {
	return JSON.parse(document.cookie)[key];
}

function cookieSave(key, value) {
	var data;
	try {
		data = JSON.parse(document.cookie);
	}
	catch (error) {
		data = {};
	}
	data[key] = value;
	document.cookie = JSON.stringify(data);
}

function setupIssuePick() {
	$(".body-row").each(function(i) {
		var id = $(this).data('id');
		$(this).on('click touchstart', function() {
			cookieSave('issue', id);
			window.location.href = "/user3.html";
		});
	});
}

function addTime(time) {
	var newTime = $("#body-row-example").clone();
	newTime.text(time.string);
	newTime.removeAttr('style');
	newTime.removeAttr('id');
	newTime.insertAfter('.body-row:last-child');
	if (time.available == false) {
		newTime.addClass('body-row-disabled');
	}
	else {
		newTime.on('click touch', function() {
			cookieSave('time', time.string);
			$.post('/api/newAppointment', {
				task: cookieGet("issue"),
				time: time.string,
				personId: 2
			}, function(data) {
				console.log(data);
				cookieSave('id', data.id);
				window.location.href = "/user4.html";
			});
		});
	}
}

function setupTime() {
	$.get('/api/getAllTimes', function(data) {
		for (var i = 0; i < data.length; i++) {
			addTime(data[i]);
		}
	});
}

function setupConfirm() {
	$(".appointment-time").text(cookieGet('time'));
}

function formsReady() {
	$.post('/api/formStatus', {
		id: cookieGet('id'),
		status: "Verified"
	}, function(data) {
		console.log(data);
		window.location.href = '/user5.html';
	});
}

function setupStatus(current) {
	setInterval(function() {
		$.get('/api/getAppointment', {
			id: cookieGet('id')
		}, function(data) {
			var status = data.data.status;
			if (status == "handling" && current != "handling") {
				window.location.href = "/user6.html";
			}
			else if (status == "done" && current != "done") {
				window.location.href = "/user7.html";
			}
		});
	}, 500);
}

$(document).on('ready', function() {
	if (window.userState == "pick issue") {
		setupIssuePick();
	}
	else if (window.userState == "pick time") {
		setupTime();
	}
	else if (window.userState == "time confirmed") {
		setupConfirm();
	}
	else if (window.userState == "status" || window.userState == "handling" || window.userState == "done") {
		setupStatus(window.userState);
	}
});