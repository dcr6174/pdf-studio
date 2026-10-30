# Cloudflare dependency-install repair

## Observed failure

The production Cloudflare build stopped during `npm clean-install`, before the application build command started. The log ended with `npm error Exit handler never called!`. Cloudflare used Node 22.13.0 and npm 10.9.2; local validation used npm 11.19.1.

The merged dependency lockfile contained 48 tarball URLs on an internal development-environment registry. Those addresses are not portable to Cloudflare. This explains why a successful local installation did not establish a successful production installation.

## Narrow repair

- Replace those 48 URLs with their canonical public npm registry HTTPS URLs.
- Keep every dependency version and integrity checksum unchanged.
- Verify all 48 replacements against the public registry's published tarball URL and integrity checksum.
- Pin `packageManager` to `npm@11.19.1`, the locally validated installer.
- Run a dependency-free lockfile portability check before installation in the main quality workflow.

No document-processing code, game engine, save format, DNS setting, Worker runtime secret or database configuration changes are included.

## Why pin the package manager here?

Cloudflare Workers Builds reads `packageManager` before automatic dependency installation. `engines.npm` does not choose the installer. See:

- https://developers.cloudflare.com/workers/ci-cd/builds/build-image/#package-manager-versions
- https://developers.cloudflare.com/changelog/post/2026-10-23-workers-builds-pin-npm-version/

## Validation and release

Run `npm run verify:lockfile`, a clean `npm ci`, and `npm run build:public`. The repair needs a successful Cloudflare build and live endpoint checks before it can be considered verified in production.

Local verification completed successfully:

- All 48 replacement URLs and integrity values matched official registry metadata.
- A structural lockfile comparison confirmed that only those 48 download addresses changed; versions, integrity hashes and dependency relationships stayed identical.
- `npm ci` completed with the project's real asset-preparation postinstall.
- The portability guard passed both before and after installation.
- `npm run build:public` passed, including TypeScript and the existing build checks.
- Both SEO suites passed; the built worker returned correct metadata on all 558 sitemap pages, permanent redirects for nine legacy cases, and noindex 404s for four missing-page cases.
- The new guard passed ESLint.

The original Cloudflare build log does not include npm's internal debug file, so this repair addresses the confirmed portability problem and installer mismatch without claiming those were npm's only possible failure causes.

Do not merge the repair or trigger a production deployment without approval: this repository's `main` branch is connected to Cloudflare production.
