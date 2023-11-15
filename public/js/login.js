const ipcRenderer = require('electron').ipcRenderer;

const phoneInputForm = document.getElementById('phone-input-form');
const phoneInput = document.getElementById('phone-number-input');
const submitButton = document.getElementById('phone-number-submit-button');

phoneInputForm.onsubmit = onPhoneInputFormSubmit;
phoneInput.oninput = onPhoneInput;

// Validate and submit the form.
function onPhoneInputFormSubmit() {
    // TODO cover form and show spinning logo.
    // TODO disable submit button.
    // Note - this check is used to ensure phoneInput.value hasn't been tampered
    // with without triggering oninput.
    if (isCompletePhoneNumber(phoneInput.value)) {
        ipcRenderer.send('savePhoneNumber', phoneInput.value);
    } else {
        // TODO show validation error for phone number.
        return false;
    }
}

// Enable submit button if valid/complete phone number is entered.
function onPhoneInput() {
    let val = this.value;
    if (val && val.length) {
        if (isCompletePhoneNumber(val)) {
            enableSubmitButton();
        } else {
            disableSubmitButton();
        }
    }
}

function isCompletePhoneNumber(val) {
    if (val) {
        val = val.replace(/\D/g, '');
        if (val.length === 10) {
            return true;
        }
    }
    return false;
}

function enableSubmitButton() {
    submitButton.disabled = false;
}

function disableSubmitButton() {
    submitButton.disabled = true;
}