# ENGLISH QUEST — Gamified English Learning App for Malayalam Speakers

A responsive, modern educational game application designed specifically for Malayalam-speaking beginners to master English speaking and writing through interactive games, daily missions, quizzes, AI conversations, and writing exercises.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed with the user during Phase 1:
> - **Audio Guidance Style**: English voice speech synthesis with optional Malayalam audio/text explanations.
> - **AI Feedback Depth**: Instant score with clear bulleted fixes and Malayalam explanations for rapid learning.
> - **Learning Path Progression**: Sequential stage unlocking based on quiz mastery threshold (≥70% score required to unlock subsequent stages).

---

## 1. Overview & Core Concept

**ENGLISH QUEST** bridges the gap for Malayalam speakers learning English from absolute basics. The application balances playful mobile-first game mechanics (XP, streaks, levels, achievement badges, and reward animations) with rigorous educational pedagogy:
- **Bilingual Scaffolding**: Instructions, translations, hints, and error explanations are presented in Malayalam (മലയാളം), with an instant English/Malayalam UI toggle.
- **50+ Beginner Vocabulary Items**: Full dictionary covering core daily vocabulary with Malayalam translations, phonetic guides, contextual examples, and native speech audio.
- **5 Interactive Vocabulary Game Modes**: Meaning quiz, word matching, missing letter spelling, visual association, and listening comprehension.
- **Comprehensive Grammar Lab**: 9 beginner topics (Pronouns, Am/Is/Are, Has/Have, Articles, Singular/Plural, Tenses, Prepositions) across 4 mechanics (arrange sentence, find mistake, fill in blank, multiple choice).
- **AI Speaking Arena**: Realistic conversational roleplays across 7 scenarios with microphone speech-to-text, audio playback, suggested responses, and Gemini-powered diagnostic feedback.
- **AI Writing Studio**: 6 structured writing exercises evaluated by Gemini against a 100-point rubric, delivering corrected sentences, Malayalam explanations, and vocabulary enhancements.
- **Progress & Gamification**: Persistent LocalStorage tracking of XP, level ups, daily streaks, 4 daily missions, completed lessons, and earned badges.

---

## 2. User Experience & Visual Design

### Aesthetic Direction & Visual Identity
- **Aesthetic**: Premium educational gaming interface inspired by clean, modern mobile apps — tactile rounded cards, bouncy micro-interactions, distinct game buttons, and high readability.
- **Palette**:
  - Deep Navy Canvas/Text: `#111827`
  - Primary Quest Blue: `#4F7CFF`
  - Magic Purple: `#8055E8`
  - Mint Emerald Accent: `#37D6A0`
  - Warm Gold (XP/Streak): `#F59E0B`
  - Neutral Background: `#F5F7FC`
  - Surface: Pure `#FFFFFF` cards with subtle borders (`#E5E7EB`) and soft depth shadows.
- **Typography**: 
  - Headlines & Brand: `Plus Jakarta Sans` / `Outfit` (bold, friendly, modern).
  - Body & Malayalam: Clean unicode-supported sans-serif ensuring sharp Malayalam glyph rendering (`Noto Sans Malayalam` fallback).
  - Numbers & Counters: `font-mono tabular-nums` for XP and streaks.

### Key Layout & Navigation Architecture
- **Responsive Navigation**:
  - **Desktop (`lg:`)**: Fixed left sidebar with brand logo, user level badge, and 6 primary navigation destinations (`Home`, `Learn`, `Speaking`, `Writing`, `Games`, `Profile`), plus quick stats in the header.
  - **Mobile (`<lg`)**: Sticky top bar with streak & XP stats + fixed bottom tab bar with 44px+ touch hitboxes for thumb accessibility.
- **Language Switcher**: Always accessible in the top bar to toggle UI labels between English and മലയാളം.
- **Onboarding Experience**: Smooth zero-barrier onboarding modal allowing users to enter their name, choose beginner difficulty, pick a daily goal (Casual 5 min, Regular 15 min, Serious 30 min), and dive straight into learning without forced account registration.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Gemini Integration via Server-Side Proxy**
  - *Chosen Approach*: Implement `/api/ai/conversation`, `/api/ai/speaking-feedback`, and `/api/ai/writing-feedback` on the server using `@google/genai` with model `gemini-3.8-flash`.
  - *Why*: Protects `GEMINI_API_KEY` from client exposure, ensures strict response schema validation (JSON), and guarantees robust server-side error recovery with fallbacks.
- **Decision 2: Dual Web Speech API (STT & TTS) with Typing Fallback**
  - *Chosen Approach*: Utilize browser `webkitSpeechRecognition` / `SpeechRecognition` for voice input and `window.speechSynthesis` for native English audio pronunciation. Include an intuitive on-screen keyboard/text input for devices lacking mic permission.
  - *Why*: Enables instant zero-cost voice practice while ensuring 100% functionality on all browsers and devices.
