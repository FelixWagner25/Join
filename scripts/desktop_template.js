/**
 * Function to load summary.html on initiation
 *
 */
async function init() {
  w3.includeHTML();
/*   await initContacs(); */

}

/**
 * Function to load according content from nav-tag link
 *
 * @param {String} page - this is the directory of the new content-page
 */
/* function loadContent(page) { */
/*   const main = document.querySelector("main");
  main.setAttribute("w3-include-html", page); */
/*   w3.includeHTML(); */
/* } */

function toggleDropdown() {
  let dropdown = document.querySelector(".dropdown-menu-container");
  dropdown.classList.toggle("d-none");
}

document.addEventListener("click", function (event) {
  const dropdownContainer = document.querySelector(".dropdown-menu-container");
  const profile = document.querySelector(".profile-ellipse");
  if (
    dropdownContainer &&
    !dropdownContainer.contains(event.target) &&
    !profile.contains(event.target)
  ) {
    dropdownContainer.classList.add("d-none");
  }
});

function loadProfile() {
  let initials = document.getElementById("profile-initials");
}
