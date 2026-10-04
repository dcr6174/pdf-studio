# How to apply this update

Includes: Page Buddy logo, homepage mascot animation, slow theme switch, Scan to PDF (57th tool), guides hub, four comparison pages, two new search pages, Buddy expressions and the new homepage title.

The original ZIP was not built by its author. This integration was reviewed against the latest repository and tested using the existing installed dependencies. Do steps 3 and 4 in your deployment environment too; camera behavior and rendered mobile layouts still need real-device verification.

## 1. Back up
```sh
cd path/to/your/pdf-studio-repo
git checkout -b page-buddy-update   # work on a branch so you can roll back
```

## 2. Copy the files in
Unzip `pdf-studio-full-update.zip`. Copy everything inside `pdf-studio-main/` over your repo folder (replace files when asked).
Do not delete your `.git` folder.

For the reviewed GitHub version, pull the latest branch instead of copying the ZIP over newer changes. Older logo assets are retained for rollback; active references use v5. Do not delete assets until their references have been checked.

## 3. Install and check
```sh
npm ci
npm run lint
npx tsc --noEmit
npm run generate:site-assets   # social images + sitemap for the new pages; the SEO check needs them
npm run verify
npm run verify:studio
node checks/verify-seo.mjs
node checks/verify-guides-comparisons.mjs
node checks/verify-homepage.mjs
node checks/verify-navigation-install.mjs
node checks/verify-theme.mjs
npm run build:public
```
If a step fails, stop and send the error message.

## 4. Look at it
```sh
npm run dev
```
Open the local address it prints and check:
- [ ] Header shows the Page Buddy logo with "pdf studio"; it switches to the white-text version in dark mode.
- [ ] Homepage: Buddy drops in, blinks, and hops when tapped. Dragging a PDF onto the page makes him cheer.
- [ ] The sun/moon button fades the page slowly (about 0.7 s) instead of jumping.
- [ ] With "reduce motion" turned on in your OS, Buddy is still and the theme switches instantly.
- [ ] Browser tab shows the new favicon (hard refresh: Ctrl+Shift+R / Cmd+Shift+R).
- [ ] A tool page such as /tools/compress-pdf: the guide sits above the footer, "Back to …" scrolls up without leaving the tool.
- [ ] Phone width (DevTools device mode, 390 px): header, hero and tool cards fit without sideways scrolling.
- [ ] /tools/scan-to-pdf on a real phone: Take a photo offers a camera or supported-image picker, Take another photo adds a page, export works.
- [ ] /guides lists popular tasks, all tools by category, export guides and comparisons.
- [ ] /compare/smallpdf-alternative: table on desktop, stacked cards on a phone; source links open.
- [ ] Empty My files shows sleepy Buddy; a finished export shows cheering Buddy; an error shows worried Buddy.

## 5. Commit and deploy
```sh
git add -A
git commit -m "Page Buddy brand, Scan to PDF, guides hub, comparisons, Buddy states"
git push -u origin page-buddy-update
```
Merge the branch into your main branch, then deploy as usual (`npm run deploy:public`, or let Cloudflare build from GitHub).
Confirm in the Cloudflare dashboard that the new deployment succeeded, then open the live site in a private window.

Notes:
- Social share images are regenerated during `npm run build:public` with the new logo. Social networks cache previews; use their debug tools to refresh.
- Installed PWAs may keep the old icon until reinstalled.

## Roll back
```sh
git switch main
# If merged, revert the update commit (do not force-push shared history):
git revert <update-commit-sha>
git push origin main
```
