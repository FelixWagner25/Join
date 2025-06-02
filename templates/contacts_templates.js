/**
 * This function retruns the contacts list contact tempate
 *
 * @param {string} contactKey
 * @returns - HMTL template of a contact item in contacts list.
 */
function getContactsListContactTemplate(contactKey) {
  return `
    <div class="contact-list-item-wrap">
        <div class="profile-badge bg-purple">${getFirstTowContactInitials(
          contactKey
        )}</div>
        <div class="contact-name-wrap">
            <div class="contact-name">${contacts[contactKey].name}</div>
            <div class="contact-email">${contacts[contactKey].email}</div>
        </div>
    </div>
  `;
}
