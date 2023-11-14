const phoneInput = document.getElementById('phone-number-input');
const submitButton = document.getElementById('phone-number-submit-button');

phoneInput.oninput = onPhoneInput;

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
    // TODO
    submitButton.disabled = false;
}

function disableSubmitButton() {
    // TODO
    submitButton.disabled = true;
}