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
  let contactScreenRef = document.getElementById(
    "add-contact-screen-show-switch"
  );
  contactScreenRef.classList.remove("d-none");
}

/**
 * This function closes any overlay at the contacts page.
 *
 */
function closeAddContactOverlay() {
  document.getElementById("bg-dimmed").classList.add("d-none");
  document
    .getElementById("add-contact-screen-show-switch")
    .classList.add("d-none");
  document
    .getElementById("edit-contact-screen-show-switch")
    .classList.add("d-none");
}

/**
 * This function is used to show the edit contact screen.
 *
 */
function showEditContactScreen() {
  blurBackground();
  openEditContactScreen();
}

/**
 * This function opend the edit contact screen.
 *
 */
function openEditContactScreen() {
  let contactScreenRef = document.getElementById(
    "edit-contact-screen-show-switch"
  );
  contactScreenRef.classList.remove("d-none");
}

/**
 * This function adds a new contact to the database.
 *
 */
function addNewContact() {
  let newContactData = getNewContactInformation();
  submitNewContact((path = ""), (contactData = newContactData));
}

/**
 * This function collects a new contact's information typed into the form.
 *
 */
function getNewContactInformation() {
  let nameRef = document.getElementById("add-contact-input-name");
  let emailRef = document.getElementById("add-contact-input-email");
  let phoneRef = document.getElementById("add-contact-input-phone");
  let contactData = {
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
  };
  clearAddContactForm();
  let contactDataJSON = JSON.stringify(contactData);
  // stringify contact Data to JSON
  return contactDataJSON;
}

/**
 * This function clears the add contact input form.
 *
 */
function clearAddContactForm() {
  let nameRef = document.getElementById("add-contact-input-name");
  let emailRef = document.getElementById("add-contact-input-email");
  let phoneRef = document.getElementById("add-contact-input-phone");
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

/**
 * This function uploads contact data to the firebase database.
 *
 * @param {string} path - storage path on firebase server
 * @param {JSON} contactData - contact data as JSON
 */
function submitNewContact(path = "", contactData = {}) {}
