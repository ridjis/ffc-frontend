var tweetBaseURI = "https://twitter.com/intent/tweet?hashtags=quote&text=";

var colors = 
    ["#d60600", "#303F9F", "#512da8", "#F44336", "#C2185B", "#30a15f", "#3e2723", 
     "#F50057", '#16a085', '#27ae60', '#2c3e50', '#4800ef', '#e74c3c', 
     '#9b59b6', '#FB6964', '#342224', "#472E32", "#ff0022", "#512da8", "#73A857", 
     "linear-gradient(to bottom right, #0095d9, #4300d9) fixed",
     "linear-gradient(to left, #232526 , #414345) fixed",
     "linear-gradient(to left, #f85032 , #e73827) fixed",
     "linear-gradient(to left, #f85032 , #e73827) fixed",
     "linear-gradient(to left, #360033 , #0b8793) fixed"];

function changeColor() {
  var color = colors[Math.floor(Math.random() * colors.length)];
  $("body").css("background", color);
  
  if (!color.startsWith("#"))
    color = color.split(",")[1].trim();
 
  $(".blockquote, #author").css("color", color);
}

function getQuote() {
  $.ajax({
    headers: {
      "X-Mashape-Key": "lqGreumdqrmshOwen6xSGHrT9iyCp1dAYlVjsnRoy9ZtZUCCA0",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json"
    },
    url: "https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous",
    success: function(data) {
      var q = JSON.parse(data);
      
      $("#text").text(q.quote);
      $("#author").text(q.author);
      changeColor();
    }
  });
}

function tweet() {
  var tweetURL = tweetBaseURI + encodeURIComponent($("#text").text()) + encodeURIComponent(" - " + $("#author").text());

  window.open(tweetURL, "_self");
}

$(document).ready(function() {
  $(".quote-container").on("click", getQuote);
  $(".quote-container").on("contextmenu", function(event) {
    event.preventDefault();
    tweet();
  });
});