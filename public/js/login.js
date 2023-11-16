const phoneNumberForm = document.getElementById('phone-number-form');
const phoneNumberInput = document.getElementById('phone-number-input');
const phoneCountryCodeInput = document.getElementById('phone-country-code-select');
const phoneNumberSubmitButton = document.getElementById('phone-number-submit-button');

const phoneCodeForm = document.getElementById('phone-code-form');
const phoneCodeInput = document.getElementById('phone-code-input');
const phoneCodeSubmitButton = document.getElementById('phone-code-submit-button');
const phoneNumberLabel = document.getElementById('phone-number-label');

const nameForm = document.getElementById('name-form');
const firstNameInput = document.getElementById('first-name-input');
const lastNameInput = document.getElementById('last-name-input');
const nameSubmitButton = document.getElementById('name-submit-button');

phoneNumberForm.onsubmit = onPhoneNumberFormSubmit;
phoneNumberInput.oninput = onPhoneNumberInput;

phoneCodeForm.onsubmit = onPhoneCodeFormSubmit;
phoneCodeInput.oninput = onPhoneCodeInput;

nameForm.onsubmit = onNameFormSubmit;
firstNameInput.oninput = onNameInput;
lastNameInput.oninput = onNameInput;

setFormContainerHeight();

// Validate and submit the phone number form.
function onPhoneNumberFormSubmit() {
    // TODO cover form and show spinning logo.
    // TODO disable submit button.
    // Note - this check is used to ensure phoneInput.value hasn't been tampered
    // with without triggering oninput.
    if (isCompletePhoneNumber(phoneNumberInput.value)) {
        goToPhoneCodeForm();
    } else {
        // TODO show validation error for phone number.
    }
    // Note we prevent true submission to manually handle it later.
    return false;
}

// Enable submit button if valid/complete phone number is entered.
function onPhoneNumberInput() {
    let val = this.value;
    if (val && val.length) {
        if (isCompletePhoneNumber(val)) {
            enableSubmitButton(phoneNumberSubmitButton);
        } else {
            disableSubmitButton(phoneNumberSubmitButton);
        }
    }
}

// Validate and submit the phone code form.
// Note we don't actually validate it because we never sent a code.
// Any 6 digits are fine.
function onPhoneCodeFormSubmit() {
    // TODO cover form and show spinning logo.
    // TODO disable submit button.
    if (isCorrectPhoneCode(phoneCodeInput.value)) {
        goToNameForm();
    } else {
        // TODO show validation error for phone code.
    }
    // Note we prevent true submission to manually handle it later.
    return false;
}

// Enable submit button if valid code is entered. Note code validation
// should be done when the form is submitted, not at this point.
function onPhoneCodeInput() {
    let val = this.value;
    if (val && val.length) {
        // If code contains 6 numeric characters.
        if (val.replace(/\D/g, '').length === 6) {
            enableSubmitButton(phoneCodeSubmitButton);
        } else {
            disableSubmitButton(phoneCodeSubmitButton);
        }
    }
}

// Validate and submit the name form.
function onNameFormSubmit() {
    // Tracking validity of the form allows us to mark both name fields
    // with errors if both are empty.
    let valid = true;
    if (!firstNameInput.value.length) {
        // TODO show first name validation error.
        valid = false;
    }
    if (!lastNameInput.value.length) {
        // TODO show last name validation error.
        valid = false;
    }
    if (valid) {
        // When this form is valid and submitted, we are clear to store the user session
        // information and navigate to the chat page.
        try {
            (async () => {
                await storeUserSessionInformation();
            })();
            goToChatPage();
        } catch (e) {
            console.error(e);
        } finally {
            return false;
        }
    }
    // Note we prevent true submission to manually handle it later.
    return false;
}

// Enable submit button if both first and last name are not empty.
// We'll consider names with any characters to be valid.
function onNameInput() {
    if (firstNameInput.value.length && lastNameInput.value.length) {
        enableSubmitButton(nameSubmitButton);
    } else {
        disableSubmitButton(nameSubmitButton);
    }
}

// Determine whether the phone number is considered "complete."
// This means it is only numbers, and there are exactly 10 digits.
function isCompletePhoneNumber(val) {
    if (val) {
        // Replace all non-numeric characters in the phone number.
        val = val.replace(/\D/g, '');
        // If the remaining character count is 10, it's a complete phone number.
        if (val.length === 10) {
            return true;
        }
    }
    return false;
}

// Enable the provided submit button.
function enableSubmitButton(submitButton) {
    submitButton.disabled = false;
}

// Disable the provided submit button.
function disableSubmitButton(submitButton) {
    submitButton.disabled = true;
}

// Because the forms are absolutely positioned, the container will not size to their height.
// Set the container height to the height of the tallest form.
// Note there are better ways to handle this depending on the type of form layout we go for
// in between forms. E.g. slide between, crossfade, etc.
function setFormContainerHeight() {
    let forms = document.getElementsByTagName('form');
    let maxHeight = 0;
    for (let i = 0; i < forms.length; i++) {
        maxHeight = Math.max(maxHeight, forms[i].scrollHeight);
    }
    document.getElementById('form-container').style.height = maxHeight + 'px';
}

// Slide the phone number form off to the left, slide
// the phone code form in from the right.
function goToPhoneCodeForm() {
    // First, set phone number text displayed on form.
    phoneNumberLabel.textContent = phoneCountryCodeInput.value + ' ' + prettifyPhoneNumber(phoneNumberInput.value);
    // Then transition out old form/in new form.
    phoneNumberForm.classList.remove('active');
    phoneNumberForm.classList.add('filled');
    phoneCodeForm.classList.add('active');
}

// Slide the phone code form off to the left, slide
// the name form in from the right.
function goToNameForm() {
    phoneNumberForm.classList.remove('active');
    phoneNumberForm.classList.add('filled');
    phoneCodeForm.classList.remove('active');
    phoneCodeForm.classList.add('filled');
    nameForm.classList.add('active');
}

// This is where we could add phone code validation, likely
// with a third-party API.
function isCorrectPhoneCode() {
    // TODO
    return true;
}

// Send the user login info (phone/name) to electron to be stored for the current "session"
// We could use this to auto login/pre-populate forms or something similar in the future.
async function storeUserSessionInformation() {
    await window.api.invoke('storeUserInfo', JSON.stringify({
        phoneCountryCode: phoneCountryCodeInput.value,
        phoneNumber: phoneNumberInput.value,
        firstName: firstNameInput.value,
        lastName: lastNameInput.value
    }));
    return new Promise((resolve) => {
        resolve();
    });
}

// Navigate to the chat window.
function goToChatPage() {
    window.location.href = 'chat.html';
}

// Adds hyphens to phone number.
function prettifyPhoneNumber(phoneNumber) {
    if (phoneNumber && typeof phoneNumber !== 'string') {
        phoneNumber = String(phoneNumber);
    }
    // TODO re-validate the number here.
    if (phoneNumber.length === 10) {
        phoneNumber = phoneNumber.substr(0, 3) + '-' + phoneNumber.substr(3, 3) + '-' + phoneNumber.substr(6);
    }
    // TODO handle invalid number here.
    return phoneNumber;
}