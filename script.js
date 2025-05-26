const database =
  "https://join-461-default-rtdb.europe-west1.firebasedatabase.app/";

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

function stopEventPropagation(event) {
  event.stopPropagation();
}

/**
 * Function to force user to accept Privacy Policy
 *
 */
function checkInput() {
  let checkbox = document.getElementById("accept-policy");
  let button = document.querySelector(".signup-btn");
  if (!checkbox.checked) {
    button.setAttribute("disabled", "true");
  } else {
    button.removeAttribute("disabled");
  }
}

/**
 * Function to reset error-message on signup
 *
 * @param {number} x indicator which error to reset
 *                   1 = email 2||3 = password 
 */
function resetErrorMessage(x) {
  let passwordError = document.getElementById("password-error");
  let mailError = document.getElementById("email-error");
  switch (x) {
    case 1:
      mailError.classList.add("d-none");
      mailError.previousElementSibling.classList.remove("error-border");
      break;
    case 2:
    case 3:
      passwordError.classList.add("d-none");
      passwordError.previousElementSibling.classList.remove("error-border");
      break;
  }
}

/**
 * Function to validate users credentials after button submit
 * Prevent if email format is invalid or passwords don't match
 *
 * @param {Event} event event-object to stop page-reload after submit
 */
function signupFormValidation(event) {
  event.preventDefault(); /* preventDefault nur nutzen, wenn Validierungsfehler */
  const regex =/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  let userInput = document.getElementsByTagName("input");
  let mail = document.getElementById("email");
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
 * Function to make Password visible/unvisible for user
 * 
 * @param {HTMLElement}  x the clicked Icon element
 */
function showPassword(x) {
  let password = x.previousElementSibling
  if (password.type === "password" && password.value.length > 0 ){
    password.type = "text"
    x.setAttribute('class','pw-icon-on')
  } else {password.type = "password"
     x.setAttribute('class','pw-icon')
  }
}
   


/**
 * Function to create JSON-object (signup - user credential)
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
  console.log(userCredential);
}

/**
 * Function to send JSON to firebase-server
 *
 * @param {*} path storage path on firebase-server
 * @param {JSON} data user-credentials as JSON
 */
async function submitNewUser(path = "", data = {}) {
  let response = await fetch(database + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
