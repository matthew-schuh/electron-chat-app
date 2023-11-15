# Electron Chat App

## Things to Consider / Possible Future Additions
1. When loading the initial page of the app, we could jump straight to the chat app if name/number have been provided. A logout button would need to be provided in this case.
2. Use React.js for chat portion.
3. Integrate with 2FA style SMS service for verification code.
4. Add other country codes to phone number form select list.
5. Use JSDoc or similar style comments and generate documentation.
6. Support phone numbers in other formats, such as (xxx) xxx-xxxx and xxx-xxx-xxxx
7. Better/more robust storage system.
8. Add back button to form.
9. Add "Didn't receive text?" option to resend text after x seconds.
10. Better form layout (flex?).
11. Style the select dropdown/scrollbar (phone country code selection), and make it fit longer country codes (e.g. 3 digit codes).
12. Better form validation.
13. Backend/electron data validation of user data sent in 'storeUserInfo' ipc message.