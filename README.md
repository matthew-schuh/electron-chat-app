# Electron Chat App
## To run:
1. Download the repository
2. cd into the repository
3. Run `npm install`
4. Run `npm start`
5. When the app opens, there is no phone verification so you can enter any 10 digit number.
6. The code requires any 6 digit number.
7. Both name fields may not be empty.

-- Note the app was written to the screen size of the wireframe and is not responsive. Therefore the window may need to be resized if elements appear off screen (such as the chat text box). --


## Things to Consider / Possible Future Additions
1. When loading the initial page of the app, we could jump straight to the chat app if name/number have been provided. A logout button would need to be provided in this case.
2. Use React.js for chat portion.
3. Integrate with 2FA style SMS service for verification code.
4. Add other country codes to phone number form select list.
5. Use JSDoc or similar style comments and generate documentation.
6. Support phone numbers in other formats, such as (xxx) xxx-xxxx and xxx-xxx-xxxx
7. Better/more robust storage system (e.g. database, store individual messages instead of keeping in array, etc.).
8. Add back button to form.
9. Add "Didn't receive text?" option to resend text after x seconds.
10. Better form layout (flex?).
11. Style the select dropdown/scrollbar (phone country code selection), and make it fit longer country codes (e.g. 3 digit codes).
12. Better form validation.
13. Backend/electron data validation of user data sent in 'storeUserInfo' ipc message.
14. Set browser window size in a better way. E.g. allow user to configure and store configured size.
15. Reload chat history on user "login" - This would depend on what we consider to be user login information. Just phone number? Phone + full name?
16. Remove all the absolute stuff (positions, sizes, etc) - this semi falls in line with being responsive.
17. Make chat log scroll.