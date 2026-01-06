Owner features added:

- Model: `modals/owner.js` (name, email, password hashed via bcrypt, restaurants[])
- Routes: implemented in `index.js`
  - GET/POST `/owner/signup`
  - GET/POST `/owner/login`
  - GET `/owner/logout`
  - GET `/owner/dashboard` (protected)
  - GET/POST `/owner/add-restaurant` (protected)
- Views: `views/allEjs/ownerSignup.ejs`, `ownerLogin.ejs`, `ownerDashboard.ejs`, `ownerAddRestaurant.ejs`

How to run:

1. npm install
2. npm start
3. Open `http://localhost:3030/owner/signup` to create an owner, then manage restaurants in dashboard.

Notes:
- Passwords are hashed with bcrypt.
- The add-restaurant form accepts an `Image URL` which is saved in the restaurant record.
- I removed `background-attachment: fixed` from the hero section (mobile background rendering fix).
