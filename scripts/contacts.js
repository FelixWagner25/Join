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

let databasee =
  "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Function to initialize contacts object with database entries
 *
 */
async function initContacs() {
  contactsArray = await getSortedContactsArray();
  tasksArray = await getTasksArray();
  await renderContactsList();
}

/**
 * This function returns an alphabetically by name sorted array from contacts object input.
 *
 * @returns - array with alphabetically by name sorted contacts from firebase server
 */
async function getSortedContactsArray() {
  let contacts = await getDataBaseElement("contacts");
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
  console.log(document.getElementById("contact-card"));
}

/**
 * This function blurs the background of the main screen.
 *
 */
function blurBackground() {
  document.getElementById("bg-dimmed").classList.add("dim-active");
}

/**
 * This function opens the add contact input screen.
 *
 */
function openAddContactScreen() {
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.add("overlay-open");
  contactScreenRef.innerHTML = "";
  contactScreenRef.innerHTML = getAddContactsScreenTemplate();
  setVisibilityAddContactMobileBtn("hidden");
}

function setVisibilityAddContactMobileBtn(property) {
  let mobileButtonRef = document.getElementById("add-new-contact-btn-mobile");
  mobileButtonRef.style.visibility = property;
}

/**
 * This function closes any overlay at the contacts page.
 *
 */
function closeContactOverlays() {
  document.getElementById("contact-card").classList.remove("overlay-open");
  document.getElementById("bg-dimmed").classList.remove("dim-active");
  setVisibilityAddContactMobileBtn("visible");
}

/**
 * This function is used to show the edit contact screen.
 *
 */
function showEditContactScreen(indexContact) {
  blurBackground();
  openEditContactScreen();
  renderEditContactScreen(indexContact);
  prefillContactInputFields(indexContact);
}

/**
 * This function opend the edit contact screen.
 *
 */
function openEditContactScreen() {
  let contactScreenRef = document.getElementById("contact-card");
  contactScreenRef.classList.add("overlay-open");
}

/**
 * This function renders the edit contact overlay screen.
 *
 * @param {integer} indexContact
 */
function renderEditContactScreen(indexContact) {
  let editContactScreenRef = document.getElementById("contact-card");
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
async function addNewContact(event) {
  event.preventDefault();
  if (!regexValidation()) {
    return;
  }
  let newContactData = getContactInformation("add-contact-input-");
  await submitObjectToDatabase("contacts", newContactData);
  await renderContactsList();
  closeContactOverlays();
  removeFocusFromAllContacts();
  let addedContactEmail = newContactData.email;
  let addedContactIndex = getContactIndexByEmail(addedContactEmail);
  showContactDetails(addedContactIndex);
  showToastMessage("contact-created-toast-msg");
}

function getContactIndexByEmail(contactEmail) {
  let index = contactsArray.findIndex(
    (contact) => contact[1].email === contactEmail
  );
  return index;
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
 * This function updates the current contact information on the firebase server
 *
 * @param {integer} indexContact
 */
async function updateContact(indexContact, event) {
  event.preventDefault();
  if (!regexValidation()) {
    return;
  }
  let htmlIdPrefix = "input-" + String(indexContact) + "-";
  let editedContactData = getContactInformation(htmlIdPrefix);
  let contactPath = "contacts/" + contactsArray[indexContact][0];
  await updateDatabaseObject(contactPath, editedContactData);
  await renderContactsList();
  renderContactDetails(indexContact);
  closeContactOverlays();
  showToastMessage("contact-updated-toast-msg");
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

function getContactColorClassNameByFirebaseId(contactFirebaseId) {
  if (!contactFirebaseId) {
    return "";
  } else {
    let indexContact = findContactIndexByFirebaseId(contactFirebaseId);
    let index = indexContact % contactColorClasses.length;
    return contactColorClasses[index];
  }
}

function findContactIndexByFirebaseId(contactFirebaseId) {
  if (!contactFirebaseId) {
    return "";
  } else {
    return contactsArray.findIndex(
      (contactEntry) => contactEntry[0] === contactFirebaseId
    );
  }
}

/**
 * This function deletes a contact from firebase server
 *
 * @param {integer} indexContact
 */
async function deleteContact(indexContact) {
  let contactId = contactsArray[indexContact][0];
  await deleteContactFromTasks(contactId);
  let path = "contacts/" + contactId;
  responseMessage = await deleteDataBaseElement(path);
  clearContactDetails();
  await renderContactsList();
  closeContactOverlays();
  showToastMessage("delete-contact-toast-msg");
}

async function deleteContactFromTasks(contactFirebaseId) {
  let taskIdassignedToIdTupels = await findTaskIdAssignedToIdTupels(
    contactFirebaseId
  );
  for (let indexId = 0; indexId < taskIdassignedToIdTupels.length; indexId++) {
    let path =
      "/tasks/" +
      taskIdassignedToIdTupels[indexId].taskId +
      "/assignedTo/" +
      taskIdassignedToIdTupels[indexId].assignedToId;
    await deleteDataBaseElement(path);
  }
  tasksArray = await getTasksArray();
}

async function findTaskIdAssignedToIdTupels(contactFirebaseId) {
  console.log(tasksArray);
  tasksArray = await getTasksArray();
  let taskIdassignedToIdTupels = [];
  for (let indexTask = 0; indexTask < tasksArray.length; indexTask++) {
    let taskFirebaseId = tasksArray[indexTask][0];
    let taskValueObj = tasksArray[indexTask][1];
    if (!taskValueObj.assignedTo) continue;
    let assignedToObj = Object.fromEntries(taskValueObj.assignedTo);
    for (let assignedToId in assignedToObj) {
      let contactObj = assignedToObj[assignedToId];
      if (contactObj?.Id === contactFirebaseId) {
        taskIdassignedToIdTupels.push({
          taskId: taskFirebaseId,
          assignedToId: assignedToId,
        });
      }
    }
  }
  return taskIdassignedToIdTupels;
}

/**
 * This function renders the details section of a contact
 *
 * @param {integer} indexContact
 */
function renderContactDetails(indexContact) {
  clearContactDetails();
  let contactDetailsRef;
  if (window.innerWidth < 1260) {
    contactDetailsRef = document.getElementById("contact-details-mobile");
    document.getElementById("contacts-list-wrap").style.display = "none";
    contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
    document.getElementById("back-to-contacts-list-btn").style.display =
      "block";
    document.getElementById("contact-details-mobile-wrap").style.display =
      "block";
  } else {
    contactDetailsRef = document.getElementById("contact-details");
    contactDetailsRef.innerHTML = getContactDetailsTemplate(indexContact);
    contactDetailsRef.classList.remove("contact-details-animate-in");
    void contactDetailsRef.offsetWidth;
    contactDetailsRef.classList.add("contact-details-animate-in");
  }
}

/**
 * This function clears the contact details panel
 */
function clearContactDetails() {
  document.getElementById("contact-details").innerHTML = "";
  document.getElementById("contact-details-mobile").innerHTML = "";
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

function backToContactsList() {
  document.getElementById("contacts-list-wrap").style.display = "flex";
  document.getElementById("back-to-contacts-list-btn").style.display = "none";
  document.getElementById("contact-details-mobile-wrap").style.display = "none";
}
