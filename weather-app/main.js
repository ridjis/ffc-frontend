const DAILY_URI_LATLON = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/forecast/daily";
const CURRENT_URI_LATLON = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather";
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
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/sf8O2mY.jpg")`;
			break;
		case "rain":
			changeIcon(icon, "wi-hail");
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/RoBr48j.jpg")`;
			break;
		case "clear":
			changeIcon(icon, "wi-day-sunny");
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/dA00Juc.jpg")`;
			break;
		case "thunderstorm":
			changeIcon(icon, "wi-day-thunderstorm");
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/EP2QgOT.jpg")`;
			break;
		case "show":
			changeIcon(icon, "wi-snow");
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/v5HvWFY.jpg")`;
			break;
		default:
			changeIcon(icon, "wi-day-cloudy-gusts");
			body.style["background-image"] = `${gradient}, url("https://i.imgur.com/igvjwLn.jpg")`;
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
	getLocation();
	const map = document.getElementsByClassName("current")[0];
	console.log(map);
	map.addEventListener("click", (event) => {
		if (UNITS === "metric") UNITS = "imperial";
		else UNITS = "metric";
		getLocation();
	});
});