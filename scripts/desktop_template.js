/**
 * Function to load summary.html on initiation
 *
 */
async function init() {
  w3.includeHTML(() => {
    userInitials(), setBackgroundColor();
  });
}

function toggleDropdown() {
  let dropdown = document.querySelector(".dropdown-menu-container");
  dropdown.classList.toggle("d-none");
}

document.addEventListener("click", function (event) {
  const dropdownWrap = document.querySelector(".dropdown-menu-container");
  const profileBadge = document.querySelector(".profile-ellipse");
  if (
    dropdownWrap &&
    !dropdownWrap.contains(event.target) &&
    !profileBadge.contains(event.target)
  ) {
    dropdownWrap.classList.add("d-none");
  }
});

function userInitials() {
  let initials = document.getElementById("profile-initials");
  let sessionInititals = sessionStorage.getItem("initials") || "G";
  checkLoginStatus();
  initials.innerHTML = sessionInititals;
}

function checkLoginStatus() {
  let previousLink = document.referrer;
  let visitor = sessionStorage.getItem("user");
  let navLinks = document.querySelectorAll(".nav-link");
  let profile = document.querySelector(".header-user");
  if (visitor == null) {
    profile.classList.add("d-none");
    for (let i = 0; i <= 3; i++) {
      navLinks[i].classList.add("d-none");
    }
    navLinks[4].classList.remove("d-none");
  }
  checkWorkaround(previousLink, visitor);
}

function checkWorkaround(previousLink, visitor) {
  if (visitor == null && !previousLink) {
    location.href = "/index.html";
  }
}

function setBackgroundColor() {
  let activePage = window.location.pathname;
  let links = document.getElementsByClassName("nav-link");
  let activeLink = [...links].filter((l) => l.href.includes(activePage));
  [...links].forEach((e) => e.classList.remove("active"));
  activeLink.forEach((e) => e.classList.add("active"));
}

function deleteSessionStorage() {
  sessionStorage.clear();
}
