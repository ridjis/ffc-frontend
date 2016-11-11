const DAILY_URI_LATLON = "http://api.openweathermap.org/data/2.5/forecast/daily";
const CURRENT_URI_LATLON = "http://api.openweathermap.org/data/2.5/weather";
const API_KEY = "&APPID=4c2cb45265febf619ec70af6f2dd363c";
let UNITS = "metric";

function getLocation() {
	if (navigator.geolocation) 
		navigator.geolocation.getCurrentPosition(function(position) {
			//console.log("Latitude: " + position.coords.latitude + "\nLongitude: " + position.coords.longitude);
			const CURRENT_URL = `${CURRENT_URI_LATLON}?lat=${position.coords.latitude}&lon=${position.coords.longitude}${API_KEY}&units=${UNITS}`;
			const DAILY_URL = `${DAILY_URI_LATLON}?lat=${position.coords.latitude}&lon=${position.coords.longitude}${API_KEY}&units=${UNITS}&cnt=1`;
			getJSON(CURRENT_URL, parsingCurrent);
			getJSON(DAILY_URL, parsingDaily);
		});
	else console.log("Geolocation is not supported by this browser.");
}

function getJSON(url, callback) {
	var req = new XMLHttpRequest();
	req.open("GET", url);
	req.onload = callback;
	req.send();
}

function parsingCurrent() {
	const json = JSON.parse(this.responseText);
	console.log("CURRENT: ", json);
	const body = document.getElementsByTagName("body")[0];
	const town = document.getElementById("town");
	const country = document.getElementById("country");
	const temperature = document.getElementsByClassName("current")[0];
	const icon = document.getElementsByClassName("icon")[0];
	const gradient = "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))";

	town.innerText = json.name;
	country.innerText = json.sys.country;
	temperature.innerText = Math.round(json.main.temp);

	switch(json.weather[0].main.toLowerCase()) {
		case "clouds":
			changeIcon(icon, "wi-cloudy");
			body.style["background-image"] = `${gradient}, url("https://hd.unsplash.com/photo-1462040700793-fcd2dbc0edf0")`;
			break;
		case "rain":
			changeIcon(icon, "wi-hail");
			body.style["background-image"] = `${gradient}, url("https://hd.unsplash.com/photo-1435914149323-1b656e7ab379")`;
			break;
		case "clear":
			changeIcon(icon, "wi-day-sunny");
			body.style["background-image"] = `${gradient}, url("https://hd.unsplash.com/photo-1433147926609-4a89b40610cc")`;
			break;
		case "thunderstorm":
			changeIcon(icon, "wi-day-thunderstorm");
			body.style["background-image"] = `${gradient}, url("https://hd.unsplash.com/photo-1427507791254-e8d2fe7db7c0")`;
			break;
		case "show":
			changeIcon(icon, "wi-snow");
			body.style["background-image"] = `${gradient}, url("http://www.thisiscolossal.com/wp-content/uploads/2016/01/eyeem-79952556.jpg")`;
			break;
		default:
			changeIcon(icon, "wi-day-cloudy-gusts");
			body.style["background-image"] = `${gradient}, url("https://hd.unsplash.com/photo-1458898257815-0ec6bfaa0ade")`;
			break;
	}
}

function parsingDaily() {
	const json = JSON.parse(this.responseText);
	console.log("DAILY: ", json);
	const maxtemp = document.getElementsByClassName("max-temp")[0];
	const mintemp = document.getElementsByClassName("min-temp")[0];

	maxtemp.innerText = Math.round(json.list[0].temp.max);
	mintemp.innerText = Math.round(json.list[0].temp.min);
}

function changeIcon(icon, className) {
	var list = icon.classList;
	// remove existing icon
	if (list) list.forEach(elem => {if (elem.startsWith("wi-")) icon.classList.remove(elem)});
	else icon.className = icon.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	// set new icon according to current weather
	if (list) icon.classList.add(className);
	else icon.classList += ' ' + className;
}

function ready(fn) {
  if (document.readyState != 'loading') fn();
  else document.addEventListener('DOMContentLoaded', fn);
}

ready(function() {
	document.getElementById("close-btn").addEventListener("click", (event) => {
		event.preventDefault();
		console.log("in");

		document.getElementById("closeable").style.display = "none";
	});
	getLocation();
	const map = document.getElementsByClassName("current")[0];
	console.log(map);
	map.addEventListener("click", (event) => {
		if (UNITS === "metric") UNITS = "imperial";
		else UNITS = "metric";
		getLocation();
	});
});