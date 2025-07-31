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
 * Returns an array alphabetically sorted by name.
 *
 * @async
 * @returns {Promise<Array<[string,Object]>>} A promise that resolves to an array of [id, contact] pairs sorted by name.
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
 * Shows add-new-contact overlay.
 *
 */
function showAddContactScreen() {
  blurBackground();
  openAddContactScreen();
}

/**
 * Blurs background of the main screen.
 *
 */
function blurBackground() {
  document.getElementById("bg-dimmed").classList.add("dim-active");
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
 * Sets a CSS property value of the add contact mobile button
 *
 * @param {string} property A CSS property
 */
function setVisibilityAddContactMobileBtn(property) {
  let mobileButtonRef = document.getElementById("add-new-contact-btn-mobile");
  mobileButtonRef.style.visibility = property;
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
 * Prefills all input fields of add contact form with current values stored on firebase server.
 *
 * @param {integer} indexContact
 */
async function prefillContactInputFields(indexContact) {
  prefillContactInputField("name", indexContact);
  prefillContactInputField("email", indexContact);
  prefillContactInputField("phone", indexContact);
}

/**
 * Prefills an input field of the add contact form with the respective current value stored on firebase server.
 *
 * @param {string} inputHtmlId Id of contact input html element
 * @param {string} attributeName Contact attribute name, either "name", "email" or "phone"
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
 * Gets the current contact attribute from firebase server
 *
 * @param {string} attribute Contact attribute either name, email or phone
 * @param {integer} indexContact
 * @returns Current contact attribute
 */
async function getCurrentContactAttribute(attribute, indexContact) {
  let contactId = contactsArray[indexContact][0];
  let path = "contacts/" + contactId + "/" + attribute;
  currentAttribute = await getDataBaseElement(path);
  return currentAttribute;
}

/**
 * Adds a new contact to the database.
 *
 */
async function addNewContact() {
  if (!regexValidation()) {
    return;
  }
  let newContactData = getContactInformation("add-contact-input-");
  await submitObjectToDatabase("contacts", newContactData);
  await renderContactsList();
  closeContactOverlays();
  removeFocusFromAllContacts();
  let addedContactIndex = getContactIndexByEmail(newContactData.email);
  showContactDetails(addedContactIndex);
  showToastMessage("contact-created-toast-msg");
}

/**
 * Returns contact index inside of contactsArray by contact email.
 *
 * @param {string} contactEmail
 * @returns {integer} index of contact with above email inside contactsArray
 */
function getContactIndexByEmail(contactEmail) {
  let index = contactsArray.findIndex(
    (contact) => contact[1].email === contactEmail
  );
  return index;
}

/**
 * Collects a new contact's information typed into the form.
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
 * Updates the current contact information on the firebase server
 *
 * @param {integer} indexContact
 */
async function updateContact(indexContact) {
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
 * Checks whether contact in contact list has a first letter predecessor. If the contact has a first letter predecessor there is no need for an additional contact list bookmark related to this contact
 *
 * @param {integer} indexContact
 * @returns {boolean} true if predecessor exists
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
 * Checks whether first characters of two strings are equal
 *
 * @param {string} char1 - first character
 * @param {string} char2 - second character
 * @returns {boolean} true if first letters are equal
 */
function firstLettersAreEqual(char1, char2) {
  if (char1.charAt(0).toLowerCase() == char2.charAt(0).toLowerCase()) {
    return true;
  }
  return false;
}

/**
 * Assigns a icon color to a contact
 *
 * @param {integer} indexContact
 * @returns {string}  CSS class with color property as string
 */
function getContactColorClassName(indexContact) {
  let index = indexContact % contactColorClasses.length;
  return contactColorClasses[index];
}

/**
 * Returns contact color class name by firebase server id
 *
 * @param {string} contactFirebaseId
 * @returns {string} name of CSS class
 */
function getContactColorClassNameByFirebaseId(contactFirebaseId) {
  if (!contactFirebaseId) {
    return "";
  } else {
    let indexContact = findContactIndexByFirebaseId(contactFirebaseId);
    let index = indexContact % contactColorClasses.length;
    return contactColorClasses[index];
  }
}

/**
 * Returns index of contact in contactsArray by contacts firebase Id
 *
 * @param {string} contactFirebaseId
 * @returns {integer} index of contact in contactsArray
 */
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
 * Deletes a contact from firebase server
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

/**
 * Deletes contact from all assigned tasks in board.
 *
 * @param {string} contactFirebaseId
 */
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

/**
 *
 * @param {string} contactFirebaseId
 * @returns {array} tupel of task Id and taks assigned to Id
 */
async function findTaskIdAssignedToIdTupels(contactFirebaseId) {
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
