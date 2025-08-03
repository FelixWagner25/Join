/**
 * Renders contact details for mobile screen widths
 *
 * @param {integer} indexContact
 */
function renderContactDetailsMobileWindow(indexContact) {
  let contactDetailsRef = document.getElementById("contact-details-mobile");
  document.getElementById("contacts-list-wrap").style.display = "none";
  contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
  document.getElementById("back-to-contacts-list-btn").style.display = "block";
  document.getElementById("contact-details-mobile-wrap").style.display =
    "block";
  document.getElementById("add-new-contact-btn-mobile").style.display = "none";
  document.getElementById("edit-contact-btn-mobile").style.display = "flex";
  renderContactDetailsMobileMenu(indexContact);
}

/**
 * Renders contact details mobile menu
 *
 * @param {integer} indexContact
 */
function renderContactDetailsMobileMenu(indexContact) {
  mobileMenuRef = document.getElementById("contact-details-mobile-menu");
  mobileMenuRef.innerHTML = "";
  mobileMenuRef.innerHTML = getContactDetailsMobileMenuTemplate(indexContact);
}

/**
 * Closes contact details mobile overlay and returns users view back to contacts list
 *
 */
function backToContactsList() {
  document.getElementById("contacts-list-wrap").style.display = "flex";
  document.getElementById("back-to-contacts-list-btn").style.display = "none";
  document.getElementById("contact-details-mobile-wrap").style.display = "none";
  document.getElementById("add-new-contact-btn-mobile").style.display = "flex";
  document.getElementById("edit-contact-btn-mobile").style.display = "none";
}

/**
 * Shows contact details mobile menu
 */
function showContactDetailsMobileMenu() {
  document.getElementById("contact-details-mobile-menu").style.display =
    "block";
}

/**
 * Closes contact details mobile Menu
 */
function closeContactDetailsMobileMenu() {
  document.getElementById("contact-details-mobile-menu").style.display = "none";
}
