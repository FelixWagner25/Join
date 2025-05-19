/**
 * This function is used to show the add contact input screen.
 *
 */
function showAddContactScreen() {
  blurBackground();
  openAddContactScreen();
}

/**
 * This function blurs the background of the main screen.
 *
 */
function blurBackground() {
  document.getElementById("bg-dimmed").classList.remove("d-none");
}

/**
 * This function opens the add contact input screen.
 *
 */
function openAddContactScreen() {
  let contactScreenRef = document.getElementById("add-contact-screen");
  contactScreenRef.classList.remove("d-none");
  contactScreenRef.classList.add("d-flex");
}

/**
 * This function closes any overlay at the contacts page.
 *
 */
function closeOverlay() {
  document.getElementById("bg-dimmed").classList.add("d-none");
}
