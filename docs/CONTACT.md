# Contact address

Public address for questions, problems and suggestions: **pdf.studio.in@gmail.com**

Change it in one place: `lib/contact.ts` (`CONTACT_EMAIL`). It is used by:
- `/contact` page (`app/contact/page.tsx`), including its structured data
- the problem-report dialog ("Email report", `components/report-problem.tsx`)
- the error panel ("Email us about this", `app/page.tsx`)
- the privacy policy and About page text (update the written address in `app/privacy/page.tsx` if you change it)

All links are `mailto:` drafts opened in the visitor's own mail app. The website sends nothing itself, so no mail server or form backend is needed. The draft asks people not to attach private documents.

Tips: turn on 2-step verification for the Gmail account, add a "Send mail as" name such as "PDF Studio support", and set up two or three canned replies for the most common questions. A public address will attract spam; use Gmail filters to label messages that mention "PDF Studio" so real ones stay visible.
