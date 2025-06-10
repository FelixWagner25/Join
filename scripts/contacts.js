let contactColorClasses = [
  "bg-orange",
  "bg-purple",
  "bg-pink",
  "bg-darkpurple",
  "bg-turqoise",
  "bg-green",
  "bg-lightred",
  "bg-lightorange",
  "bg-lightpink",
  "bg-gold",
  "bg-royalblue",
  "bg-neon",
  "bg-yellow",
  "bg-red",
  "bg-sand",
];

let overlayTransitionMiliSeconds = 250;

/**
 * Function to initialize contacts object with database entries
 *
 */
async function initContacs() {
  contactsArray = await getSortedContactsArray();
  await renderContactsList();
}

/**
 * This function returns an alphabetically by name sorted array from contacts object input.
 *
 * @returns - array with alphabetically by name sorted contacts from firebase server
 */
async function getSortedContactsArray() {
  let contacts = {};
  let contactsArray = [];
  contacts = await getDataBaseElement("contacts");
  contactsArray = Object.entries(contacts);
  contactsArray.sort((idValuePairA, idValuePairB) => {
    const nameA = idValuePairA[1].name.toLowerCase();
    const nameB = idValuePairB[1].name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  return contactsArray;
}

/**
 * This function is used to show the add contact input screen.
 *
 */
function showAddContactScreen() {
  blurBackground();
  setTimeout(() => {
    openAddContactScreen();
  }, overlayTransitionMiliSeconds);
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
  contactScreenRef.classList.add("overlay-open");
}

/**
 * This function closes any overlay at the contacts page.
 *
 */
function closeContactOverlays() {
  document
    .getElementById("add-contact-screen")
    .classList.remove("overlay-open");
  document
    .getElementById("edit-contact-screen")
    .classList.remove("overlay-open");
  setTimeout(() => {
    document.getElementById("bg-dimmed").classList.add("d-none");
  }, overlayTransitionMiliSeconds);
}

/**
 * This function is used to show the edit contact screen.
 *
 */
function showEditContactScreen(indexContact) {
  blurBackground();
  setTimeout(() => {
    openEditContactScreen();
  }, overlayTransitionMiliSeconds);
  renderEditContactScreen(indexContact);
  prefillContactInputFields(indexContact);
}

/**
 * This function opend the edit contact screen.
 *
 */
function openEditContactScreen() {
  let contactScreenRef = document.getElementById("edit-contact-screen");
  contactScreenRef.classList.add("overlay-open");
}

/**
 * This function renders the edit contact overlay screen.
 *
 * @param {integer} indexContact
 */
function renderEditContactScreen(indexContact) {
  let editContactScreenRef = document.getElementById("edit-contact-screen");
  editContactScreenRef.innerHTML = "";
  editContactScreenRef.innerHTML = getEditContactScreenTemplate(indexContact);
}

/**
 * This function prefills all input fields of add contact form with current values stored on firebase server.
 *
 * @param {integer} indexContact
 */
async function prefillContactInputFields(indexContact) {
  prefillContactInputField("name", indexContact);
  prefillContactInputField("email", indexContact);
  prefillContactInputField("phone", indexContact);
}

/**
 * This function prefills an input field of the add contact form with the respective current value stored on firebase server.
 *
 * @param {string} inputHtmlId - id of contact input html element
 * @param {string} attributeName - contact attribute name, either "name", "email" or "phone"
 * @param {integer} indexContact
 */
async function prefillContactInputField(attributeName, indexContact) {
  let inputHtmlId = "input-" + String(indexContact) + "-" + attributeName;
  let inputFieldRef = document.getElementById(inputHtmlId);
  inputFieldRef.value = await getCurrentContactAttribute(
    attributeName,
    indexContact
  );
}

/**
 * This function gets the current contact attribute from firebase server
 *
 * @param {string} attribute - contact attribute either name, email or phone
 * @param {integer} indexContact
 * @returns - current contact attribute
 */
async function getCurrentContactAttribute(attribute, indexContact) {
  let contactId = contactsArray[indexContact][0];
  let path = "contacts/" + contactId + "/" + attribute;
  currentAttribute = await getDataBaseElement(path);
  return currentAttribute;
}

/**
 * This function adds a new contact to the database.
 *
 */
async function addNewContact() {
  let newContactData = getContactInformation("add-contact-input-");
  await submitNewContact("contacts", newContactData);
  await renderContactsList();
  closeContactOverlays();
}

/**
 * This function collects a new contact's information typed into the form.
 *
 */
function getContactInformation(htmlIdPrefix) {
  let nameRef = document.getElementById(htmlIdPrefix + "name");
  let emailRef = document.getElementById(htmlIdPrefix + "email");
  let phoneRef = document.getElementById(htmlIdPrefix + "phone");
  let contactData = {
    name: nameRef.value,
    email: emailRef.value,
    phone: phoneRef.value,
  };
  clearAddContactForm(htmlIdPrefix);
  return contactData;
}

/**
 * This function clears the add contact input form.
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
 * This function uploads contact data to the firebase database.
 *
 * @param {string} path - storage path on firebase server
 * @param {object} contactData - contact data as JS object
 * @typedef {Object} contactData
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 */
async function submitNewContact(path = "", contactData = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}

/**
 * This function updates the current contact information on the firebase server
 *
 * @param {integer} indexContact
 */
async function updateContact(indexContact) {
  let htmlIdPrefix = "input-" + String(indexContact) + "-";
  let editedContactData = getContactInformation(htmlIdPrefix);
  let contactPath = "contacts/" + contactsArray[indexContact][0];
  await submitUpdateContact(contactPath, editedContactData);
  await renderContactsList();
  renderContactDetails(indexContact);
  closeContactOverlays();
}

/**
 * This function updates the attributes of existing contacts on firebase server.
 *
 * @param {string} path
 * @param {object} contactData
 */
async function submitUpdateContact(path = "", contactData = {}) {
  let response = await fetch(database + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(contactData),
  });
}

/**
 * This function renders the contacts list
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
 * This function extracts the first two initials of a contact name
 *
 * @param {integer} indexContact
 * @returns - first two contact initials
 */
function getFirstTowContactInitials(indexContact) {
  let contactNameSplit = contactsArray[indexContact][1].name.split(" ");
  let contactInitials = "";
  if (contactNameSplit.length == 1) {
    contactInitials = contactNameSplit[0].charAt(0).toUpperCase();
  } else {
    contactInitials =
      contactNameSplit[0].charAt(0).toUpperCase() +
      contactNameSplit[1].charAt(0).toUpperCase();
  }
  return contactInitials;
}

/**
 * This function checks whether contact in contact list has a first letter predecessor. If the contact has a first letter predecessor there is no need for an additional contact list bookmark related to this contact
 *
 * @param {integer} indexContact
 * @returns
 */
function contactHasFirstLetterPredecessor(indexContact) {
  if (indexContact == 0) {
    return false;
  } else if (
    firstLettersAreEqual(
      contactsArray[indexContact][1].name,
      contactsArray[indexContact - 1][1].name
    )
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * Function that checks whether first characters of two strings are equal
 *
 * @param {string} char1 - first character
 * @param {string} char2 - second character
 * @returns
 */
function firstLettersAreEqual(char1, char2) {
  if (char1.charAt(0).toLowerCase() == char2.charAt(0).toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * This function assigns a icon color to a contact
 *
 * @param {integer} indexContact
 * @returns - CSS class with color property as string
 */
function getContactColorClassName(indexContact) {
  let index = indexContact % contactColorClasses.length;
  return contactColorClasses[index];
}

/**
 * This function deletes a contact from firebase server
 *
 * @param {integer} indexContact
 */
async function deleteContact(indexContact) {
  let contactId = contactsArray[indexContact][0];
  let path = "contacts/" + contactId;
  responseMessage = await deleteDataBaseElement(path);
  clearContactDetails();
  await renderContactsList();
  closeContactOverlays();
}

/**
 * This function renders the details section of a contact
 *
 * @param {integer} indexContact
 */
function renderContactDetails(indexContact) {
  let contactDetailsRef = document.getElementById("contact-details");
  clearContactDetails();
  contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
  contactDetailsRef.classList.remove("contact-details-animate-in");
  void contactDetailsRef.offsetWidth;
  contactDetailsRef.classList.add("contact-details-animate-in");
}

/**
 * This function clears the contact details panel
 */
function clearContactDetails() {
  document.getElementById("contact-details").innerHTML = "";
}

/**
 * This function shows a contacts details.
 *
 * @param {integer} indexContact
 */
function showContactDetails(indexContact) {
  removeFocusFromAllContacts();
  addFocusToContact(indexContact);
  renderContactDetails(indexContact);
}

/**
 * This function removes the focus class from all contact list entries
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
 * This function adds the focus to the selected contact list entry.
 *
 * @param {integer} indexContact
 */
function addFocusToContact(indexContact) {
  let elementId = "contacts-list-" + String(indexContact);
  document.getElementById(elementId).classList.add("focus");
}
