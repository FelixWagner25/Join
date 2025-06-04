/**
 * This function retruns the contacts list contact tempate
 *
 * @param {integer} indexContact
 * @returns - HMTL template of a contact item in contacts list.
 */
function getContactsListContactTemplate(indexContact) {
  return `
    <div class="contact-list-item-wrap" onclick="showContactDetails(${indexContact})" id="contacts-list-${indexContact}">
        <div class="profile-badge ${getContactColorClassName(
          indexContact
        )}">${getFirstTowContactInitials(indexContact)}</div>
        <div class="contact-name-wrap">
            <div class="contact-name">${
              contactsArray[indexContact][1].name
            }</div>
            <div class="contact-email">${
              contactsArray[indexContact][1].email
            }</div>
        </div>
    </div>
  `;
}

function getContactListBookmarkTemplate(indexContact) {
  return `
    <div class="bookmark-wrap">
          <div class="bookmark-letter">${contactsArray[indexContact][1].name
            .charAt(0)
            .toUpperCase()}</div>
    </div>
    <div class="bookmark-separator"></div>
    `;
}

function getContactDetailsTemplate(indexContact) {
  return `
    <div class="contact-details-icon-edit-name-wrap">
        <div class="${getContactColorClassName(
          indexContact
        )} contact-details-name-icon">${getFirstTowContactInitials(
    indexContact
  )}</div>
            <div class="contact-details-name-wrap">
            <div class="contact-details-name">${
              contactsArray[indexContact][1].name
            }</div>
            <div class="contract-details-edit-delete-wrap">
                <div
                class="contact-details-edit-contact"
                onclick="showEditContactScreen()"
                >
                <img
                    src="/assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </div>
                <div class="contact-details-delete-contact">
                <img
                    src="/assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
                    onclick="deleteContact(${indexContact})"
                />
                <span class="edit-contact-text">Delete</span>
                </div>
            </div>
            </div>
        </div>
        <div class="contact-information-text">Contact Information</div>
        <div class="contact-details-email-phone-wrap">
            <div class="contact-details-email-wrap">
            <span class="contact-details-category">Email</span>
            <span class="contact-email">${
              contactsArray[indexContact][1].email
            }</span>
            </div>
            <div class="contact-details-email-wrap">
            <span class="contact-details-category">Phone</span>
            <span class="contact-details-phone">${
              contactsArray[indexContact][1].phone
            }</span>
            </div>
        </div>
    </div>
  `;
}
