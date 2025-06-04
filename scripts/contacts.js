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

/**
 * Function to initialize contacts object with database entries
 *
 */
async function initContacs() {
  contactsArray = await getSortedContactsArray();
  await renderContactsList();
}

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
async function addNewContact() {
  let newContactData = getNewContactInformation();
  submitNewContact("contacts", newContactData);
  await renderContactsList();
  closeAddContactOverlay();
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
  return contactData;
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
  responseMessage = deleteDataBaseElement(path);
  clearContactDetails();
  await renderContactsList();
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
}

/**
 * This function clears the contact details panel
 */
function clearContactDetails() {
  document.getElementById("contact-details").innerHTML = "";
}

function showContactDetails(indexContact) {
  removeFocusFromAllContacts();
  addFocusToContact(indexContact);
  renderContactDetails(indexContact);
}

function removeFocusFromAllContacts() {
  contactsListTagsRef = document.getElementsByClassName(
    "contact-list-item-wrap"
  );
  for (let i = 0; i < contactsListTagsRef.length; i++) {
    contactsListTagsRef[i].classList.remove("focus");
  }
}

function addFocusToContact(indexContact) {
  let elementId = "contacts-list-" + String(indexContact);
  document.getElementById(elementId).classList.add("focus");
}
