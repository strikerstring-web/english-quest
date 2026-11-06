# ENGLISH QUEST — Implementation & Deployment Plan

**Product promise:** free English practice for Malayalam speakers, with no subscriptions, premium lessons, or paywalls.

## 1. Confirmed product scope

1. **Writing:** sentence writing, guided answers, short paragraphs, correction, a simple score breakdown, and Malayalam explanations.
2. **Speaking:** text chat and microphone-based speech-to-text, spoken playback, everyday role-play scenarios, and end-of-session feedback.
3. **Question games:** grammar MCQs, fill-in-the-blanks, sentence ordering, find-the-error questions, scores, XP, and levels.
4. **Vocabulary:** English word, Malayalam meaning, phonetic hint, example sentence and Malayalam translation, audio playback, matching, spelling, listening, and review.

All three learning levels are in scope: Beginner, Intermediate, and Advanced. The current repository has substantial beginner content; intermediate and advanced question banks need to be authored and reviewed before launch.

## 2. Existing repository assessment

The repository already has a React + TypeScript + Vite client, Tailwind styling, an Express server, and Gemini-backed API routes. Existing UI modules include Writing Studio, Speaking Arena, Vocabulary Game, Grammar Game, onboarding, progress, achievements, and responsive navigation.

Current limitations found during review:
- Progress is saved to browser localStorage only.
- There is no Firebase Authentication integration yet.
- There is no Firestore user-progress sync yet.
- The Express AI routes accept client requests without a production-grade per-user quota/rate-limit layer.
- AI fallback responses can look like real evaluations; the UI should label fallback/offline feedback honestly.
- Speech recognition depends on browser support and microphone permission. It is not guaranteed on every device/browser.
- Current app content and AI behavior need full QA; repository inspection is not equivalent to a successful production build or browser test.

## 3. Recommended architecture

### Frontend
- Keep React 19 + TypeScript + Vite.
- Keep the four learning areas as the primary navigation; remove or hide general lesson sections if product testing confirms they are unnecessary.
- Keep English + Malayalam as the initial interface and vocabulary language pair.
- Add clear Beginner / Intermediate / Advanced selection and filter writing prompts, speaking scenarios, and question banks by level.

### Identity and data
- **Firebase Authentication:** Google sign-in and email/password sign-in.
- **Cloud Firestore:** store each learner's profile and progress under their authenticated UID.
- Suggested structure:
  - `users/{uid}`: display name, email, createdAt, selectedLevel, language preference.
  - `users/{uid}/progress/current`: XP, level, streak, daily goal, learned word IDs, completed game IDs, and aggregate counters.
  - `users/{uid}/writingHistory/{entryId}`: prompt ID, level, score, feedback summary, createdAt.
  - `users/{uid}/speakingHistory/{entryId}`: scenario ID, level, score, turn count, createdAt.
- Keep localStorage as a short-lived offline cache only; Firestore is the signed-in user's source of truth.
- Do not store raw microphone audio. Save transcripts only when the learner explicitly chooses to save a practice session.

### AI services
- Keep Gemini calls on a trusted server endpoint. Never put `GEMINI_API_KEY` in client code or a `VITE_*` variable.
- Use a currently supported Gemini Flash model, configurable with a server-side `GEMINI_MODEL` environment variable.
- Validate request size and fields, require a verified Firebase ID token, enforce per-user rate limits, and cap input/output lengths.
- Return structured feedback with clear uncertainty and a friendly educational tone.
- Do not fabricate scores when the AI request fails. Show a clear retry/error state or label a local rule-based hint as non-AI feedback.
- Add an admin-controlled daily request budget and a global kill switch for AI endpoints.

## 4. Firebase setup

1. Create a Firebase project at https://console.firebase.google.com/.
2. Add a Web App and copy its configuration into deployment environment variables.
3. Enable **Authentication → Sign-in method → Google**.
4. Enable **Authentication → Sign-in method → Email/Password**.
5. Create a Cloud Firestore database.
6. Add the deployed domain to Authentication's authorized domains.
7. Publish restrictive Firestore Security Rules before enabling public sign-up.
8. Enable Firebase App Check after validating the production domain and app integration.
9. Configure password reset and email verification flows.
10. Test account creation, Google sign-in, sign-out, session restoration, and access denial between two separate users.

### Firestore security rules baseline

