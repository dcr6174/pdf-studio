# Google AdSense: enable or remove
The standard responsive unit uses publisher ca-pub-1116637142188934 and slot 7345764201. PDF Studio is not an AMP site; do not add amp-ad or the AMP library.

## Disable every ad (recommended)
1. Open lib/advertising.ts on GitHub in dcr6174/pdf-studio.
2. Click the pencil to edit.
3. Change export const ADS_ENABLED = true; to export const ADS_ENABLED = false;
4. Commit the change to main (or merge the change through a pull request).
5. Deploy the updated main branch through the existing Cloudflare deployment.
6. Reload the public site. The ad containers and AdSense loader should be absent. Ad-specific CSP permissions are also disabled. Previously opened tabs need a reload.
7. Re-enable later by changing false back to true and deploying again.

## Remove the integration permanently
First disable it as above. Remove the SiteAd import and <SiteAd/> from app/layout.tsx, then remove components/site-ad.tsx and components/site-ad.css. Remove the advertising import and conditional ad domains from lib/security-headers.ts and restore its previous policy. lib/advertising.ts can then be deleted. Deploy again.

## Placement and behavior
One responsive unit sits after public page content, outside PDF canvases, action bars and download buttons. Analytics/API and Terms/Privacy routes do not render the unit or load its script. The script is inserted once per page load. A new route gets a new unit; rerenders do not deliberately refresh ads. Initialization waits for a nonzero width. PDF workspace data is not passed to AdSense.

## Checks after deployment
- Inspect a public page for ins.adsbygoogle with the publisher and slot above.
- Check the adsbygoogle.js script is loaded once, not once per rerender.
- Check desktop/mobile layout and the browser console for CSP or sizing errors.
- Check Terms, Privacy and analytics pages contain no manual ad unit.
- Disable ADS_ENABLED, deploy, reload and confirm the unit and script are absent.
- A blank unit does not prove a code error: account/site approval, inventory and browser blockers affect serving.
- This integration uses a restricted domain allowlist in the existing CSP. Google recommends nonce-based strict CSP and does not guarantee a domain allowlist will remain sufficient; revisit if ad requests are blocked.
- Configure any required regional consent messages in your AdSense account. Our existing usage-counting preference is not an advertising consent manager.
