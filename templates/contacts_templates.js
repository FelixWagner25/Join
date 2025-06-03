/**
 * This function retruns the contacts list contact tempate
 *
 * @param {integer} indexContact
 * @returns - HMTL template of a contact item in contacts list.
 */
function getContactsListContactTemplate(indexContact) {
  return `
    <div class="contact-list-item-wrap">
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
