# PDF Studio on pdf-studio.in

Prepared 30 September 2026. The public Cloudflare build is implemented and builds successfully. This repository contains the public hosting source. Your Cloudflare account deployment, domain activation and live browser verification are still pending.

## What goes where

- GitHub holds the MIT-licensed source. Visitors never interact with GitHub authentication.
- Cloudflare Workers serves the public PDF tools and the analytics API; D1 stores anonymous activity. PDF bytes stay in the visitor's browser.
- GoDaddy remains the domain registrar. Cloudflare serves DNS and HTTPS after you connect the domain.
- `/` is public. `/analytics` is the owner dashboard. Only the owner enters a password. No ChatGPT authentication is required in this deployment.

The existing Sites preview is a separate deployment. Its current access settings do not control your Cloudflare-hosted site.

## 1. Put the code on GitHub

The source is at https://github.com/dcr6174/pdf-studio. Continue with Cloudflare setup below. Never commit credentials, `.env*`, `.dev.vars*`, or generated `wrangler.public.json`.

## 2. Create the analytics database

Use Node 22.13 or later. In the project folder:

```sh
npm ci
npx wrangler login
npx wrangler d1 create pdf-studio-analytics
node scripts/configure-public.mjs YOUR_DATABASE_ID
npx wrangler d1 migrations apply pdf-studio-analytics --remote --config wrangler.public.json
```

Copy the actual database ID from the create command. The all-zero example ID is only for local build checks and must never be used for deployment. The configuration script writes an ignored local file; credentials are set separately.

## 3. First public deployment

```sh
npm run build:public
npm run deploy:public
npx wrangler secret put OWNER_PASSWORD --config wrangler.public.json
npx wrangler secret put ANALYTICS_OWNER_EMAIL --config wrangler.public.json
```

For `OWNER_PASSWORD`, generate and save a unique random password of at least 32 ASCII characters in your password manager. Enter it only in the Wrangler prompt or Cloudflare dashboard, never in GitHub source or chat. `ANALYTICS_OWNER_EMAIL` is your email, used solely to identify the owner internally. Without both settings, the dashboard stays closed; public tools still work.

Open `/analytics`. The browser asks for username **owner** and your owner password. A signed Secure/HttpOnly/SameSite cookie lasts eight hours. Rotate `OWNER_PASSWORD` to revoke all existing sessions. Browser HTTP Basic credentials can be cached: use a dedicated browser profile, and close it/clear its site data when finished on a shared computer. This is a single-owner password setup, not multi-user account management or two-factor authentication. HTTPS is required.

The standalone Worker strips all incoming Sites identity headers before making its own authorization decision. The anonymous `/api/analytics/collect` endpoint stays public and validates its strict event schema. Requests for analytics data fail closed without an owner session.

## 4. Connect GitHub to Cloudflare

In Cloudflare, open Workers & Pages, select the `pdf-studio` Worker, and connect the repository using Builds. Set:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `node scripts/configure-public.mjs && npm run build:public` |
| Deploy command | `npm run deploy:public` |
| Build variable | `D1_DATABASE_ID` = the actual database ID |
| Node version | 22.13 or newer |

Configure owner credentials as **Worker runtime secrets**, not client variables or repository contents. The D1 ID is a resource identifier, not an authentication token. Database migrations must be applied before deployments that change the schema.

## 5. Connect pdf-studio.in

1. Add `pdf-studio.in` as a zone in your Cloudflare account.
2. Review imported DNS records and preserve any records you use. Cloudflare gives you two nameservers.
3. In GoDaddy, change only this domain's nameservers to those two exact values. Keep domain registration at GoDaddy.
4. Wait until Cloudflare shows the zone as Active.
5. In the Worker, open Settings → Domains & Routes → Add → Custom Domain and enter `pdf-studio.in`. Cloudflare provisions DNS and TLS.
6. Add `www.pdf-studio.in` if desired. Choose one canonical hostname before sharing links.
7. Verify `/` works in an incognito window with no account, a representative PDF exports correctly, and `/analytics` plus `/api/analytics/summary` remain protected.

Do not put a site-wide Cloudflare Access sign-in rule in front of the public tools. Optional Access can protect owner routes later, but it must not replace the Worker's authorization without deliberate implementation. No domain DNS changes were performed during this task.

## Costs and operations

Browser processing avoids PDF processing server costs. Cloudflare still has request, CPU, database and build quotas; this is not a promise of unlimited free hosting. Check current Workers/D1 pricing before launch and monitor usage. Anonymous collection currently limits each visitor identifier to 120 events per minute, but identifiers can be regenerated; configure Cloudflare edge rate limiting for `/api/analytics/collect` as traffic grows. Do not cache analytics responses.

An hourly scheduled handler purges analytics older than 48 hours even if there are no new visitors. Normal ingestion also purges expired rows. The hourly sweep can leave inactive rows for up to roughly 49 hours; provider backups follow provider retention. Application logs contain no document bytes, names or passwords; Worker observability is off in the example. Keep request headers/bodies out of any later log configuration.

## Validation in this environment

- TypeScript checked.
- Standalone Cloudflare/Vite production build and Wrangler deployment dry run passed (about 2 MiB gzip of Worker code). No remote deployment was performed.
- Owner boundary checks cover public access, fail-closed configuration, missing/wrong credentials, spoofed identity headers, HTTPS, response body preservation, signed cookies, tampering, expiry and password rotation.
- No Cloudflare account deployment, DNS propagation, live browser password dialogue, touch interactions or visual browser QA verified here. The supported browser-control skill is unavailable.
- The PDF engine is unchanged by this refresh; previous engine test limitations in `VALIDATION.md` still apply.

## Official setup references

Reviewed 30 September 2026:

- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/workers/vite-plugin/reference/api/
- https://developers.cloudflare.com/d1/reference/migrations/

