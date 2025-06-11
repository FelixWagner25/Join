const database =
  "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = {};

/**
 * Function to log in as guest
 *
 */
function guestLogin() {
  location.href = "/templates/desktop_template.html";
}

/**
 * Function to forward user to signup page
 *
 */
function signupPage() {
  location.href = "assets/html/signup.html";
}

/**
 * This function prevents event propagation.
 *
 * @param {Event} event - event object to stop event propagation
 */
function stopEventPropagation(event) {
  event.stopPropagation();
}

/**
 * Function to check the state of all required input fields and the acceptance checkbox.
 *
 */
function checkInput() {
  let checkbox = document.getElementById("accept-policy");
  let requiredInputs = document.querySelectorAll('input')
  let button = document.querySelector(".signup-btn");
  if ([...requiredInputs].every((input) => input.value !== "") && checkbox.checked) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", "true");
  }
}

/**
 * Function to reset error-messages on login & signup page
 *
 *
 */
function resetErrorMessage() {
  let error = document.getElementsByTagName("input");
  let message = document.getElementsByClassName("validation");
  [...error].forEach((element) => {
    element.parentElement.classList.remove("error-border");
  });
  [...message].forEach((message) => {
    message.classList.add("d-none");
  });
}

/**
 * Function to validate users credentials after button submit
 * Prevent if email format is invalid or passwords don't match
 *
 * @param {Event} event event-object to stop page-reload after submit
 */
function signupFormValidation(event) {
  event.preventDefault(); /* preventDefault nur nutzen, wenn Validierungsfehler */
  const regex =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  let userInput = document.getElementsByTagName("input");
  let mail = document.getElementById("add-contact-input-email");
  let passwordError = document.getElementById("password-error");
  let mailError = document.getElementById("email-error");
  if (userInput[2].value !== userInput[3].value) {
    passwordError.classList.remove("d-none");
    passwordError.previousElementSibling.classList.add("error-border");
  } else if (!regex.test(mail.value)) {
    mailError.classList.remove("d-none");
    mailError.previousElementSibling.classList.add("error-border");
  } else {
    getNewUserInformation();
  }
}

/**
 * Function to trigger Password visible/unvisible for user
 *
 * @param {HTMLElement}  x the clicked Icon element
 */
function showPassword(x) {
  let password = x.previousElementSibling;
  if (password.type === "password" && password.value.length > 0) {
    password.type = "text";
    x.setAttribute("class", "pw-icon-on");
  } else {
    password.type = "password";
    x.setAttribute("class", "pw-icon");
  }
}

/**
 * Function to create JSON-object (signup - user credential), if checkMailRedundancy is false
 *
 */
function getNewUserInformation() {
  let userInput = document.getElementsByTagName("input");
  let userCredential = {};
  for (let index = 0; index < userInput.length; index++) {
    let key = userInput[index].name;
    let value = userInput[index].value;
    userCredential[key] = value;
  }
  checkMailRedundancy(userCredential);
}

/**
 * This function validates, if the mail during sign-up-process is already used in the database
 *
 * @param {object} credentials the sign-up credentials
 */
async function checkMailRedundancy(credentials) {
  let mailError = document.getElementById("email-redundancy-error");
  let response = await fetch(database + "/user" + ".json");
  let responseRef = await response.json();
  if (responseRef === null) {
    postJSON("user", credentials);
    showMessage(credentials);
    return;
  }
  let mailValue = Object.values(responseRef);
  let newMail = mailValue.map((i) => {
    return i.email;
  });
  if (!newMail.includes(credentials.email)) {
    postJSON("user", credentials);
    showMessage(credentials);
  } else {
    mailError.classList.remove("d-none");
    mailError.previousElementSibling.classList.add("error-border");
  }
}

/**
 * This Function gives the User feedback, if signup was successful.
 * Also triggers to add a new contact
 *
 * @param {object} credentials object to
 */
function showMessage(credentials) {
  addNewContactOnSignup(credentials);
  let messageBox = document.querySelector(".signup-message");
  let newBlur = document.querySelector(".background-fade");
  let signup = document.querySelector(".signup");
  messageBox.classList.remove("d-none");
  messageBox.classList.add("d-flex-row-c-c");
  newBlur.style.backgroundColor = "rgb(0, 0, 0, 0.10)";
  signup.style.zIndex = "-1";
  setTimeout(() => {
    location.href = "/index.html";
  }, 1800);
}

/**
 * This function creates a contact-object from users signup and posts it into /contacts-path
 *
 * @param {object} contactData dedicated information for contact-list
 */
function addNewContactOnSignup(contactData) {
  let contactObj = {};
  contactObj = {
    email: contactData.email,
    name: contactData.name,
    phone: "",
  };
  postJSON("contacts", contactObj);
}

/**
 * Function to send JSON to firebase-server
 *
 * @param {*} path storage path on firebase-server
 * @param {JSON} data any object as JSON for database
 */
async function postJSON(path = "", data = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

/**
 * This function gets all users-credentials from database and triggers credential-check-function
 *
 * @param {string} path path of the database
 */
async function userLogin(path = "user") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseRef = await response.json();
  checkLogInCredentials(responseRef);
}

/**
 * This function checks, if login-credentials are valid to credentials from database
 *
 * @param {object} responseRef all user credentials from the database
 */
function checkLogInCredentials(responseRef) {
  let x = Object.values(responseRef);
  let loginError = document.getElementById("password-error");
  let loginInput = document.getElementsByTagName("input");
  let credentialsMerge = x.map((i) => {
    return i.email + i.password;
  });
  if (credentialsMerge.includes(loginInput[0].value + loginInput[1].value)) {
    location.href = "/templates/desktop_template.html";
  } else {
    loginError.classList.remove("d-none");
    [...loginInput].forEach((input) => {
      input.parentElement.classList.add("error-border");
    });
  }
}

/**
 * Function to get database element from firebase server as JSON
 *
 * @param {string} path
 * @returns - database element as JSON
 */
async function getDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  let responseJSON = await response.json();
  return responseJSON;
}

/**
 * This function delets an element form firebase server and collects the response as JSON
 *
 * @param {string} path
 * @returns
 */
async function deleteDataBaseElement(path = "") {
  let response = await fetch(database + path + ".json", {
    method: "DELETE",
  });
  let responseJSON = await response.json();
  return responseJSON;
}
