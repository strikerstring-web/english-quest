# ENGLISH QUEST

**A free English-practice platform for Malayalam speakers.**

ENGLISH QUEST helps learners improve through four focused activities:

- **Writing Studio** — guided writing prompts and AI-assisted feedback in Malayalam.
- **Speaking Arena** — microphone or text conversations, pronunciation playback, and practice feedback.
- **Question Games** — grammar challenges, multiple-choice questions, sentence building, and error correction.
- **Vocabulary Games** — English words with Malayalam meanings, examples, audio, matching, spelling, and listening activities.

## Learning levels

The product roadmap covers Beginner, Intermediate, and Advanced learners. The current starter content is strongest at beginner level; intermediate and advanced content should be expanded and reviewed before public launch.

## Current technology

- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Express API server
- Google Gemini API through a server-side SDK
- Browser speech recognition and speech synthesis where supported
- Local browser storage for progress in the current starter version

## Current status

The repository already contains the core learning experience and sample content. It is **not yet production-ready**:

- Progress currently saves in the browser only; it does not sync across devices.
- Google and email sign-in UI and Firebase client integration are implemented, but require your Firebase web-app configuration.
- Signed-in progress sync uses Firestore; publish and test the included `firestore.rules` before enabling public sign-up.
- Gemini API routes remain unavailable until a server-side API key is configured. Provider quotas and hosting limits still apply.
- AI routes have basic per-instance IP rate limiting; a shared rate-limit store, verified Firebase ID tokens, stronger payload validation, and end-to-end security testing are still required before a high-traffic public launch.

See [docs/IMPLEMENTATION_PLAN.md](docs/IMPLEMENTATION_PLAN.md) for the implementation phases, Firebase architecture, security checklist, and deployment steps.

## Run locally

Requirements: Node.js 20+ (or a compatible current LTS release) and npm.

```bash
npm install
cp .env.example .env
# Add your server-side GEMINI_API_KEY to .env when testing AI features.
npm run dev
```

Open the local URL printed by Vite/Express (normally http://localhost:3000).

## Environment variables

Never commit real secrets. Keep local values in `.env` and production values in the hosting provider's encrypted environment-variable settings.

- `GEMINI_API_KEY` — server-side Gemini API key; never expose it in client-side Vite variables.
- `GEMINI_MODEL` — optional server-side model override (defaults to `gemini-2.5-flash`).
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — Firebase web-app values; these are client config values, not admin credentials.
- `APP_URL` — canonical deployed application URL, if required by server-side callbacks.
- Firebase client configuration — public Firebase web-app configuration values are supplied to the client at build time; enforce access through Firebase Authentication, Firestore Security Rules, and App Check rather than treating the web config as a secret.

## Free-use commitment

The app will not charge learners or include paid learning tiers. Hosting, database, and AI providers still enforce free quotas and fair-use limits; no third-party free tier is unlimited or guaranteed to remain free. AI features may be temporarily rate-limited when a provider quota is reached.

## License

The source files currently carry Apache-2.0 SPDX headers. Confirm and add a repository-wide LICENSE file before publishing a formal open-source release.


## Firebase activation checklist

1. Create a Firebase project and add a Web App.
2. Enable Google and Email/Password providers in Firebase Authentication.
3. Create Firestore and publish the repository's `firestore.rules` (after reviewing and testing them).
4. Add your Vercel deployment hostname to Firebase Authentication's authorized domains.
5. Add all six `VITE_FIREBASE_*` values to the Vercel project's Production and Preview environment settings, then redeploy.
6. Add `GEMINI_API_KEY` as a server-only Vercel environment variable to activate AI feedback and conversation. Never put it in a `VITE_*` variable or commit it.