Adapt and test these rules against the exact document schema before production. Users may read/write only their own documents; server-only administrative data must not be client writable.

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, create, update, delete: if request.auth != null
                                           && request.auth.uid == userId;
      match /{document=**} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }
  }
}
```

This is a starting ownership rule, not a complete schema validator. Add field allowlists, type checks, size limits, and immutable-field protections before launch. Never use open rules such as `allow read, write: if true`.

## 5. AI endpoint security

For every `/api/ai/*` route:
- Require Firebase Authentication; verify the ID token on the server using Firebase Admin SDK.
- Apply per-UID and per-IP rate limits, request-size limits, and daily quotas.
- Validate allowed scenario IDs, level values, message count, text length, and content types.
- Add timeouts and bounded retries; do not return stack traces or secrets to clients.
- Avoid logging full private writing submissions or conversation transcripts.
- Add abuse reporting and a way to disable AI features without taking down vocabulary and offline games.
- Keep API keys in the host's secret manager/environment settings only.

## 6. Deployment recommendation

### Preferred first release: Vercel + Firebase

Vercel is convenient for GitHub-connected previews and deployments, but the current custom Express server should not be assumed to deploy unchanged as a Vite static site. Before production deployment, move the three Gemini routes into Vercel serverless functions (or choose a compatible Node server host) and verify the route runtime.

Deployment sequence:
1. Refactor server routes into deployable serverless handlers while preserving request validation.
2. Configure Vercel project from `strikerstring-web/english-quest`.
3. Set framework preset to Vite, build command `npm run build`, output directory `dist`.
4. Add Firebase client config, `GEMINI_API_KEY`, `GEMINI_MODEL`, and any required app URL as encrypted environment variables. Never commit production values.
5. Configure Firebase authorized domains with the Vercel production domain.
6. Deploy a preview and test authentication, database isolation, AI calls, speech permissions, and mobile layout.
7. Promote to production only after the release checklist passes.

**Plan restriction:** Vercel Hobby is limited to personal/non-commercial use under its terms. If the project becomes commercial or monetized, choose an appropriate paid plan or a host whose terms permit the intended use.

### Alternative
Firebase Hosting can serve the static frontend on its no-cost quota. It does not by itself host the existing Express server; AI routes still need a compatible backend. Cloud Run can host Express, but requires a billing-enabled Google Cloud project and may incur charges even where free usage allowances apply.

## 7. Free operating model — important limits

- Firebase Authentication supports common sign-in methods on the no-cost Spark plan, subject to product-specific limits.
- Firestore has a no-cost quota, not unlimited storage/reads/writes. When Spark quotas are exceeded, some services can be paused until the quota resets.
- Gemini Developer API has a free tier for eligible models, with model-specific rate limits and eligibility. Free-tier data handling terms differ from paid tiers; do not send sensitive personal information in learner submissions.
- Hosting providers have their own quotas, fair-use terms, and commercial-use restrictions.

The learner experience will remain free. The project owner should not promise unlimited AI usage or unlimited uptime at zero cost. Add quotas and graceful fallback behavior to prevent unexpected bills.

## 8. Quality and release checklist

### Functional
- [ ] Beginner, Intermediate, and Advanced content reviewed by an English educator.
- [ ] Writing feedback corrects grammar without rewriting learner meaning.
- [ ] Speaking works with both typed input and microphone transcription where supported.
- [ ] Browser microphone denial and unsupported browsers show helpful instructions.
- [ ] Vocabulary search, Malayalam meanings, audio, matching, and revision work.
- [ ] Quiz scoring, XP, streaks, and achievements update correctly.
- [ ] Progress survives sign-out/sign-in and works across two devices.

### Security and privacy
- [ ] Firebase ID tokens verified by every AI API route.
- [ ] Firestore rules tested with authenticated and unauthenticated users.
- [ ] No API keys in Git history or browser bundles.
- [ ] Rate limits and daily AI budget enabled.
- [ ] Privacy notice explains account data, transcripts, AI processing, retention, and deletion.
- [ ] Account deletion removes the user's Firestore data.
- [ ] App Check and abuse monitoring configured.

### Deployment
- [ ] Clean install and production build pass.
- [ ] TypeScript checks pass.
- [ ] Preview deployment tested on mobile and desktop.
- [ ] Production domain and Firebase authorized domains match.
- [ ] Error monitoring and backup/export process documented.

## 9. Suggested implementation milestones

1. **Foundation:** clean up navigation to the four requested activities, normalize levels, audit the current UI and fix build/runtime errors.
2. **Accounts:** Firebase Google/email authentication, protected routes, password reset, sign-out.
3. **Cloud progress:** Firestore schema, security rules, migration from localStorage, cross-device sync.
4. **AI hardening:** token verification, rate limiting, quota controls, robust structured responses, honest failure states.
5. **Content expansion:** intermediate and advanced vocabulary, writing prompts, scenarios, and question banks.
6. **Launch:** automated checks, preview QA, privacy page, production deployment, and post-launch monitoring.

## 10. Owner setup needed before production

The repository owner must create or select the Firebase project, enable Google and email sign-in, and provide the Firebase web-app configuration through deployment settings. The owner must also create a Gemini API key in Google AI Studio and add it only as a server-side secret. Do not paste private keys into chat or commit them to GitHub.
