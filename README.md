# Kriday Dave

Editorial portfolio and research landing page, deployed on Cloudflare Pages.

## Local development

```sh
npm install
npm run dev
```

## Contact form

The Pages Function at `/api/contact` sends mail through Resend. Configure:

- `RESEND_API_KEY` as a Cloudflare secret
- `CONTACT_TO_EMAIL` as a Cloudflare environment variable
- `CONTACT_FROM_EMAIL` after verifying a sending domain in Resend

For local development, put these values in `.dev.vars`.

## Deploy

Connect the repository to Cloudflare Pages, or run:

```sh
npm run deploy
```
