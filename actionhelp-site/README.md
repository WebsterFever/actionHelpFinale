# ActionHelp

React frontend and Express API for ActionHelp, including multilingual pages and Stripe donations.

## Local setup

1. Copy `actionhelp-site/.env.example` to `actionhelp-site/.env` and set the API URL and Stripe publishable key.
2. Copy `backend/.env.example` to `backend/.env` and set a PostgreSQL URL, Stripe secret key, and a new random admin token. Never put the secret key or admin token in a `REACT_APP_` variable.
3. In `backend`, run `npm ci` and `npm start`.
4. In `actionhelp-site`, run `npm ci` and `npm start`.

The frontend runs at `http://localhost:3000`; the API defaults to port 5000. Build with `npm run build` and run the frontend tests with `CI=true npm test -- --watch=false`.

## Admin donations

Open `/admin/donations` and enter the server's `ADMIN_TOKEN`. The token stays in page memory and is sent only in the request header. Rotate any token previously embedded in client code, because previous commits remain accessible.

Monthly subscriptions require client confirmation of the first invoice. New monthly records are marked `pending` in the database; production reconciliation of subsequent invoice events requires a Stripe webhook before those records can be treated as paid history.
