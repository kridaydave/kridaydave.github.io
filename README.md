# Kriday Dave

Editorial portfolio and research landing page, deployed as a Cloudflare Workers application with Static Assets.

## Local development

```sh
npm install
npm run dev
```

## Contact form

The Worker route at `/api/contact` sends mail through Resend. Configure:

- `RESEND_API_KEY` as a Cloudflare secret
- `CONTACT_TO_EMAIL` as a Cloudflare environment variable
- `CONTACT_FROM_EMAIL` after verifying a sending domain in Resend (configured as `contact@kridaydave.com`)

For local development, put these values in `.dev.vars`.

## Deploy

Connect the repository to a Cloudflare Workers Builds application, or run:

```sh
npm run deploy
```
