

function init(){
  w3.includeHTML();

}


function loadContent(page) {
  const main = document.querySelector("main");
  main.setAttribute("w3-include-html", page);
  w3.includeHTML();
}
