// timer.js by lucas-allegri @ 2020
// uwu


// Dates to countdown to. Once a date is already past it'll switch to the next automatically.
// Format to use is:          MONTH_NAME DAY_NUMBER YEAR_NUMBER HOUR:MINUTES:SECONDS TIMEZONE
// Example: 'November 30 2020 08:00:00 GMT'
var dates = [
	'November 29 2021 08:00:00 GMT',
];

var clock = document.getElementById("mainClock");
var daysSpan = clock.querySelector('.days');
var hoursSpan = clock.querySelector('.hours');
var minutesSpan = clock.querySelector('.minutes');
var secondsSpan = clock.querySelector('.seconds');

var isNear = false;

const UPDATE_INTERVAL = 1000; // Updates every 1s, for obvious reasons.
const NEAR_THRESHOLD = 2;

function getTimeRemaining() {
	var now = Date.parse(new Date().toGMTString());
	var nextDate;
	for (var i = 0; i < dates.length; i++) {
		var timestamp = Date.parse(dates[i]);
		if (now > timestamp) {
			dates.splice(i, 1);
			continue;
		}
		else {
			document.getElementById("dateDetailed").innerHTML = "<i>" + dates[i] + "</i>"
			nextDate = timestamp;
			break;
		}
	}
	var remaining = nextDate - now;
	var seconds = Math.floor((remaining/1000) % 60);
	var minutes = Math.floor((remaining/1000/60) % 60);
	var hours = Math.floor((remaining/1000/60/60) % 24);
	var days = Math.floor((remaining/1000/60/60/24));
	if (minutes <= NEAR_THRESHOLD && !isNear) {
		isNear = true;
		pushNotification('Get ready!', 
		"The next offer is about to come up.");
	}
	else if (minutes > NEAR_THRESHOLD && isNear) {
		isNear = false;
	}
	return {
		'total': remaining,
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	};
}

// Properly formats a time value to fill empty positions with a 0. Eg. 2 -> 02.
function formatTimeValue(val) { return ('0' + val).slice(-2); }

function updateClock() {
	var remaining = getTimeRemaining();
	daysSpan.innerHTML = remaining.days;
	hoursSpan.innerHTML = formatTimeValue(remaining.hours);
	minutesSpan.innerHTML = formatTimeValue(remaining.minutes);
	secondsSpan.innerHTML = formatTimeValue(remaining.seconds);
}

function pushNotification(title, body) {
	new Notification(title, {
		icon: 'blank',
		body: body,
		});
}

document.addEventListener('DOMContentLoaded', function() {
	if (!Notification) {
		alert('Desktop notifications not available in your browser.');
		return;
	}

	if (Notification.permission !== 'granted')
		Notification.requestPermission();
});

updateClock();
setInterval(updateClock, UPDATE_INTERVAL);