- **Decision 3: Offline-First Local Storage Engine**
  - *Chosen Approach*: Save XP, levels, daily streak timestamp, completed missions, quiz scores, and settings in browser `localStorage`.
  - *Why*: Instant state persistence across page refreshes, zero login friction, and immediate resumption of user progress. Includes a progress reset modal with confirmation.
- **Decision 4: Real Pedagogical Vocabulary & Grammar Corpus**
  - *Chosen Approach*: Pre-bundle a curated dataset of 50+ essential beginner vocabulary words with verified Malayalam definitions, sample sentences, and audio triggers, plus 36+ graded grammar quiz items.
  - *Why*: Ensures rapid zero-latency game play without waiting for AI requests during core drills, reserving Gemini AI for open-ended conversation and essay feedback.

---

## 4. Technical Architecture & System Layout

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ENGLISH QUEST UI (React 19)                     │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: XP Counter · Streak Flame · Level Badge · EN/ML Toggle       │
├──────────────────┬─────────────────────────────────────────────────────┤
│  Desktop Sidebar │ Main Content Container                              │
│  or Mobile Tabs: │  ├─ Home Dashboard (Missions, Daily Streak, Stats)   │
│   • Home         │  ├─ Learn Path (5 Graded Stages, Sequential Unlock) │
│   • Learn        │  ├─ Vocabulary Game (5 Interactive Drill Modes)     │
│   • Speaking     │  ├─ Grammar Lab (9 Topics, 4 Question Types)        │
│   • Writing      │  ├─ Speaking Arena (7 Scenarios, Voice + Feedback)  │
│   • Games        │  ├─ Writing Studio (6 Tasks, AI 100-pt Rubric)      │
│   • Profile      │  └─ Profile View (Achievements, Stats, Reset)       │
└──────────────────┴─────────────────────────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌─────────────────────────┐                     ┌────────────────────────┐
│ Client-Side State       │                     │ Full-Stack Server      │
│ • LocalStorage Manager  │                     │ Express / Vite Proxy   │
│ • Web Speech API (STT)  │                     │ • /api/ai/conversation │
│ • SpeechSynthesis (TTS) │                     │ • /api/ai/speaking-fb  │
│ • Sound FX / Animations │                     │ • /api/ai/writing-fb   │
└─────────────────────────┘                     └──────────┬─────────────┘
                                                           │
                                                           ▼
                                                ┌────────────────────────┐
                                                │ Google GenAI SDK       │
                                                │ (gemini-3.8-flash)     │
                                                └────────────────────────┘
```

---

## 5. Implementation Roadmap & Functional Units

1. **Server-Side API Setup (`server.ts` & Vite integration)**:
   - Configure `@google/genai` client using `process.env.GEMINI_API_KEY`.
   - Setup endpoints:
     - `POST /api/ai/conversation`: Multi-turn dialogue partner with roleplay scenario context.
     - `POST /api/ai/speaking-feedback`: Post-session analysis for grammar, vocabulary, fluency, and Malayalam advice.
     - `POST /api/ai/writing-feedback`: 100-point rubric breakdown, corrected sentence, vocabulary suggestions, and Malayalam explanations.
2. **Data & Progression Engine (`src/data/`)**:
   - `vocabulary.ts`: 50+ essential beginner words with English, Malayalam, phonetic text, example sentence, and category.
   - `grammar.ts`: 9 core topics with clear bilingual rules and 36+ graded exercise items.
   - `stages.ts`: 5 learning stages with structured lessons and mastery checkpoints.
   - `scenarios.ts`: 7 speaking roleplay scenarios with initial greeting, beginner hints, and context.
   - `storage.ts`: LocalStorage manager handling XP, streak calculation, levels, achievements, and settings.
3. **Core Interactive Views (`src/components/`)**:
   - `Navbar` & `Sidebar`: Responsive navigation with EN/ML toggle and XP display.
   - `OnboardingModal`: Welcome flow for name, level, and daily goal selection.
   - `HomeView`: Live daily missions, streak tracker, level progress, quick practice links.
   - `LearnView`: Interactive 5-stage roadmap with lock/unlock indicators and stage mastery quizzes.
   - `VocabularyGame`: 5 drill modes (Meaning Quiz, Word Match tiles, Missing Letters, Visual Word Picker, Audio Listen & Guess).
   - `GrammarGame`: Topic selector, interactive word-order arranger, find mistake, and Malayalam explanations.
   - `SpeakingArena`: Interactive AI chat interface with microphone input, audio playback, suggested responses, and post-session analysis report.
   - `WritingStudio`: 6 guided prompts, live character/word count, instant Gemini evaluation with score out of 100 and Malayalam translation advice.
   - `ProfileView`: Stat badges, mastery summary, speaking/writing history, and progress reset modal.
4. **Verification & Polish**:
   - Verify speech synthesis and recognition fallbacks.
   - Verify server API endpoints and error states.
   - Ensure complete responsive rendering on mobile ($375\text{px}$) and desktop ($1440\text{px}$).
   - Run compilation and linting checks.
