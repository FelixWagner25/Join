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
