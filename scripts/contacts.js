/**
 * Initializes contacts object with database entries
 *
 * @returns {Promise<void>} A promise that resolves when contacts and task array are initialised completely.
 */
async function initContacs() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderContactsList();
}

/**
 * Shows add-new-contact overlay.
 *
 */
function showAddContactScreen() {
  blurBackground();
  openAddContactScreen();
}

/**
 * Opens add-contact input screen.
 *
 */
function openAddContactScreen() {
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.add("overlay-open");
  contactScreenRef.innerHTML = "";
  contactScreenRef.innerHTML = getAddContactsScreenTemplate();
  setVisibilityAddContactMobileBtn("hidden");
}

/**
 * Closes any overlay at the contacts page.
 *
 */
function closeContactOverlays() {
  document.getElementById("contact-card").classList.remove("overlay-open");
  document.getElementById("bg-dimmed").classList.remove("dim-active");
  setVisibilityAddContactMobileBtn("visible");
}

/**
 * Shows the edit contact screen.
 *
 */
function showEditContactScreen(indexContact) {
  blurBackground();
  openEditContactScreen();
  renderEditContactScreen(indexContact);
  prefillContactInputFields(indexContact);
}

/**
 * Opens the edit contact screen.
 *
 */
function openEditContactScreen() {
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.add("overlay-open");
}

/**
 * Renders the edit contact overlay screen.
 *
 * @param {integer} indexContact
 */
function renderEditContactScreen(indexContact) {
  let editContactScreenRef = document.getElementById("contact-card");
  editContactScreenRef.innerHTML = "";
  editContactScreenRef.innerHTML = getEditContactScreenTemplate(indexContact);
}

/**
 * Clears the add contact input form.
 *
 */
function clearAddContactForm(htmlIdPrefix) {
  let nameRef = document.getElementById(htmlIdPrefix + "name");
  let emailRef = document.getElementById(htmlIdPrefix + "email");
  let phoneRef = document.getElementById(htmlIdPrefix + "phone");
  nameRef.value = "";
  emailRef.value = "";
  phoneRef.value = "";
}

/**
 * Renders the contacts list
 *
 */
async function renderContactsList() {
  contactsArray = await getSortedContactsArray();
  let contactsListRef = document.getElementById("contacts-list");
  contactsListRef.innerHTML = "";
  for (let i = 0; i < contactsArray.length; i++) {
    if (contactHasFirstLetterPredecessor(i)) {
      contactsListRef.innerHTML += getContactsListContactTemplate(i);
    } else {
      contactsListRef.innerHTML += getContactListBookmarkTemplate(i);
      contactsListRef.innerHTML += getContactsListContactTemplate(i);
    }
  }
}

/**
 * Renders the details section of a contact
 *
 * @param {integer} indexContact
 */
function renderContactDetails(indexContact) {
  clearContactDetails();
  if (window.innerWidth < 1260) {
    renderContactDetailsMobileWindow(indexContact);
  } else {
    renderContactDetailsDesktopWindow(indexContact);
  }
}

/**
 * Renders contact details for desktop screen widths
 *
 * @param {integer} indexContact
 */
function renderContactDetailsDesktopWindow(indexContact) {
  let contactDetailsRef = document.getElementById("contact-details");
  contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
  contactDetailsRef.classList.remove("contact-details-animate-in");
  void contactDetailsRef.offsetWidth;
  contactDetailsRef.classList.add("contact-details-animate-in");
}

/**
 * Clears the contact details panel
 */
function clearContactDetails() {
  document.getElementById("contact-details").innerHTML = "";
  document.getElementById("contact-details-mobile").innerHTML = "";
}

/**
 * Shows a contacts details.
 *
 * @param {integer} indexContact
 */
function showContactDetails(indexContact) {
  removeFocusFromAllContacts();
  addFocusToContact(indexContact);
  renderContactDetails(indexContact);
}

/**
 * Removes the focus class from all contact list entries
 */
function removeFocusFromAllContacts() {
  contactsListTagsRef = document.getElementsByClassName(
    "contact-list-item-wrap"
  );
  for (let i = 0; i < contactsListTagsRef.length; i++) {
    contactsListTagsRef[i].classList.remove("focus");
  }
}

/**
 * Adds the focus to the selected contact list entry.
 *
 * @param {integer} indexContact
 */
function addFocusToContact(indexContact) {
  let elementId = "contacts-list-" + String(indexContact);
  document.getElementById(elementId).classList.add("focus");
}
