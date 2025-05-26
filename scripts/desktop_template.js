/**
 * Function to load summary.html on initiation
 * 
 */
function init(){
  w3.includeHTML();
}

/**
 * Function to load according content from nav-tag link
 * 
 * @param {String} page - this is the directory of the new content-page 
 */
function loadContent(page) {
  const main = document.querySelector("main");
  main.setAttribute("w3-include-html", page);
  w3.includeHTML();
}

