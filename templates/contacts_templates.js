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
                onclick="showEditContactScreen(${indexContact})"
                >
                <img
                    src="/assets/icons/edit.svg"
                    alt="edit pencil"
                    class="edit-contact-icon"
                />
                <span class="edit-contact-text">Edit</span>
                </div>
                <div class="contact-details-delete-contact" onclick="deleteContact(${indexContact})">
                <img
                    src="/assets/icons/delete.svg"
                    alt="delete trash bin"
                    class="delete-contact-icon"
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

function getEditContactScreenTemplate(indexContact) {
  return `
  <div class="add-contact-screen" onclick="stopEventPropagation(event)">
          <div
            class="close-icon-wrap d-flex-row-c-c"
            onclick="closeAddContactOverlay()"
          >
            <img src="/assets/icons/close.svg" alt="close" class="close-icon" />
          </div>
          <div class="add-contact-title-page">
            <img
              src="/assets/icons/join_icon.svg"
              alt="Join Logo"
              class="add-contacts-screen-logo mg-t-80px"
            />
            <div class="add-contacts-title-wrap">
              <div class="add-contacts-screen-title-text-wrap">
                <span class="add-contacts-screen-title-text">Edit contact</span>
              </div>
              <div class="add-contacts-title-page-hline"></div>
            </div>
          </div>
          <div class="mg-t-200px">
            <div class="${getContactColorClassName(
              indexContact
            )} contact-badge-wrap d-flex-row-c-c">
              <div class="font-sz-47px">${getFirstTowContactInitials(
                indexContact
              )}</div>
            </div>
          </div>
          <div class="add-contact-input-check mg-t-140px">
            <form class="add-contacts-form-wrap">
              <div class="add-contact-input-wrap">
                <input
                  type="text"
                  class="add-contact-input"
                  placeholder="Name"
                  id="input-name-${indexContact}"
                />
                <img
                  src="/assets/icons/person_icon.svg"
                  alt="person-icon"
                  class="add-contact-input-icon"
                />
              </div>
              <div class="add-contact-input-wrap">
                <input
                  type="text"
                  class="add-contact-input"
                  placeholder="Email"
                  id="input-email-${indexContact}"
                />
                <img
                  src="/assets/icons/mail_icon.svg"
                  alt="email-icon"
                  class="add-contact-input-icon"
                />
              </div>
              <div class="add-contact-input-wrap">
                <input
                  type="text"
                  class="add-contact-input"
                  placeholder="Phone"
                  id="input-phone-${indexContact}"
                />
                <img
                  src="/assets/icons/call.svg"
                  alt="call icon"
                  class="add contact-input-icon"
                />
              </div>
            </form>
            <div class="add-contact-btns-wrap">
              <button class="add-contact-btn-cancel" onclick="deleteContact(${indexContact})">
                <span>Delete</span>
              </button>
              <button class="add-contact-btn">
                <span>Save</span>
                <img
                  src="/assets/icons/check_withoutBorder.svg"
                  alt="check"
                  class="add-contact-btn-icon-check"
                />
              </button>
            </div>
          </div>
        </div>
  `;
}
