import { VocabItem } from '../types';

export const VOCABULARY_LIST: VocabItem[] = [
  // Greetings & Courtesies (1-8)
  {
    id: 'v1',
    word: 'Hello',
    malayalam: 'നമസ്കാരം / ഹലോ',
    phonetic: 'ഹെ-ലോ (hə-ˈlō)',
    category: 'Greetings',
    exampleEn: 'Hello, my name is Arun.',
    exampleMl: 'ഹലോ, എന്റെ പേര് അരുൺ എന്നാണ്.',
    hint: 'Used when meeting someone.',
    emoji: '👋'
  },
  {
    id: 'v2',
    word: 'Welcome',
    malayalam: 'സ്വാഗതം',
    phonetic: 'വെൽ-കം (ˈwel-kəm)',
    category: 'Greetings',
    exampleEn: 'Welcome to our home.',
    exampleMl: 'ഞങ്ങളുടെ വീട്ടിലേക്ക് സ്വാഗതം.',
    hint: 'Warmly greeting a guest.',
    emoji: '🏡'
  },
  {
    id: 'v3',
    word: 'Thank you',
    malayalam: 'നന്ദി',
    phonetic: 'താങ്ക് യു (thæŋk juː)',
    category: 'Greetings',
    exampleEn: 'Thank you for your help.',
    exampleMl: 'നിങ്ങളുടെ സഹായത്തിന് നന്ദി.',
    hint: 'Expressing gratitude.',
    emoji: '🙏'
  },
  {
    id: 'v4',
    word: 'Please',
    malayalam: 'ദയവായി',
    phonetic: 'പ്ലീസ് (pliːz)',
    category: 'Greetings',
    exampleEn: 'Please sit down.',
    exampleMl: 'ദയവായി ഇരിക്കൂ.',
    hint: 'Making a polite request.',
    emoji: '✨'
  },
  {
    id: 'v5',
    word: 'Goodbye',
    malayalam: 'പോയി വരാം / യാത്ര പറയാം',
    phonetic: 'ഗുഡ്-ബൈ (ɡʊdˈbaɪ)',
    category: 'Greetings',
    exampleEn: 'Goodbye, see you tomorrow!',
    exampleMl: 'യാത്ര പറയാം, നാളെ കാണാം!',
    hint: 'Said when departing.',
    emoji: '👋'
  },
  {
    id: 'v6',
    word: 'Sorry',
    malayalam: 'ക്ഷമിക്കണം',
    phonetic: 'സോ-റി (ˈsɒr.i)',
    category: 'Greetings',
    exampleEn: 'I am sorry for the delay.',
    exampleMl: 'വൈകിയതിന് ക്ഷമിക്കണം.',
    hint: 'Apologizing for a mistake.',
    emoji: '🙇'
  },
  {
    id: 'v7',
    word: 'Good morning',
    malayalam: 'സുപ്രഭാതം',
    phonetic: 'ഗുഡ് മോർണിംഗ് (ɡʊd ˈmɔː.nɪŋ)',
    category: 'Greetings',
    exampleEn: 'Good morning, have a nice day.',
    exampleMl: 'സുപ്രഭാതം, നല്ലൊരു ദിവസം ആശംസിക്കുന്നു.',
    hint: 'Morning greeting until noon.',
    emoji: '🌅'
  },
  {
    id: 'v8',
    word: 'Good night',
    malayalam: 'ശുഭരാത്രി',
    phonetic: 'ഗുഡ് നൈറ്റ് (ɡʊd naɪt)',
    category: 'Greetings',
    exampleEn: 'Good night and sweet dreams.',
    exampleMl: 'ശുഭരാത്രി, നല്ല സ്വപ്നങ്ങൾ കാണട്ടെ.',
    hint: 'Said before going to sleep.',
    emoji: '🌙'
  },

  // Family (9-15)
  {
    id: 'v9',
    word: 'Family',
    malayalam: 'കുടുംബം',
    phonetic: 'ഫാ-മി-ലി (ˈfæm.əl.i)',
    category: 'Family',
    exampleEn: 'I love my family.',
    exampleMl: 'ഞാൻ എന്റെ കുടുംബത്തെ സ്നേഹിക്കുന്നു.',
    hint: 'Parents and children together.',
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: 'v10',
    word: 'Father',
    malayalam: 'അച്ഛൻ',
    phonetic: 'ഫാ-ദർ (ˈfɑː.ðər)',
    category: 'Family',
    exampleEn: 'My father works in a bank.',
    exampleMl: 'എന്റെ അച്ഛൻ ബാങ്കിൽ ജോലി ചെയ്യുന്നു.',
    hint: 'Male parent.',
    emoji: '👨'
  },
  {
    id: 'v11',
    word: 'Mother',
    malayalam: 'അമ്മ',
    phonetic: 'മ-ദർ (ˈmʌð.ər)',
    category: 'Family',
    exampleEn: 'My mother is a good cook.',
    exampleMl: 'എന്റെ അമ്മ നല്ലൊരു പാചകക്കാരിയാണ്.',
    hint: 'Female parent.',
    emoji: '👩'
  },
  {
    id: 'v12',
    word: 'Brother',
    malayalam: 'സഹോദരൻ (ആൺ)',
    phonetic: 'ബ്ര-ദർ (ˈbrʌð.ər)',
    category: 'Family',
    exampleEn: 'My brother plays football.',
    exampleMl: 'എന്റെ സഹോദരൻ ഫുട്ബോൾ കളിക്കുന്നു.',
    hint: 'Male sibling.',
    emoji: '👦'
  },
  {
    id: 'v13',
    word: 'Sister',
    malayalam: 'സഹോദരി (പെൺ)',
    phonetic: 'സിസ്-റ്റർ (ˈsɪs.tər)',
    category: 'Family',
    exampleEn: 'My sister is reading a book.',
    exampleMl: 'എന്റെ സഹോദരി പുസ്തകം വായിക്കുന്നു.',
    hint: 'Female sibling.',
    emoji: '👧'
  },
  {
    id: 'v14',
    word: 'Friend',
    malayalam: 'സുഹൃത്ത് / ചങ്ങാതി',
    phonetic: 'ഫ്രെൻഡ് (frend)',
    category: 'Family',
    exampleEn: 'Manoj is my best friend.',
    exampleMl: 'മനോജ് എന്റെ ഉത്തമ സുഹൃത്താണ്.',
    hint: 'A close companion.',
    emoji: '🤝'
  },
  {
    id: 'v15',
    word: 'Child',
    malayalam: 'കുട്ടി',
    phonetic: 'ചൈൽഡ് (tʃaɪld)',
    category: 'Family',
    exampleEn: 'The child is smiling.',
    exampleMl: 'കുട്ടി പുഞ്ചിരിക്കുന്നു.',
    hint: 'A young boy or girl.',
    emoji: '👶'
  },

  // Daily Life & Home (16-24)
  {
    id: 'v16',
    word: 'House',
    malayalam: 'വീട്',
    phonetic: 'ഹൗസ് (haʊs)',
    category: 'Daily Life',
    exampleEn: 'Our house is near the lake.',
    exampleMl: 'ഞങ്ങളുടെ വീട് കായലിനടുത്താണ്.',
    hint: 'A building where people live.',
    emoji: '🏠'
  },
  {
    id: 'v17',
    word: 'Book',
    malayalam: 'പുസ്തകം',
    phonetic: 'ബുക്ക് (bʊk)',
    category: 'Daily Life',
    exampleEn: 'I bought a new English book.',
    exampleMl: 'ഞാൻ പുതിയൊരു ഇംഗ്ലീഷ് പുസ്തകം വാങ്ങി.',
    hint: 'Pages bound together for reading.',
    emoji: '📖'
  },
  {
    id: 'v18',
    word: 'Pen',
    malayalam: 'പേന',
    phonetic: 'പെൻ (pen)',
    category: 'Daily Life',
    exampleEn: 'Can I borrow your blue pen?',
    exampleMl: 'നിങ്ങളുടെ നീല പേന എനിക്ക് തരാമോ?',
    hint: 'Tool used for writing.',
    emoji: '🖊️'
  },
  {
    id: 'v19',
    word: 'Water',
    malayalam: 'വെള്ളം',
    phonetic: 'വാ-റ്റർ (ˈwɔː.tər)',
    category: 'Food',
    exampleEn: 'Drink plenty of water every day.',
    exampleMl: 'ദിവസവും ധാരാളം വെള്ളം കുടിക്കുക.',
    hint: 'Clear liquid essential for life.',
    emoji: '💧'
  },
  {
    id: 'v20',
    word: 'Tea',
    malayalam: 'ചായ',
    phonetic: 'ടീ (tiː)',
    category: 'Food',
    exampleEn: 'I drink hot tea in the morning.',
    exampleMl: 'ഞാൻ രാവിലെ ചൂടുള്ള ചായ കുടിക്കുന്നു.',
    hint: 'Popular hot beverage.',
    emoji: '☕'
  },
  {
    id: 'v21',
    word: 'Food',
    malayalam: 'ഭക്ഷണം',
    phonetic: 'ഫുഡ് (fuːd)',
    category: 'Food',
    exampleEn: 'Kerala food is very delicious.',
    exampleMl: 'കേരളത്തിലെ ഭക്ഷണം വളരെ രുചികരമാണ്.',
    hint: 'What people eat to live.',
    emoji: '🍛'
  },
  {
    id: 'v22',
    word: 'Rice',
    malayalam: 'ചോറ് / അരി',
    phonetic: 'റൈസ് (raɪs)',
    category: 'Food',
    exampleEn: 'We eat rice for lunch.',
    exampleMl: 'ഞങ്ങൾ ഉച്ചഭക്ഷണത്തിന് ചോറ് കഴിക്കുന്നു.',
    hint: 'Staple grain in South India.',
    emoji: '🍚'
  },
  {
    id: 'v23',
    word: 'Time',
    malayalam: 'സമയം',
    phonetic: 'ടൈം (taɪm)',
    category: 'Daily Life',
    exampleEn: 'What time is it now?',
    exampleMl: 'ഇപ്പോൾ സമയം എത്രയായി?',
    hint: 'Measured in minutes and hours.',
    emoji: '⏰'
  },
  {
    id: 'v24',
    word: 'Money',
    malayalam: 'പണം / കാശ്',
    phonetic: 'മ-ണി (ˈmʌn.i)',
    category: 'Daily Life',
    exampleEn: 'Save some money for the future.',
    exampleMl: 'ഭാവിയിലേക്ക് കുറച്ചു പണം മിച്ചം വെയ്ക്കൂ.',
    hint: 'Used for buying goods.',
    emoji: '💵'
  },

  // Places (25-30)
  {
    id: 'v25',
    word: 'School',
    malayalam: 'സ്കൂൾ / വിദ്യാലയം',
    phonetic: 'സ്കൂൾ (skuːl)',
    category: 'Places',
    exampleEn: 'The children walk to school.',
    exampleMl: 'കുട്ടികൾ സ്കൂളിലേക്ക് നടക്കുന്നു.',
    hint: 'Place for learning.',
    emoji: '🏫'
  },
  {
    id: 'v26',
    word: 'College',
    malayalam: 'കോളേജ് / കലാലയം',
    phonetic: 'കോ-ളേജ് (ˈkɒl.ɪdʒ)',
    category: 'Places',
    exampleEn: 'She studies science at college.',
    exampleMl: 'അവൾ കോളേജിൽ സയൻസ് പഠിക്കുന്നു.',
    hint: 'Higher education institution.',
    emoji: '🎓'
  },
  {
    id: 'v27',
    word: 'Hospital',
    malayalam: 'ആശുപത്രി',
    phonetic: 'ഹോസ്-പി-റ്റൽ (ˈhɒs.pɪ.təl)',
    category: 'Places',
    exampleEn: 'The doctor works in a hospital.',
    exampleMl: 'ഡോക്ടർ ആശുപത്രിയിൽ ജോലി ചെയ്യുന്നു.',
    hint: 'Place where sick people are treated.',
    emoji: '🏥'
  },
  {
    id: 'v28',
    word: 'Market',
    malayalam: 'ചന്ത / കമ്പോളം',
    phonetic: 'മാർ-ക്കറ്റ് (ˈmɑː.kɪt)',
    category: 'Places',
    exampleEn: 'We buy fresh vegetables at the market.',
    exampleMl: 'ഞങ്ങൾ ചന്തയിൽ നിന്ന് പുതിയ പച്ചക്കറികൾ വാങ്ങുന്നു.',
    hint: 'Place to buy groceries.',
    emoji: '🛒'
  },
  {
    id: 'v29',
    word: 'Bus stop',
    malayalam: 'ബസ് സ്റ്റോപ്പ്',
    phonetic: 'ബസ് സ്റ്റോപ്പ് (bʌs stɒp)',
    category: 'Travel',
    exampleEn: 'Wait for me at the bus stop.',
    exampleMl: 'ബസ് സ്റ്റോപ്പിൽ എന്നെ കാത്തിരിക്കൂ.',
    hint: 'Where passengers board buses.',
    emoji: '🚏'
  },
  {
    id: 'v30',
    word: 'Road',
    malayalam: 'വഴി / റോഡ്',
    phonetic: 'റോഡ് (rəʊd)',
    category: 'Travel',
    exampleEn: 'Be careful while crossing the road.',
    exampleMl: 'റോഡ് മുറിച്ചുകടക്കുമ്പോൾ ശ്രദ്ധിക്കുക.',
    hint: 'Paved path for vehicles.',
    emoji: '🛣️'
  },

  // Common Verbs / Actions (31-42)
  {
    id: 'v31',
    word: 'Speak',
    malayalam: 'സംസാരിക്കുക',
    phonetic: 'സ്പീക്ക് (spiːk)',
    category: 'Actions',
    exampleEn: 'I want to speak English fluently.',
    exampleMl: 'എനിക്ക് നന്നായി ഇംഗ്ലീഷ് സംസാരിക്കണം.',
    hint: 'Using voice to say words.',
    emoji: '🗣️'
  },
  {
    id: 'v32',
    word: 'Listen',
    malayalam: 'കേൾക്കുക / ശ്രദ്ധിക്കുക',
    phonetic: 'ലി-സൺ (ˈlɪs.ən)',
    category: 'Actions',
    exampleEn: 'Listen to the teacher carefully.',
    exampleMl: 'അധ്യാപകനെ ശ്രദ്ധയോടെ കേൾക്കുക.',
    hint: 'Paying attention to sounds.',
    emoji: '👂'
  },
  {
    id: 'v33',
    word: 'Read',
    malayalam: 'വായിക്കുക',
    phonetic: 'റീഡ് (riːd)',
    category: 'Actions',
    exampleEn: 'I read the newspaper every morning.',
    exampleMl: 'ഞാൻ എല്ലാ ദിവസവും രാവിലെ പത്രം വായിക്കുന്നു.',
    hint: 'Looking at written words.',
    emoji: '📰'
  },
  {
    id: 'v34',
    word: 'Write',
    malayalam: 'എഴുതുക',
    phonetic: 'റൈറ്റ് (raɪt)',
    category: 'Actions',
    exampleEn: 'Write your address on the form.',
    exampleMl: 'ഫോമിൽ നിങ്ങളുടെ മേൽവിലാസം എഴുതുക.',
    hint: 'Marking letters on paper or screen.',
    emoji: '✍️'
  },
  {
    id: 'v35',
    word: 'Learn',
    malayalam: 'പഠിക്കുക',
    phonetic: 'ലേൺ (lɜːn)',
    category: 'Actions',
    exampleEn: 'We learn new words every day.',
    exampleMl: 'ഞങ്ങൾ ദിവസവും പുതിയ വാക്കുകൾ പഠിക്കുന്നു.',
    hint: 'Gaining new knowledge.',
    emoji: '🧠'
  },
  {
    id: 'v36',
    word: 'Eat',
    malayalam: 'കഴിക്കുക / തിന്നുക',
    phonetic: 'ഈറ്റ് (iːt)',
    category: 'Actions',
    exampleEn: 'Eat fresh fruits for good health.',
    exampleMl: 'നല്ല ആരോഗ്യത്തിനായി പഴങ്ങൾ കഴിക്കുക.',
    hint: 'Consuming food.',
    emoji: '🍎'
  },
  {
    id: 'v37',
    word: 'Drink',
    malayalam: 'കുടിക്കുക',
    phonetic: 'ഡ്രിങ്ക് (drɪŋk)',
    category: 'Actions',
    exampleEn: 'Drink warm water with honey.',
    exampleMl: 'തേൻ ചേർത്ത ചെറുചൂടുവെള്ളം കുടിക്കുക.',
    hint: 'Swallowing liquid.',
    emoji: '🥛'
  },
  {
    id: 'v38',
    word: 'Go',
    malayalam: 'പോകുക',
    phonetic: 'ഗോ (ɡəʊ)',
    category: 'Actions',
    exampleEn: 'I go to work at eight o’clock.',
    exampleMl: 'ഞാൻ എട്ടുമണിക്ക് ജോലിക്ക് പോകുന്നു.',
    hint: 'Moving from one place to another.',
    emoji: '🚶'
  },
  {
    id: 'v39',
    word: 'Come',
    malayalam: 'വരുക',
    phonetic: 'കം (kʌm)',
    category: 'Actions',
    exampleEn: 'Come here and look at this.',
    exampleMl: 'ഇവിടെ വന്ന് ഇത് കാണൂ.',
    hint: 'Moving towards the speaker.',
    emoji: '🏃'
  },
  {
    id: 'v40',
    word: 'Help',
    malayalam: 'സഹായിക്കുക',
    phonetic: 'ഹെൽപ് (help)',
    category: 'Actions',
    exampleEn: 'Can you help me with this bag?',
    exampleMl: 'ഈ ബാഗ് എടുക്കാൻ എന്നെ സഹായിക്കാമോ?',
    hint: 'Assisting someone in need.',
    emoji: '🆘'
  },
  {
    id: 'v41',
    word: 'Work',
    malayalam: 'ജോലി ചെയ്യുക',
    phonetic: 'വർക്ക് (wɜːk)',
    category: 'Actions',
    exampleEn: 'They work hard every day.',
    exampleMl: 'അവർ ദിവസവും കഠിനാധ്വാനം ചെയ്യുന്നു.',
    hint: 'Activity involving effort.',
    emoji: '💼'
  },
  {
    id: 'v42',
    word: 'Sleep',
    malayalam: 'ഉറങ്ങുക',
    phonetic: 'സ്ലീപ്പ് (sliːp)',
    category: 'Actions',
    exampleEn: 'Try to sleep for seven hours.',
    exampleMl: 'ഏഴ് മണിക്കൂർ ഉറങ്ങാൻ ശ്രമിക്കുക.',
    hint: 'Resting with eyes closed.',
    emoji: '😴'
  },

  // Emotions & Descriptors (43-52)
  {
    id: 'v43',
    word: 'Happy',
    malayalam: 'സന്തോഷമുള്ള',
    phonetic: 'ഹാ-പ്പി (ˈhæp.i)',
    category: 'Emotions',
    exampleEn: 'I am very happy to see you.',
    exampleMl: 'നിങ്ങളെ കണ്ടതിൽ എനിക്ക് വളരെ സന്തോഷമുണ്ട്.',
    hint: 'Feeling joy and pleasure.',
    emoji: '😊'
  },
  {
    id: 'v44',
    word: 'Sad',
    malayalam: 'സങ്കടമുള്ള / ദുഃഖിതനായ',
    phonetic: 'സാഡ് (sæd)',
    category: 'Emotions',
    exampleEn: 'Do not be sad, everything will be fine.',
    exampleMl: 'സങ്കടപ്പെടേണ്ട, എല്ലാം ശരിയാകും.',
    hint: 'Feeling sorrow or unhappy.',
    emoji: '😢'
  },
  {
    id: 'v45',
    word: 'Tired',
    malayalam: 'ക്ഷീണിതനായ',
    phonetic: 'ടയേർഡ് (taɪəd)',
    category: 'Emotions',
    exampleEn: 'I am tired after the long journey.',
    exampleMl: 'നീണ്ട യാത്രയ്ക്ക് ശേഷം ഞാൻ ക്ഷീണിതനാണ്.',
    hint: 'Needing rest or sleep.',
    emoji: '🥱'
  },
  {
    id: 'v46',
    word: 'Good',
    malayalam: 'നല്ല / കൊള്ളാം',
    phonetic: 'ഗുഡ് (ɡʊd)',
    category: 'Emotions',
    exampleEn: 'This is a very good idea.',
    exampleMl: 'ഇത് വളരെ നല്ലൊരു ആശയമാണ്.',
    hint: 'High quality or positive.',
    emoji: '👍'
  },
  {
    id: 'v47',
    word: 'Big',
    malayalam: 'വലിയ',
    phonetic: 'ബിഗ് (bɪɡ)',
    category: 'Daily Life',
    exampleEn: 'Kochi is a big city in Kerala.',
    exampleMl: 'കൊച്ചി കേരളത്തിലെ ഒരു വലിയ നഗരമാണ്.',
    hint: 'Of large size.',
    emoji: '🐘'
  },
  {
    id: 'v48',
    word: 'Small',
    malayalam: 'ചെറിയ',
    phonetic: 'സ്മോൾ (smɔːl)',
    category: 'Daily Life',
    exampleEn: 'He lives in a small village.',
    exampleMl: 'അവൻ ഒരു ചെറിയ ഗ്രാമത്തിലാണ് താമസിക്കുന്നത്.',
    hint: 'Little in size.',
    emoji: '🐁'
  },
  {
    id: 'v49',
    word: 'Today',
    malayalam: 'ഇന്ന്',
    phonetic: 'ടു-ഡേ (təˈdeɪ)',
    category: 'Daily Life',
    exampleEn: 'Today is Sunday.',
    exampleMl: 'ഇന്ന് ഞായറാഴ്ചയാണ്.',
    hint: 'The present day.',
    emoji: '📅'
  },
  {
    id: 'v50',
    word: 'Tomorrow',
    malayalam: 'നാളെ',
    phonetic: 'ടു-മോ-റോ (təˈmɒr.əʊ)',
    category: 'Daily Life',
    exampleEn: 'We have a meeting tomorrow.',
    exampleMl: 'നാളെ നമുക്ക് ഒരു യോഗമുണ്ട്.',
    hint: 'The day after today.',
    emoji: '🌅'
  },
  {
    id: 'v51',
    word: 'Yesterday',
    malayalam: 'ഇന്നലെ',
    phonetic: 'യെസ്-റ്റർ-ഡേ (ˈjes.tə.deɪ)',
    category: 'Daily Life',
    exampleEn: 'It rained heavily yesterday.',
    exampleMl: 'ഇന്നലെ നല്ല മഴ പെയ്തു.',
    hint: 'The day before today.',
    emoji: '🌧️'
  },
  {
    id: 'v52',
    word: 'Now',
    malayalam: 'ഇപ്പോൾ',
    phonetic: 'നൗ (naʊ)',
    category: 'Daily Life',
    exampleEn: 'I am ready to start now.',
    exampleMl: 'ഞാൻ ഇപ്പോൾ തുടങ്ങാൻ തയ്യാറാണ്.',
    hint: 'At this present moment.',
    emoji: '⏱️'
  }
];
