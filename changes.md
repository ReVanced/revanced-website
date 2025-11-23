Phase 1: modernization
I replaced the old Svelte 4 stores in src/lib/stores.ts with a new src/lib/stores.svelte.ts file that uses Svelte 5 Runes for better reactivity. I then updated all dependent components to access the store state via properties like admin_login.value instead of the $ prefix syntax.

Phase 2 performence and best practices
I removed the inefficient setInterval polling from the authentication store and replaced it with an event-driven approach using a custom revanced-auth-change event. I also refactored the Wave component integration in the home page to use Svelte's bind:this instead of slow and non-idiomatic document.querySelector calls.

Phase 3 code organisation
I extracted the large JSON-LD SEO schema definition from src/routes/+page.svelte into a dedicated src/data/seo.ts file. This significantly reduced the size of the main page component, making the logic easier to read and maintain without affecting the frontend output.

Security and user expereince improvements
I added sanitization to the username field in the authentication logic to prevent header injection attacks. I also added a loading state to the login dialog that disables the form inputs and button while a request is processing to prevent brute-force spamming.

full security analysations and hardening
I conducted a comprehensive security audit of the codebase. I identified and fixed a Critical XSS vulnerability in `src/routes/announcements/[slug]/Content.svelte` by implementing `DOMPurify` sanitization for the `{@html}` block. I also mitigated potential Open Redirect vulnerabilities by validating URLs in `src/data/api/settings.ts` and `src/util/isValidUrl.ts` to strictly allow only `http` and `https` protocols. These changes ensure that user-generated content and external configuration cannot be exploited to execute malicious scripts or redirect users to harmful sites.
Fully understandable that Cloudflare is doing the conversion to https:// but it is never wrong to be safe:
  Better safe than ending up in a whole pile of sorry

There is also a comment in a file where if you remove the comment ( // ) the line under it goes red....Absolut cinema 
  pssst: C:\Users\06mosnaz\Desktop\Laboratory\rewrite-refractor\src\lib\components\QRCode.svelte


In developemnt (pnpm run dev):
The code detects it is in "dev mode".
It routes requests through your local server (/api/...), which acts as a proxy to bypass CORS.
Result: No errors while you work locally.
In Production (Your Main Server):

The code detects it is not in "dev mode".
It reverts to using the real URL: https://api.revanced.app.
Result: Your browser will make requests directly to the API.


Modernised codebase and fix types

Went through and cleaned up a lot of the older syntax.
Switched API calls to use async/await instead of promise chains
Converted horizontalSlide to TypeScript
Updated UI components (Button, Dialog, etc) to use Svelte 5 snippets properly
Fixed the search debounce on announcements and patches pages
General type improvements and removed a bunch of any casts

Attention to: vite.config.ts line: 8
Attention to: src/lib/data/api/settings.ts line: 4

bug fixes and UI polish

Fixed infinite loop in donation heart animation by breaking circular dependency
Replaced direct history manipulation with SvelteKit navigation to fix router conflicts
Resolved hydration mismatch in Head component by correcting JsonLd placement
Added spin animation and visual feedback to the settings reset button cuz there was no way to know if it was clicked

Forgot to mention that i re-organised the entire structure of directories in this project because it was not very easy to navigate around in this project, hope that does not backfire.....
If it does backfire, a backup is in: new_directories.txt