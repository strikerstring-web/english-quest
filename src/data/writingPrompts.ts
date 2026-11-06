import { WritingPrompt } from '../types';

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'simple_sentence',
    titleEn: '1. Write a Simple Sentence',
    titleMl: '1. ലളിതമായ ഒരു വാക്യം എഴുതുക',
    descriptionEn: 'Write one clear English sentence about yourself, your favorite food, or what you like to do.',
    descriptionMl: 'നിങ്ങളെക്കുറിച്ചോ, പ്രിയപ്പെട്ട ഭക്ഷണത്തെക്കുറിച്ചോ, ഇഷ്ടങ്ങളെക്കുറിച്ചോ ഒരു ലളിതമായ ഇംഗ്ലീഷ് വാക്യം എഴുതുക.',
    starterSentenceEn: 'I like to ...',
    starterSentenceMl: 'എനിക്ക് ... ഇഷ്ടമാണ്',
    suggestedKeywords: [
      { en: 'like', ml: 'ഇഷ്ടപ്പെടുന്നു' },
      { en: 'play', ml: 'കളിക്കുന്നു' },
      { en: 'read', ml: 'വായിക്കുന്നു' },
      { en: 'delicious', ml: 'രുചികരമായ' }
    ],
    minWords: 4,
    targetWords: 10,
    malayalamGuidance: 'വാക്യം തുടങ്ങുമ്പോൾ ആദ്യ അക്ഷരം ക്യാപിറ്റൽ (Capital letter) ആകണം. അവസാനം ഒരു ഫുൾസ്റ്റോപ്പ് (.) നൽകാൻ മറക്കരുത്.'
  },
  {
    id: 'translate_ml_to_en',
    titleEn: '2. Translate Malayalam to English',
    titleMl: '2. മലയാളം വാക്യം ഇംഗ്ലീഷിലേക്ക് മാറ്റുക',
    descriptionEn: 'Translate this Malayalam sentence into English: "ഞാൻ ദിവസവും രാവിലെ ചായ കുടിക്കുന്നു."',
    descriptionMl: 'ഈ വാക്യം ഇംഗ്ലീഷിലേക്ക് തർജ്ജമ ചെയ്യുക: "ഞാൻ ദിവസവും രാവിലെ ചായ കുടിക്കുന്നു."',
    starterSentenceEn: 'I drink ...',
    starterSentenceMl: 'ഞാൻ കുടിക്കുന്നു ...',
    suggestedKeywords: [
      { en: 'drink', ml: 'കുടിക്കുന്നു' },
      { en: 'tea', ml: 'ചായ' },
      { en: 'morning', ml: 'രാവിലെ' },
      { en: 'every day', ml: 'ദിവസവും' }
    ],
    minWords: 5,
    targetWords: 8,
    malayalamGuidance: 'കർത്താവ് (I) + ക്രിയ (drink) + കർമ്മം (tea) എന്ന ക്രമത്തിൽ എഴുതുക: "I drink tea every morning."'
  },
  {
    id: 'describe_picture',
    titleEn: '3. Describe a Picture / Scene',
    titleMl: '3. ചിത്രം അല്ലെങ്കിൽ രംഗം വിവരിക്കുക',
    descriptionEn: 'Imagine children playing football in a lush green Kerala village ground on a sunny evening. Write 2-3 sentences describing this scene.',
    descriptionMl: 'വൈകുന്നേരം ഒരു ഗ്രാമീണ കളിസ്ഥലത്ത് കുട്ടികൾ ഫുട്ബോൾ കളിക്കുന്ന രംഗം 2-3 വാക്യങ്ങളിൽ ഇംഗ്ലീഷിൽ വിവരിക്കുക.',
    starterSentenceEn: 'The children are ...',
    starterSentenceMl: 'കുട്ടികൾ ...',
    suggestedKeywords: [
      { en: 'children', ml: 'കുട്ടികൾ' },
      { en: 'playing', ml: 'കളിച്ചുകൊണ്ടിരിക്കുന്നു' },
      { en: 'ground', ml: 'കളിക്കളം' },
      { en: 'happy', ml: 'സന്തോഷത്തോടെ' },
      { en: 'evening', ml: 'വൈകുന്നേരം' }
    ],
    minWords: 10,
    targetWords: 20,
    malayalamGuidance: 'ആളുകൾ എന്ത് ചെയ്യുന്നു (They are playing...), ചുറ്റുപാട് എങ്ങനെയുണ്ട് (It is a green field...) എന്നിങ്ങനെ ഘട്ടം ഘട്ടമായി എഴുതുക.'
  },
  {
    id: 'daily_routine',
    titleEn: '4. Write About Your Daily Routine',
    titleMl: '4. നിങ്ങളുടെ ദിനചര്യ എഴുതുക',
    descriptionEn: 'Write 3 to 4 sentences describing your everyday routine from morning to night.',
    descriptionMl: 'രാവിലെ ഉണരുന്നത് മുതൽ രാത്രി ഉറങ്ങുന്നത് വരെയുള്ള നിങ്ങളുടെ ദിനചര്യകൾ 3-4 വാക്യങ്ങളിൽ എഴുതുക.',
    starterSentenceEn: 'I wake up at ...',
    starterSentenceMl: 'ഞാൻ ... മണിക്കാണ് ഉണരുന്നത്',
    suggestedKeywords: [
      { en: 'wake up', ml: 'ഉണരുന്നു' },
      { en: 'breakfast', ml: 'പ്രഭാതഭക്ഷണം' },
      { en: 'study / work', ml: 'പഠിക്കുന്നു / ജോലി ചെയ്യുന്നു' },
      { en: 'evening', ml: 'വൈകുന്നേരം' },
      { en: 'sleep', ml: 'ഉറങ്ങുന്നു' }
    ],
    minWords: 15,
    targetWords: 30,
    malayalamGuidance: 'Simple Present Tense ഉപയോഗിക്കുക (I wake up, I drink, I go). കാലയളവുകൾക്ക് First, Then, After that എന്നീ വാക്കുകൾ ഉപയോഗിക്കാം.'
  },
  {
    id: 'short_paragraph',
    titleEn: '5. Write a Short Paragraph',
    titleMl: '5. ലഘു ഖണ്ഡിക എഴുതുക',
    descriptionEn: 'Write a short paragraph (4-5 sentences) on the topic: "My Hometown (എന്റെ നാട്)" or "My Best Friend (എന്റെ സുഹൃത്ത്)".',
    descriptionMl: '"എന്റെ നാട്" അല്ലെങ്കിൽ "എന്റെ ഉത്തമ സുഹൃത്ത്" എന്ന വിഷയത്തിൽ 4-5 വാക്യങ്ങൾ അടങ്ങിയ ലളിതമായ ഒരു ഖണ്ഡിക എഴുതുക.',
    starterSentenceEn: 'My hometown is ...',
    starterSentenceMl: 'എന്റെ നാട് ...',
    suggestedKeywords: [
      { en: 'beautiful', ml: 'മനോഹരമായ' },
      { en: 'people', ml: 'ആളുകൾ' },
      { en: 'friendly', ml: 'സൗഹൃദപരമായ' },
      { en: 'places', ml: 'സ്ഥലങ്ങൾ' },
      { en: 'special', ml: 'പ്രത്യേകതയുള്ള' }
    ],
    minWords: 20,
    targetWords: 40,
    malayalamGuidance: 'തുടക്കത്തിൽ വിഷയം വ്യക്തമാക്കുക, രണ്ടാമതായി സവിശേഷതകൾ പറയുക, അവസാനം നിങ്ങളുടെ അഭിപ്രായം എഴുതി പൂർത്തിയാക്കുക.'
  },
  {
    id: 'friend_message',
    titleEn: '6. Write a Message to a Friend',
    titleMl: '6. സുഹൃത്തിന് ഒരു സന്ദേശം അയക്കുക',
    descriptionEn: 'Write a friendly WhatsApp/chat message inviting your friend to meet you this Sunday for evening tea and snacks.',
    descriptionMl: 'ഈ ഞായറാഴ്ച വൈകുന്നേരം ചായ കുടിക്കാൻ കാണാമോ എന്ന് ചോദിച്ച് സുഹൃത്തിന് അയക്കാവുന്ന സൗഹൃദ സന്ദേശം എഴുതുക.',
    starterSentenceEn: 'Hi [Friend Name], are you free ...',
    starterSentenceMl: 'ഹായ്, നിനക്ക് ഒഴിവുണ്ടോ ...',
    suggestedKeywords: [
      { en: 'Sunday', ml: 'ഞായറാഴ്ച' },
      { en: 'free', ml: 'ഒഴിവ്' },
      { en: 'meet', ml: 'കണ്ടുമുട്ടുക' },
      { en: 'tea', ml: 'ചായ' },
      { en: 'let me know', ml: 'മറുപടി അറിയിക്കുക' }
    ],
    minWords: 15,
    targetWords: 30,
    malayalamGuidance: 'അഭിവാദ്യത്തോടെ തുടങ്ങുക (Hi Manoj), കാര്യം പറയുക (Would you like to meet this Sunday?), അവസാനം ആശംസ നൽകുക (Let me know!).'
  }
];
