import { LearningStage } from '../types';

export const LEARNING_STAGES: LearningStage[] = [
  {
    id: 1,
    titleEn: 'Stage 1: English Foundations',
    titleMl: 'ഘട്ടം 1: ഇംഗ്ലീഷ് അടിത്തറ (English Foundations)',
    descriptionEn: 'Alphabet sounds, everyday greetings, simple nouns, and numbers for beginners.',
    descriptionMl: 'അക്ഷരങ്ങളുടെ ശരിയായ ഉച്ചാരണം, അഭിവാദ്യങ്ങൾ, നിത്യജീവിതത്തിലെ ലളിതമായ വാക്കുകൾ.',
    lessons: [
      {
        id: 's1_l1',
        titleEn: 'Everyday Greetings & Politeness',
        titleMl: 'നിത്യജീവിതത്തിലെ അഭിവാദ്യങ്ങൾ',
        summaryEn: 'Learn how to greet people at different times of the day and express politeness.',
        summaryMl: 'വ്യത്യസ്ത സമയങ്ങളിൽ ആളുകളെ അഭിവാദ്യം ചെയ്യാനും നന്ദി പ്രകടിപ്പിക്കാനും പഠിക്കാം.',
        contentPoints: [
          { en: 'Good morning (until 12 PM)', ml: 'സുപ്രഭാതം (ഉച്ചയ്ക്ക് 12 മണി വരെ)', example: 'Good morning, sir!' },
          { en: 'Good afternoon (12 PM to 5 PM)', ml: 'ശുഭ മധ്യാഹ്നം (ഉച്ചയ്ക്ക് 12 മുതൽ 5 വരെ)', example: 'Good afternoon, friends.' },
          { en: 'Good evening (after 5 PM)', ml: 'ശുഭ സായാഹ്നം (വൈകുന്നേരം 5 മണിക്ക് ശേഷം)', example: 'Good evening, everyone.' },
          { en: 'Please & Thank you', ml: 'ദയവായി & നന്ദി (മര്യാദയുള്ള സംസാരത്തിന്)', example: 'Please help me. Thank you!' }
        ],
        quiz: [
          {
            questionEn: 'What do you say to greet someone at 9:00 AM?',
            questionMl: 'രാവിലെ 9 മണിക്ക് ഒരാളെ കാണുമ്പോൾ എന്ത് പറയണം?',
            options: ['Good morning', 'Good afternoon', 'Good night', 'Goodbye'],
            correctIndex: 0,
            explanationMl: 'ഉച്ചയ്ക്ക് 12 മണിക്ക് മുൻപുള്ള സമയത്ത് "Good morning" എന്നാണ് പറയുന്നത്.'
          },
          {
            questionEn: 'Which word is used to express gratitude politely?',
            questionMl: 'നന്ദി രേഖപ്പെടുത്താൻ ഏത് വാക്കാണ് ഉപയോഗിക്കുന്നത്?',
            options: ['Sorry', 'Thank you', 'Please', 'Welcome'],
            correctIndex: 1,
            explanationMl: 'നന്ദി അറിയിക്കാൻ "Thank you" എന്ന് പറയുന്നു.'
          }
        ]
      },
      {
        id: 's1_l2',
        titleEn: 'Self-Introduction Basics',
        titleMl: 'സ്വയം പരിചയപ്പെടുത്തൽ',
        summaryEn: 'Saying your name, where you live, and what you do.',
        summaryMl: 'നിങ്ങളുടെ പേര്, സ്ഥലം, ജോലി എന്നിവ ലളിതമായി ഇംഗ്ലീഷിൽ പറയാം.',
        contentPoints: [
          { en: 'My name is [Name]', ml: 'എന്റെ പേര് [പേര്] എന്നാണ്', example: 'My name is Anoop.' },
          { en: 'I am from [Place]', ml: 'ഞാൻ [സ്ഥലം] നിന്നാണ് വരുന്നത്', example: 'I am from Thrissur.' },
          { en: 'I am a [Student / Teacher / Engineer]', ml: 'ഞാൻ ഒരു [വിദ്യാർത്ഥി / അധ്യാപകൻ / എഞ്ചിനീയർ] ആണ്', example: 'I am a student.' }
        ],
        quiz: [
          {
            questionEn: 'How do you say "എന്റെ പേര് രാജേഷ് എന്നാണ്" in English?',
            questionMl: '"എന്റെ പേര് രാജേഷ് എന്നാണ്" എന്നത് എങ്ങനെ ഇംഗ്ലീഷിൽ പറയും?',
            options: ['My name is Rajesh', 'I name Rajesh', 'Rajesh is my', 'Me is Rajesh'],
            correctIndex: 0,
            explanationMl: 'ശരിയായ രൂപം "My name is Rajesh" എന്നാണ്.'
          },
          {
            questionEn: 'Choose the correct way to say you are from Kerala:',
            questionMl: 'നിങ്ങൾ കേരളത്തിൽ നിന്നാണെന്ന് എങ്ങനെ ശരിയായി പറയും?',
            options: ['I am from Kerala', 'I from is Kerala', 'Kerala from me', 'Me are Kerala'],
            correctIndex: 0,
            explanationMl: '"I am from Kerala" എന്നാണ് ശരിയായ വാക്യം.'
          }
        ]
      }
    ]
  },

  {
    id: 2,
    titleEn: 'Stage 2: Basic Sentence Building',
    titleMl: 'ഘട്ടം 2: ലളിത വാക്യ നിർമ്മാണം (Sentence Building)',
    descriptionEn: 'Master pronouns, "am/is/are", articles, and singular/plural nouns.',
    descriptionMl: 'സർവ്വനാമങ്ങളും, "am/is/are" രൂപങ്ങളും, ആർട്ടിക്കിളുകളും ചേർത്ത് വാക്യങ്ങൾ ഉണ്ടാക്കാം.',
    lessons: [
      {
        id: 's2_l1',
        titleEn: 'Subject-Verb Pairing (Am, Is, Are)',
        titleMl: 'കർത്താവും ക്രിയയും ചേർക്കൽ',
        summaryEn: 'Never mix up "am", "is", and "are" again.',
        summaryMl: 'ആരാണ് ചെയ്യുന്നതെന്ന് അനുസരിച്ച് ക്രിയാരൂപം ശരിയായി ഉപയോഗിക്കുക.',
        contentPoints: [
          { en: 'I am ...', ml: 'ഞാൻ ... ആകുന്നു', example: 'I am ready.' },
          { en: 'He / She / It is ...', ml: 'അവൻ / അവൾ / അത് ... ആകുന്നു', example: 'He is kind. She is smart.' },
          { en: 'You / We / They are ...', ml: 'നിങ്ങൾ / ഞങ്ങൾ / അവർ ... ആകുന്നു', example: 'They are happy.' }
        ],
        quiz: [
          {
            questionEn: 'Choose the correct sentence:',
            questionMl: 'ശരിയായ വാക്യം തിരഞ്ഞെടുക്കുക:',
            options: ['She is happy', 'She am happy', 'She are happy', 'She be happy'],
            correctIndex: 0,
            explanationMl: '"She" ഏകവചനമായതിനാൽ "is" ഉപയോഗിക്കുന്നു: "She is happy".'
          },
          {
            questionEn: '"ഞങ്ങൾ വിദ്യാർത്ഥികളാണ്" in English:',
            questionMl: '"ഞങ്ങൾ വിദ്യാർത്ഥികളാണ്" എന്നത് ഇംഗ്ലീഷിൽ:',
            options: ['We are students', 'We is students', 'We am students', 'We be student'],
            correctIndex: 0,
            explanationMl: '"We" ബഹുവചനമായതിനാൽ "are" വരുന്നു.'
          }
        ]
      },
      {
        id: 's2_l2',
        titleEn: 'A vs An Magic Rule',
        titleMl: 'A, An എന്നിവ എപ്പോൾ ഉപയോഗിക്കണം',
        summaryEn: 'Sound rule: Vowel sounds get "an", consonant sounds get "a".',
        summaryMl: 'സ്വര ശബ്ദങ്ങൾക്ക് മുൻപിൽ "an", വ്യഞ്ജന ശബ്ദങ്ങൾക്ക് മുൻപിൽ "a".',
        contentPoints: [
          { en: 'an apple, an orange, an ice cream', ml: 'സ്വര ശബ്ദത്തിൽ തുടങ്ങുന്ന വാക്കുകൾക്ക് മുൻപിൽ "an"', example: 'I eat an orange.' },
          { en: 'a car, a house, a friend', ml: 'വ്യഞ്ജന ശബ്ദത്തിൽ തുടങ്ങുന്ന വാക്കുകൾക്ക് മുൻപിൽ "a"', example: 'He has a car.' }
        ],
        quiz: [
          {
            questionEn: 'Which is correct before "elephant"?',
            questionMl: '"Elephant" എന്നതിന് മുൻപിൽ ഏതാണ് വരുന്നത്?',
            options: ['an elephant', 'a elephant', 'the elephant only', 'none'],
            correctIndex: 0,
            explanationMl: '"Elephant" സ്വര ശബ്ദത്തിൽ തുടങ്ങുന്നതിനാൽ "an" ഉപയോഗിക്കുന്നു.'
          }
        ]
      }
    ]
  },

  {
    id: 3,
    titleEn: 'Stage 3: Everyday Conversations',
    titleMl: 'ഘട്ടം 3: നിത്യജീവിത സംഭാഷണങ്ങൾ (Everyday Conversations)',
    descriptionEn: 'Essential phrases for family, college, shopping, and asking directions.',
    descriptionMl: 'കടയിൽ പോകുമ്പോഴും, കോളേജിലും, വഴി ചോദിക്കുമ്പോഴും പറയാവുന്ന സംഭാഷണങ്ങൾ.',
    lessons: [
      {
        id: 's3_l1',
        titleEn: 'Shopping & Asking Prices',
        titleMl: 'സാധനങ്ങൾ വാങ്ങലും വില ചോദിക്കലും',
        summaryEn: 'How to ask prices, sizes, and pay for goods in shops.',
        summaryMl: 'കടകളിൽ പോയി സാധനങ്ങളുടെ വില ചോദിക്കാനും വാങ്ങാനും പഠിക്കാം.',
        contentPoints: [
          { en: 'How much is this?', ml: 'ഇതിന് എത്രയാണ് വില?', example: 'How much is this shirt?' },
          { en: 'Do you have this in a smaller size?', ml: 'ഇതിന്റെ ചെറിയ അളവ് ഉണ്ടോ?', example: 'Do you have medium size?' },
          { en: 'Can I pay by card or UPI?', ml: 'എനിക്ക് കാർഡിലൂടെയോ UPI വഴിയോ പണം നൽകാൻ പറ്റുമോ?', example: 'Do you accept GPay?' }
        ],
        quiz: [
          {
            questionEn: 'How do you ask "ഇതിന് എത്ര രൂപയാണ്?" in English?',
            questionMl: '"ഇതിന് എത്ര രൂപയാണ്?" എന്ന് എങ്ങനെ ഇംഗ്ലീഷിൽ ചോദിക്കും?',
            options: ['How much is this?', 'What is many money?', 'Price how?', 'How cost this is?'],
            correctIndex: 0,
            explanationMl: 'വില ചോദിക്കാനുള്ള ഏറ്റവും സ്വാഭാവികമായ വാക്യം "How much is this?" എന്നാണ്.'
          }
        ]
      },
      {
        id: 's3_l2',
        titleEn: 'Asking for Directions',
        titleMl: 'വഴി ചോദിക്കൽ',
        summaryEn: 'Asking strangers politely how to reach a bus stand, railway station, or hospital.',
        summaryMl: 'മര്യാദയോടെ വഴി ചോദിക്കാനുള്ള എളുപ്പ വാക്യങ്ങൾ.',
        contentPoints: [
          { en: 'Excuse me, where is the bus station?', ml: 'ക്ഷമിക്കണം, ബസ് സ്റ്റേഷൻ എവിടെയാണ്?', example: 'Excuse me, where is the metro station?' },
          { en: 'Go straight and turn left', ml: 'നേരെ പോയി ഇടത്തേക്ക് തിരിയുക', example: 'Go straight for 100 meters.' },
          { en: 'Is it near here?', ml: 'ഇത് ഇവിടെ അടുത്താണോ?', example: 'Yes, it is very close.' }
        ],
        quiz: [
          {
            questionEn: 'Which is the polite way to start asking a stranger for directions?',
            questionMl: 'ഒരു അപരിചിതനോട് വഴി ചോദിക്കാൻ തുടങ്ങുമ്പോൾ ആദ്യം എന്ത് പറയണം?',
            options: ['Excuse me', 'Hey you', 'Listen here', 'Tell me now'],
            correctIndex: 0,
            explanationMl: 'ശ്രദ്ധ ആകർഷിക്കാൻ ഏറ്റവും മാന്യമായ പദം "Excuse me" (ക്ഷമിക്കണം) എന്നാണ്.'
          }
        ]
      }
    ]
  },

  {
    id: 4,
    titleEn: 'Stage 4: Speaking Confidence',
    titleMl: 'ഘട്ടം 4: സംസാര ആത്മവിശ്വാസം (Speaking Confidence)',
    descriptionEn: 'Daily routines, asking open questions, making polite requests, and storytelling.',
    descriptionMl: 'ദിനചര്യകൾ പറയാനും, ചോദ്യങ്ങൾ ചോദിക്കാനും, ഒഴുക്കോടെ സംസാരിക്കാനും ശീലിക്കുക.',
    lessons: [
      {
        id: 's4_l1',
        titleEn: 'Describing Your Daily Routine',
        titleMl: 'നിങ്ങളുടെ ദിനചര്യ വിവരിക്കൽ',
        summaryEn: 'Talk about what you do from morning to night using Simple Present.',
        summaryMl: 'രാവിലെ ഉണരുന്നത് മുതൽ രാത്രി ഉറങ്ങുന്നത് വരെയുള്ള കാര്യങ്ങൾ വിവരിക്കാം.',
        contentPoints: [
          { en: 'I wake up at 6:30 AM.', ml: 'ഞാൻ രാവിലെ 6:30 ന് ഉണരുന്നു.', example: 'I wake up early.' },
          { en: 'I brush my teeth and take a bath.', ml: 'ഞാൻ പല്ലുതേച്ച് കുളിക്കുന്നു.', example: 'Then I take breakfast.' },
          { en: 'I go to office / college by bus.', ml: 'ഞാൻ ബസ്സിൽ ഓഫീസിലേക്ക് / കോളേജിലേക്ക് പോകുന്നു.', example: 'The bus leaves at 8.' },
          { en: 'In the evening, I spend time with family.', ml: 'വൈകുന്നേരം ഞാൻ കുടുംബത്തോടൊപ്പം സമയം ചെലവഴിക്കുന്നു.', example: 'We watch TV together.' }
        ],
        quiz: [
          {
            questionEn: 'Choose the correct way to say you wake up at 7 AM:',
            questionMl: 'രാവിലെ 7 മണിക്ക് ഉണരുന്നു എന്ന് എങ്ങനെ പറയും?',
            options: ['I wake up at 7 AM', 'I waking up in 7 AM', 'I woke up on 7 AM now', 'Me wake 7 AM'],
            correctIndex: 0,
            explanationMl: '"I wake up at 7 AM" ആണ് ദിവസേനയുള്ള ശീലത്തെ സൂചിപ്പിക്കുന്ന ശരിയായ രൂപം.'
          }
        ]
      },
      {
        id: 's4_l2',
        titleEn: 'Polite Requests (Could you / Would you)',
        titleMl: 'മാന്യമായ അപേക്ഷകൾ നൽകൽ',
        summaryEn: 'How to sound courteous and respectful in English conversations.',
        summaryMl: 'മറ്റുള്ളവരോട് സഹായം ചോദിക്കുമ്പോൾ മര്യാദയുള്ള ഇംഗ്ലീഷ് ശൈലികൾ ഉപയോഗിക്കാം.',
        contentPoints: [
          { en: 'Could you please help me?', ml: 'ദയവായി എന്നെ ഒന്ന് സഹായിക്കാമോ?', example: 'Could you pass the salt, please?' },
          { en: 'Would you like some tea?', ml: 'കുറച്ച് ചായ വേണമെന്നുണ്ടോ?', example: 'Would you like to sit here?' },
          { en: 'May I come in?', ml: 'ഞാൻ അകത്തേക്ക് വന്നോട്ടെ?', example: 'May I ask a question?' }
        ],
        quiz: [
          {
            questionEn: 'Which sentence is the most polite?',
            questionMl: 'ഏറ്റവും മര്യാദയുള്ള വാക്യം ഏതാണ്?',
            options: ['Could you please open the door?', 'Open the door now', 'You open door', 'Door open fast'],
            correctIndex: 0,
            explanationMl: '"Could you please..." എന്ന് തുടങ്ങുന്നതാണ് ഏറ്റവും മാന്യമായ അപേക്ഷാ ശൈലി.'
          }
        ]
      }
    ]
  },

  {
    id: 5,
    titleEn: 'Stage 5: Basic Writing Skills',
    titleMl: 'ഘട്ടം 5: അടിസ്ഥാന എഴുത്തു കഴിവുകൾ (Basic Writing Skills)',
    descriptionEn: 'Connecting words, writing short notes, messages to friends, and expressing ideas.',
    descriptionMl: 'വാക്യങ്ങളെ ബന്ധിപ്പിക്കാനും, സുഹൃത്തുക്കൾക്ക് മെസ്സേജുകൾ എഴുതാനും, ആശയങ്ങൾ വ്യക്തമാക്കാനും പഠിക്കാം.',
    lessons: [
      {
        id: 's5_l1',
        titleEn: 'Connecting Words (And, But, Because)',
        titleMl: 'യോജിപ്പിക്കുന്ന വാക്കുകൾ (Connectors)',
        summaryEn: 'Combine two short sentences into one smooth, natural English sentence.',
        summaryMl: 'രണ്ട് ചെറിയ വാക്യങ്ങളെ കൂട്ടിച്ചേർത്ത് മനോഹരമായ വലിയ വാക്യങ്ങളുണ്ടാക്കാം.',
        contentPoints: [
          { en: 'And = കൂടാതെ / ഒപ്പം (സമാന ആശയങ്ങൾക്ക്)', ml: 'I like tea and coffee.', example: 'He is smart and hardworking.' },
          { en: 'But = എന്നാൽ / പക്ഷേ (വ്യത്യസ്ത ആശയങ്ങൾക്ക്)', ml: 'I studied hard, but the exam was tough.', example: 'She is tired, but happy.' },
          { en: 'Because = എന്തുകൊണ്ടെന്നാൽ / കാരണം', ml: 'I was late because of heavy rain.', example: 'He smiled because he won.' }
        ],
        quiz: [
          {
            questionEn: 'I stayed at home ___ it was raining heavily.',
            questionMl: 'ശരിയായ കണക്റ്റർ തിരഞ്ഞെടുക്കുക: കനത്ത മഴയായിരുന്നതിനാൽ ഞാൻ വീട്ടിൽ തന്നെ ഇരുന്നു.',
            options: ['because', 'but', 'and', 'or'],
            correctIndex: 0,
            explanationMl: 'കാരണം വ്യക്തമാക്കാൻ "because" ഉപയോഗിക്കുന്നു: "I stayed at home because it was raining heavily".'
          },
          {
            questionEn: 'He ran fast, ___ he missed the bus.',
            questionMl: 'അവൻ വേഗത്തിൽ ഓടി, ___ അവന് ബസ് കിട്ടിയില്ല.',
            options: ['but', 'because', 'so', 'and'],
            correctIndex: 0,
            explanationMl: 'എതിരായ ഫലമായതിനാൽ "but" (പക്ഷേ) ഉപയോഗിക്കുന്നു.'
          }
        ]
      },
      {
        id: 's5_l2',
        titleEn: 'Writing a Message to a Friend',
        titleMl: 'സുഹൃത്തിന് ഒരു സന്ദേശം എഴുതൽ',
        summaryEn: 'Inviting a friend, sharing good news, or checking in on WhatsApp.',
        summaryMl: 'വാട്സാപ്പിലോ മെയിലിലോ സുഹൃത്തുക്കൾക്ക് എളുപ്പത്തിൽ മെസ്സേജ് അയക്കാം.',
        contentPoints: [
          { en: 'Hi Rahul, how are you doing?', ml: 'ഹായ് രാഹുൽ, എന്തൊക്കെയുണ്ട് വിശേഷങ്ങൾ?', example: 'Hope you are doing well.' },
          { en: 'Are you free this weekend?', ml: 'ഈ വാരാന്ത്യത്തിൽ നിനക്ക് ഒഴിവുണ്ടോ?', example: 'Let us meet for coffee.' },
          { en: 'Looking forward to hearing from you!', ml: 'നിന്റെ മറുപടിക്കായി കാത്തിരിക്കുന്നു!', example: 'Take care, see you soon!' }
        ],
        quiz: [
          {
            questionEn: 'Which is a friendly closing for a message to a friend?',
            questionMl: 'ഒരു സുഹൃത്തിനുള്ള സന്ദേശത്തിന്റെ അവസാനം സൗഹൃദത്തോടെ എഴുതാവുന്നത് ഏതാണ്?',
            options: ['Take care, see you soon!', 'Yours faithfully', 'Obediently yours', 'End of message'],
            correctIndex: 0,
            explanationMl: 'സുഹൃത്തുക്കൾക്ക് അയക്കുന്ന സന്ദേശങ്ങളിൽ "Take care, see you soon!" എന്നത് അനുയോജ്യമായ സൗഹൃദ ശൈലിയാണ്.'
          }
        ]
      }
    ]
  }
];
