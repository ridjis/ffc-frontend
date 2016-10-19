const page = "https://en.wikipedia.org/?curid=";
const random = "https://en.wikipedia.org/wiki/Special:Random";
const uri = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=";

$(document).ready(function() {
  query();
});

function query() {
  const form = document.querySelector("form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const term = encodeURIComponent(form.elements.gsrsearch.value);
    console.log(term);
    if (term === "")
      window.open(random, "_blank");
    else { 
      $.getJSON(uri + term + "&callback=?", function(data) {
        const json = data.query.pages;
        let articles = [];
        for (let key in json) if (json.hasOwnProperty(key)) articles.push(json[key]);

        const markup = 
          `${articles.map(ar => ` 
            <article>
            <h2>${ar.title}</h2>
            <p>${ar.extract}</p>
            <a href="${page + ar.pageid}"></a>
            </article>
            `).join("")}`;

        form.elements.gsrsearch.value = "";
        const body = document.querySelector("body");
        document.getElementById("search").style.height = "15vh";
        document.getElementById("results").innerHTML = markup;
      });
    }
  });
}