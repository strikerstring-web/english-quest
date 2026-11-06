import { GrammarTopic } from '../types';

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // 1. Pronouns
  {
    id: 'pronouns',
    titleEn: 'Pronouns (സർവ്വനാമങ്ങൾ)',
    titleMl: 'സർവ്വനാമങ്ങൾ (Pronouns)',
    descriptionEn: 'Words used instead of names: I, You, He, She, It, We, They',
    descriptionMl: 'പേരുകൾക്ക് പകരമായി ഉപയോഗിക്കുന്ന വാക്കുകൾ: ഞാൻ, നിങ്ങൾ, അവൻ, അവൾ, അത്, ഞങ്ങൾ, അവർ',
    rulesMl: [
      'I = ഞാൻ (തന്റെ സ്വന്തം കാര്യം പറയുമ്പോൾ)',
      'You = നിങ്ങൾ / നീ (എതിരെ നിൽക്കുന്ന ആൾ)',
      'He = അവൻ (ഒരു പുരുഷൻ അല്ലെങ്കിൽ ആൺകുട്ടി)',
      'She = അവൾ (ഒരു സ്ത്രീ അല്ലെങ്കിൽ പെൺകുട്ടി)',
      'It = അത് / ഇത് (വസ്തുക്കൾ, പക്ഷികൾ, മൃഗങ്ങൾ)',
      'We = ഞങ്ങൾ / നമ്മൾ (നമ്മളും ഉൾപ്പെടുന്ന കൂട്ടം)',
      'They = അവർ / അവ (മറ്റു ആളുകളുടെയോ സാധനങ്ങളുടെയോ കൂട്ടം)'
    ],
    questions: [
      {
        id: 'p1',
        topicId: 'pronouns',
        type: 'multiple_choice',
        promptEn: 'Rahul is my friend. ___ is a doctor.',
        promptMl: 'രാഹുൽ എന്റെ സുഹൃത്താണ്. ___ ഒരു ഡോക്ടറാണ്.',
        options: ['He', 'She', 'They', 'It'],
        correctAnswer: 'He',
        explanationMl: 'രാഹുൽ ഒരു ആൺകുട്ടിയാണ് (പുരുഷൻ). അതിനാൽ "He" (അവൻ) ഉപയോഗിക്കുന്നു.',
        explanationEn: 'Rahul is male singular, so we use "He".'
      },
      {
        id: 'p2',
        topicId: 'pronouns',
        type: 'arrange_sentence',
        promptEn: 'Arrange the words to form a correct English sentence:',
        promptMl: 'ശരിയായ വാക്യം നിർമ്മിക്കാൻ വാക്കുകൾ ക്രമീകരിക്കുക:',
        shuffledWords: ['learning', 'We', 'English', 'are'],
        correctAnswer: 'We are learning English',
        explanationMl: 'ഇംഗ്ലീഷിൽ സാധാരണയായി ആദ്യം കർത്താവ് (Subject) വരും: We (ഞങ്ങൾ) + are + learning (പഠിക്കുന്നു) + English.',
        explanationEn: 'Natural English sentence order is Subject + Verb + Object: We are learning English.'
      },
      {
        id: 'p3',
        topicId: 'pronouns',
        type: 'find_mistake',
        promptEn: 'Find and select the incorrect word in this sentence:',
        promptMl: 'ഈ വാക്യത്തിലെ തെറ്റായ വാക്ക് തിരഞ്ഞെടുക്കുക:',
        sentenceWithMistake: 'My mother is cooking. He makes delicious curry.',
        options: ['mother', 'cooking', 'He', 'delicious'],
        correctAnswer: 'He',
        explanationMl: 'അമ്മ (Mother) സ്ത്രീലിംഗമാണ്. അതിനാൽ "He" എന്നതിന് പകരം "She" എന്ന് പറയണം.',
        explanationEn: 'Mother is female, so use "She" instead of "He".'
      },
      {
        id: 'p4',
        topicId: 'pronouns',
        type: 'fill_blank',
        promptEn: 'The cat is thirsty. ___ is drinking milk.',
        promptMl: 'പൂച്ചയ്ക്ക് ദാഹിക്കുന്നു. ___ പാൽ കുടിക്കുകയാണ്.',
        options: ['It', 'They', 'We', 'He'],
        correctAnswer: 'It',
        explanationMl: 'മൃഗങ്ങളെയും വസ്തുക്കളെയും സൂചിപ്പിക്കാൻ സാധാരണയായി "It" ഉപയോഗിക്കുന്നു.',
        explanationEn: 'Use "It" for animals and objects.'
      }
    ]
  },

  // 2. Am / Is / Are
  {
    id: 'am_is_are',
    titleEn: 'Am / Is / Are (Be Verbs)',
    titleMl: 'ആണ് / ആകുന്നു (Am / Is / Are)',
    descriptionEn: 'Present state of being: I am, He is, They are',
    descriptionMl: 'വർത്തമാനകാലത്ത് അവസ്ഥ പറയാൻ ഉപയോഗിക്കുന്നു: ഞാൻ ആകുന്നു, അവൻ ആകുന്നു, അവർ ആകുന്നു',
    rulesMl: [
      '"Am" എപ്പോഴും "I" (ഞാൻ) നൊപ്പം മാത്രം ഉപയോഗിക്കുന്നു (I am).',
      '"Is" ഏകവചനത്തോടൊപ്പം (He, She, It, Rahul, The book) ഉപയോഗിക്കുന്നു.',
      '"Are" ബഹുവചനത്തോടൊപ്പവും (We, They) "You" വിനൊപ്പവും ഉപയോഗിക്കുന്നു (You are, We are, They are).'
    ],
    questions: [
      {
        id: 'a1',
        topicId: 'am_is_are',
        type: 'multiple_choice',
        promptEn: 'I ___ very happy today.',
        promptMl: 'എനിക്ക് ഇന്ന് വളരെ സന്തോഷമുണ്ട്.',
        options: ['am', 'is', 'are', 'be'],
        correctAnswer: 'am',
        explanationMl: '"I" (ഞാൻ) നൊപ്പം വർത്തമാനകാലത്ത് എപ്പോഴും "am" ആണ് വരുന്നത് (I am).',
        explanationEn: '"I" is always paired with "am" in the present tense.'
      },
      {
        id: 'a2',
        topicId: 'am_is_are',
        type: 'arrange_sentence',
        promptEn: 'Arrange the words correctly:',
        promptMl: 'വാക്കുകൾ ശരിയായി ക്രമീകരിക്കുക:',
        shuffledWords: ['teacher', 'She', 'a', 'is'],
        correctAnswer: 'She is a teacher',
        explanationMl: 'Subject (She) + Verb (is) + Complement (a teacher) = She is a teacher.',
        explanationEn: 'Correct order: She is a teacher.'
      },
      {
        id: 'a3',
        topicId: 'am_is_are',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'They is playing football in the ground.',
        options: ['They', 'is', 'playing', 'ground'],
        correctAnswer: 'is',
        explanationMl: '"They" ബഹുവചനമാണ് (അവർ). അതിനാൽ "is" എന്നതിന് പകരം "are" എന്ന് ഉപയോഗിക്കണം (They are playing).',
        explanationEn: '"They" is plural, so use "are" instead of "is".'
      },
      {
        id: 'a4',
        topicId: 'am_is_are',
        type: 'fill_blank',
        promptEn: 'You ___ my best friend.',
        promptMl: 'നിങ്ങൾ എന്റെ ഏറ്റവും നല്ല സുഹൃത്താണ്.',
        options: ['are', 'is', 'am', 'was'],
        correctAnswer: 'are',
        explanationMl: '"You" എന്നതിനൊപ്പം എപ്പോഴും "are" ആണ് ഉപയോഗിക്കുന്നത് (You are).',
        explanationEn: '"You" always takes "are".'
      }
    ]
  },

  // 3. Has / Have
  {
    id: 'has_have',
    titleEn: 'Has / Have (ഉണ്ട് / കൈവശമുണ്ട്)',
    titleMl: 'കൈവശമുണ്ട് (Has / Have)',
    descriptionEn: 'Showing possession: I have a pen, She has a car',
    descriptionMl: 'നമ്മുടെ കൈവശം ഒന്നുള്ള കാര്യം പറയാൻ: എനിക്ക് ഒരു പേനയുണ്ട്, അവൾക്ക് ഒരു കാറുണ്ട്',
    rulesMl: [
      '"Have" ഉപയോഗിക്കുന്നത്: I, You, We, They, ബഹുവചനങ്ങൾ (I have, We have, They have).',
      '"Has" ഉപയോഗിക്കുന്നത്: He, She, It, ഏകവചനങ്ങൾ (He has, She has, It has, Anjali has).'
    ],
    questions: [
      {
        id: 'h1',
        topicId: 'has_have',
        type: 'multiple_choice',
        promptEn: 'She ___ a beautiful voice.',
        promptMl: 'അവൾക്ക് മനോഹരമായ ശബ്ദമുണ്ട്.',
        options: ['has', 'have', 'having', 'is'],
        correctAnswer: 'has',
        explanationMl: '"She" ഏകവചനമായതിനാൽ "has" ഉപയോഗിക്കുന്നു (She has).',
        explanationEn: 'Third-person singular "She" takes "has".'
      },
      {
        id: 'h2',
        topicId: 'has_have',
        type: 'arrange_sentence',
        promptEn: 'Arrange the sentence:',
        promptMl: 'വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['two', 'have', 'pens', 'I'],
        correctAnswer: 'I have two pens',
        explanationMl: 'Subject (I) + Verb (have) + Object (two pens) = I have two pens (എന്റെ കൈവശം രണ്ട് പേനകളുണ്ട്).',
        explanationEn: 'Correct order: I have two pens.'
      },
      {
        id: 'h3',
        topicId: 'has_have',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'We has many books in our library.',
        options: ['We', 'has', 'many', 'library'],
        correctAnswer: 'has',
        explanationMl: '"We" ബഹുവചനമായതിനാൽ "has" തെറ്റാണ്, "have" ആണ് ശരി (We have many books).',
        explanationEn: '"We" requires "have", not "has".'
      },
      {
        id: 'h4',
        topicId: 'has_have',
        type: 'fill_blank',
        promptEn: 'They ___ a big house in Kochi.',
        promptMl: 'അവർക്ക് കൊച്ചിയിൽ ഒരു വലിയ വീടുണ്ട്.',
        options: ['have', 'has', 'are', 'had not'],
        correctAnswer: 'have',
        explanationMl: '"They" ബഹുവചനമായതിനാൽ "have" ഉപയോഗിക്കുന്നു.',
        explanationEn: '"They" is plural, so we use "have".'
      }
    ]
  },

  // 4. Articles (A / An / The)
  {
    id: 'articles',
    titleEn: 'Articles (A / An / The)',
    titleMl: 'ആർട്ടിക്കിളുകൾ (A / An / The)',
    descriptionEn: 'Definite and indefinite markers before nouns',
    descriptionMl: 'നാമങ്ങൾക്ക് മുന്നിൽ ഉപയോഗിക്കുന്ന വാക്കുകൾ: A, An, The',
    rulesMl: [
      '"An" സ്വര ശബ്ദത്തിൽ (Vowel sound: a, e, i, o, u ശബ്ദങ്ങൾ) തുടങ്ങുന്ന ഏകവചന നാമങ്ങൾക്ക് മുന്നിൽ വരുന്നു (an apple, an egg, an umbrella, an hour).',
      '"A" വ്യഞ്ജന ശബ്ദത്തിൽ (Consonant sound) തുടങ്ങുന്ന ഏകവചന നാമങ്ങൾക്ക് മുന്നിൽ വരുന്നു (a boy, a car, a university).',
      '"The" പ്രത്യേകമായതോ, ലോകത്ത് ഒന്നേ ഉള്ളതോ (The Sun, The Moon), അല്ലെങ്കിൽ മുൻപേ പറഞ്ഞതോ ആയ കാര്യങ്ങൾക്ക് മുന്നിൽ വരുന്നു.'
    ],
    questions: [
      {
        id: 'ar1',
        topicId: 'articles',
        type: 'multiple_choice',
        promptEn: 'I eat ___ apple every morning.',
        promptMl: 'ഞാൻ എല്ലാ ദിവസവും രാവിലെ ഒരു ആപ്പിൾ കഴിക്കുന്നു.',
        options: ['an', 'a', 'the', 'no article'],
        correctAnswer: 'an',
        explanationMl: '"Apple" തുടങ്ങുന്നത് സ്വര ശബ്ദത്തിലാണ് (Vowel sound \'ആ\'). അതിനാൽ "an" ഉപയോഗിക്കണം.',
        explanationEn: '"Apple" begins with a vowel sound, requiring "an".'
      },
      {
        id: 'ar2',
        topicId: 'articles',
        type: 'arrange_sentence',
        promptEn: 'Arrange the sentence:',
        promptMl: 'വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['rises', 'in', 'The', 'east', 'sun', 'the'],
        correctAnswer: 'The sun rises in the east',
        explanationMl: 'സൂര്യൻ (The sun) ലോകത്ത് ഒന്നേ ഉള്ളൂ, അതിനാൽ "The" വരുന്നു. The sun rises in the east.',
        explanationEn: 'The sun rises in the east.'
      },
      {
        id: 'ar3',
        topicId: 'articles',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'Suresh bought a umbrella yesterday.',
        options: ['bought', 'a', 'umbrella', 'yesterday'],
        correctAnswer: 'a',
        explanationMl: '"Umbrella" സ്വര ശബ്ദത്തിൽ (\'അ\') തുടങ്ങുന്നതിനാൽ "a" അല്ല, "an umbrella" എന്ന് പറയണം.',
        explanationEn: '"Umbrella" starts with a vowel sound, so it must be "an umbrella".'
      },
      {
        id: 'ar4',
        topicId: 'articles',
        type: 'fill_blank',
        promptEn: 'He is ___ honest man.',
        promptMl: 'അദ്ദേഹം ഒരു സത്യസന്ധനായ മനുഷ്യനാണ്.',
        options: ['an', 'a', 'the', 'some'],
        correctAnswer: 'an',
        explanationMl: '"Honest" എന്ന വാക്കിലെ \'H\' നിശ്ശബ്ദമാണ് (Silent). \'ഓണസ്റ്റ്\' എന്ന സ്വര ശബ്ദത്തിലാണ് ഉച്ചരിക്കുന്നത്. അതിനാൽ "an honest man" എന്ന് വരുന്നു.',
        explanationEn: '"Honest" starts with a vowel sound (silent H), so we say "an honest man".'
      }
    ]
  },

  // 5. Singular and Plural
  {
    id: 'singular_plural',
    titleEn: 'Singular & Plural (ഏകവചനവും ബഹുവചനവും)',
    titleMl: 'ഏകവചനവും ബഹുവചനവും (Singular & Plural)',
    descriptionEn: 'One item vs multiple items: Book -> Books, Child -> Children',
    descriptionMl: 'ഒന്നുള്ളതും ഒന്നിലധികം ഉള്ളതും: പുസ്തകം -> പുസ്തകങ്ങൾ',
    rulesMl: [
      'സാധാരണയായി വാക്കിന്റെ അവസാനം -s ചേർത്താൽ ബഹുവചനമാകും (Book -> Books, Dog -> Dogs).',
      '-s, -sh, -ch, -x എന്നിവയിൽ അവസാനിക്കുന്ന വാക്കുകളിൽ -es ചേർക്കുന്നു (Bus -> Buses, Box -> Boxes).',
      'ചില പ്രത്യേക ബഹുവചനങ്ങൾ: Child -> Children, Man -> Men, Woman -> Women, Foot -> Feet.'
    ],
    questions: [
      {
        id: 'sp1',
        topicId: 'singular_plural',
        type: 'multiple_choice',
        promptEn: 'What is the plural of "Child"?',
        promptMl: '"Child" (കുട്ടി) എന്നതിന്റെ ബഹുവചനം ഏതാണ്?',
        options: ['Children', 'Childs', 'Childes', 'Childrens'],
        correctAnswer: 'Children',
        explanationMl: '"Child" എന്നതിന്റെ ശരിയായ ബഹുവചനം "Children" (കുട്ടികൾ) എന്നാണ്.',
        explanationEn: 'The plural of "Child" is "Children".'
      },
      {
        id: 'sp2',
        topicId: 'singular_plural',
        type: 'fill_blank',
        promptEn: 'There are five ___ on the table.',
        promptMl: 'മേശപ്പുറത്ത് അഞ്ച് പെൻസിലുകളുണ്ട്.',
        options: ['pencils', 'pencil', 'penciles', 'pencilss'],
        correctAnswer: 'pencils',
        explanationMl: 'അഞ്ച് (Five) ബഹുവചനമായതിനാൽ "pencil" എന്നതിനൊപ്പം -s ചേർത്ത് "pencils" എന്ന് പറയണം.',
        explanationEn: '"Five" is plural, so we use "pencils".'
      },
      {
        id: 'sp3',
        topicId: 'singular_plural',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'Three mans are waiting outside the office.',
        options: ['Three', 'mans', 'waiting', 'office'],
        correctAnswer: 'mans',
        explanationMl: '"Man" എന്നതിന്റെ ബഹുവചനം "mans" അല്ല, "men" (പുരുഷന്മാർ) എന്നാണ്.',
        explanationEn: 'The plural of "man" is "men", not "mans".'
      },
      {
        id: 'sp4',
        topicId: 'singular_plural',
        type: 'arrange_sentence',
        promptEn: 'Arrange the sentence:',
        promptMl: 'വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['boxes', 'The', 'heavy', 'are'],
        correctAnswer: 'The boxes are heavy',
        explanationMl: 'The boxes (ആ പെട്ടികൾ) are (ആകുന്നു) heavy (ഭാരമുള്ളത്).',
        explanationEn: 'The boxes are heavy.'
      }
    ]
  },

  // 6. Simple Present Tense
  {
    id: 'simple_present',
    titleEn: 'Simple Present Tense (സാധാരണ വർത്തമാനകാലം)',
    titleMl: 'സാധാരണ വർത്തമാനകാലം (Simple Present Tense)',
    descriptionEn: 'Daily habits, routines, and universal truths',
    descriptionMl: 'ദിവസേന ചെയ്യുന്ന കാര്യങ്ങൾ, ശീലങ്ങൾ, സത്യങ്ങൾ എന്നിവ പറയാൻ',
    rulesMl: [
      'I, You, We, They എന്നിവയ്ക്കൊപ്പം ക്രിയയുടെ അടിസ്ഥാന രൂപം (V1) ഉപയോഗിക്കുന്നു: I play, We study.',
      'He, She, It, ഏകവചന നാമങ്ങൾ എന്നിവയ്ക്കൊപ്പം ക്രിയയിൽ -s അല്ലെങ്കിൽ -es ചേർക്കുന്നു: He plays, She teaches, It runs.',
      'ഉദാഹരണത്തിന്: "I drink tea" എന്നാൽ "He drinks tea" എന്ന് പറയണം.'
    ],
    questions: [
      {
        id: 'pr1',
        topicId: 'simple_present',
        type: 'multiple_choice',
        promptEn: 'He ___ English every evening.',
        promptMl: 'അവൻ എല്ലാ വൈകുന്നേരവും ഇംഗ്ലീഷ് പഠിക്കുന്നു.',
        options: ['studies', 'study', 'studying', 'studied'],
        correctAnswer: 'studies',
        explanationMl: '"He" ഏകവചനമായതിനാൽ ക്രിയയിൽ -s/-es വരുന്നു: He studies (അവൻ പഠിക്കുന്നു).',
        explanationEn: 'Singular subject "He" requires the verb form "studies".'
      },
      {
        id: 'pr2',
        topicId: 'simple_present',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'She drink milk every morning.',
        options: ['She', 'drink', 'milk', 'morning'],
        correctAnswer: 'drink',
        explanationMl: '"She" എന്നതിനൊപ്പം ക്രിയയിൽ -s ചേർക്കണം: She drinks milk (അവൾ പാൽ കുടിക്കുന്നു).',
        explanationEn: 'Subject "She" takes "drinks", not "drink".'
      },
      {
        id: 'pr3',
        topicId: 'simple_present',
        type: 'arrange_sentence',
        promptEn: 'Arrange the sentence:',
        promptMl: 'വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['early', 'I', 'wake', 'up'],
        correctAnswer: 'I wake up early',
        explanationMl: 'I (ഞാൻ) + wake up (ഉണരുന്നു) + early (നേരത്തെ) = I wake up early.',
        explanationEn: 'I wake up early.'
      },
      {
        id: 'pr4',
        topicId: 'simple_present',
        type: 'fill_blank',
        promptEn: 'Birds ___ in the sky.',
        promptMl: 'പക്ഷികൾ ആകാശത്ത് പറക്കുന്നു.',
        options: ['fly', 'flies', 'flying', 'flew'],
        correctAnswer: 'fly',
        explanationMl: '"Birds" ബഹുവചനമാണ്. അതിനാൽ -s ചേർക്കാതെ "fly" എന്ന് മാത്രം ഉപയോഗിക്കുന്നു.',
        explanationEn: '"Birds" is plural, so we use the base verb "fly".'
      }
    ]
  },

  // 7. Simple Past Tense
  {
    id: 'simple_past',
    titleEn: 'Simple Past Tense (കഴിഞ്ഞകാലം)',
    titleMl: 'കഴിഞ്ഞകാലം (Simple Past Tense)',
    descriptionEn: 'Actions that finished in the past: played, went, saw',
    descriptionMl: 'കഴിഞ്ഞുപോയ കാര്യങ്ങൾ പറയാൻ: കളിച്ചു, പോയി, കണ്ടു',
    rulesMl: [
      'കഴിഞ്ഞുപോയ കാര്യങ്ങൾക്ക് ക്രിയയുടെ രണ്ടാം രൂപം (V2 - Past Form) ഉപയോഗിക്കുന്നു.',
      'സാധാരണ ക്രിയകളിൽ -ed ചേർക്കുന്നു: play -> played, walk -> walked, work -> worked.',
      'ചില പ്രത്യേക ക്രിയകൾ (Irregular verbs): go -> went, see -> saw, eat -> ate, come -> came.'
    ],
    questions: [
      {
        id: 'pa1',
        topicId: 'simple_past',
        type: 'multiple_choice',
        promptEn: 'Yesterday, I ___ to Kozhikode.',
        promptMl: 'ഇന്നലെ ഞാൻ കോഴിക്കോട്ടേക്ക് പോയി.',
        options: ['went', 'go', 'going', 'gone'],
        correctAnswer: 'went',
        explanationMl: 'ഇന്നലെ (Yesterday) കഴിഞ്ഞ കാര്യമാണ്. "Go" എന്നതിന്റെ Past form "went" ആണ്.',
        explanationEn: 'Past tense of "go" is "went".'
      },
      {
        id: 'pa2',
        topicId: 'simple_past',
        type: 'arrange_sentence',
        promptEn: 'Arrange the sentence in past tense:',
        promptMl: 'കഴിഞ്ഞകാല വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['movie', 'watched', 'We', 'a', 'yesterday'],
        correctAnswer: 'We watched a movie yesterday',
        explanationMl: 'We (ഞങ്ങൾ) + watched (കണ്ടു) + a movie (ഒരു സിനിമ) + yesterday (ഇന്നലെ).',
        explanationEn: 'We watched a movie yesterday.'
      },
      {
        id: 'pa3',
        topicId: 'simple_past',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'Last night I eat biryani with my family.',
        options: ['night', 'eat', 'biryani', 'family'],
        correctAnswer: 'eat',
        explanationMl: '"Last night" (കഴിഞ്ഞ രാത്രി) കഴിഞ്ഞ കാര്യമാണ്. അതിനാൽ "eat" അല്ല, "ate" (കഴിച്ചു) എന്ന് പറയണം.',
        explanationEn: 'Use past tense "ate" instead of present "eat".'
      },
      {
        id: 'pa4',
        topicId: 'simple_past',
        type: 'fill_blank',
        promptEn: 'She ___ the English test with high marks.',
        promptMl: 'അവൾ ഉയർന്ന മാർക്കോടെ ഇംഗ്ലീഷ് പരീക്ഷ വിജയിച്ചു.',
        options: ['passed', 'pass', 'passes', 'passing'],
        correctAnswer: 'passed',
        explanationMl: 'വിജയിച്ചു എന്ന കഴിഞ്ഞ കാര്യം പറയാൻ "passed" ഉപയോഗിക്കുന്നു.',
        explanationEn: 'Past tense "passed" indicates completed action.'
      }
    ]
  },

  // 8. Simple Future Tense
  {
    id: 'simple_future',
    titleEn: 'Simple Future Tense (ഭാവികാലം)',
    titleMl: 'ഭാവികാലം (Simple Future Tense)',
    descriptionEn: 'Actions that will happen: will go, will call, will learn',
    descriptionMl: 'ഇനി നടക്കാൻ പോകുന്ന കാര്യങ്ങൾ പറയാൻ: പോകും, വിളിക്കും, പഠിക്കും',
    rulesMl: [
      'ഭാവിയിൽ ചെയ്യാൻ പോകുന്ന കാര്യങ്ങൾക്ക് "will" + അടിസ്ഥാന ക്രിയ (Verb V1) ഉപയോഗിക്കുന്നു.',
      'ഉദാഹരണങ്ങൾ: I will come (ഞാൻ വരും), He will call you (അവൻ നിങ്ങളെ വിളിക്കും).',
      'ചോദ്യങ്ങൾ ചോദിക്കുമ്പോൾ "Will" മുന്നിൽ വരും: "Will you come?" (നിങ്ങൾ വരുമോ?).'
    ],
    questions: [
      {
        id: 'fu1',
        topicId: 'simple_future',
        type: 'multiple_choice',
        promptEn: 'I ___ call you tomorrow morning.',
        promptMl: 'ഞാൻ നാളെ രാവിലെ നിങ്ങളെ വിളിക്കാം/വിളിക്കും.',
        options: ['will', 'did', 'am', 'was'],
        correctAnswer: 'will',
        explanationMl: 'നാളെ (Tomorrow) നടക്കാൻ പോകുന്ന കാര്യമായതിനാൽ "will" ഉപയോഗിക്കുന്നു (I will call).',
        explanationEn: 'Use "will" for future actions.'
      },
      {
        id: 'fu2',
        topicId: 'simple_future',
        type: 'arrange_sentence',
        promptEn: 'Arrange the future sentence:',
        promptMl: 'ഭാവികാല വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['learn', 'will', 'English', 'I'],
        correctAnswer: 'I will learn English',
        explanationMl: 'I (ഞാൻ) + will learn (പഠിക്കും) + English (ഇംഗ്ലീഷ്).',
        explanationEn: 'I will learn English.'
      },
      {
        id: 'fu3',
        topicId: 'simple_future',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'Next Sunday we will went to the beach.',
        options: ['Next', 'will', 'went', 'beach'],
        correctAnswer: 'went',
        explanationMl: '"Will" നൊപ്പം ക്രിയയുടെ അടിസ്ഥാന രൂപം (V1) മാത്രമേ വരാവൂ. "went" അല്ല, "go" എന്ന് പറയണം (we will go).',
        explanationEn: 'After "will", always use the base verb "go", never "went".'
      },
      {
        id: 'fu4',
        topicId: 'simple_future',
        type: 'fill_blank',
        promptEn: 'The train ___ arrive at 5 PM.',
        promptMl: 'ട്രെയിൻ വൈകുന്നേരം 5 മണിക്ക് എത്തും.',
        options: ['will', 'was', 'did', 'are'],
        correctAnswer: 'will',
        explanationMl: '5 മണിക്ക് എത്തും എന്ന ഭാവിയെ സൂചിപ്പിക്കാൻ "will" ചേർക്കുന്നു.',
        explanationEn: 'Use "will" to express future scheduled arrival.'
      }
    ]
  },

  // 9. Basic Prepositions
  {
    id: 'prepositions',
    titleEn: 'Basic Prepositions (In / On / At / Under)',
    titleMl: 'പ്രെപ്പോസിഷനുകൾ (In / On / At / Under)',
    descriptionEn: 'Words showing location, direction, and time',
    descriptionMl: 'സ്ഥലവും സമയവും അവസ്ഥയും കാണിക്കാൻ ഉപയോഗിക്കുന്ന വാക്കുകൾ',
    rulesMl: [
      '"In" = ഉള്ളിൽ / അകത്ത് (in the room, in Kerala, in 2026, in the morning).',
      '"On" = മുകളിൽ / ഉപരിതലത്തിൽ അല്ലെങ്കിൽ ദിവസങ്ങൾക്ക് മുൻപ് (on the table, on Monday, on the road).',
      '"At" = കൃത്യമായ സമയത്തിനോ സ്ഥലത്തിനോ മുൻപ് (at 7 o’clock, at the bus stop, at home).',
      '"Under" = അടിയിൽ (under the tree, under the chair).'
    ],
    questions: [
      {
        id: 'prp1',
        topicId: 'prepositions',
        type: 'multiple_choice',
        promptEn: 'The book is ___ the table.',
        promptMl: 'പുസ്തകം മേശപ്പുറത്താണ് (മേശയുടെ മുകളിൽ).',
        options: ['on', 'in', 'at', 'into'],
        correctAnswer: 'on',
        explanationMl: 'മേശയുടെ ഉപരിതലത്തിൽ (മുകളിൽ) വെച്ചിരിക്കുന്നതിനാൽ "on" ഉപയോഗിക്കുന്നു (on the table).',
        explanationEn: 'We use "on" for surfaces.'
      },
      {
        id: 'prp2',
        topicId: 'prepositions',
        type: 'arrange_sentence',
        promptEn: 'Arrange the preposition sentence:',
        promptMl: 'വാക്യം ക്രമീകരിക്കുക:',
        shuffledWords: ['the', 'is', 'sleeping', 'cat', 'The', 'bed', 'on'],
        correctAnswer: 'The cat is sleeping on the bed',
        explanationMl: 'The cat is sleeping on the bed (പൂച്ച കട്ടിലിന് മുകളിൽ ഉറങ്ങുകയാണ്).',
        explanationEn: 'The cat is sleeping on the bed.'
      },
      {
        id: 'prp3',
        topicId: 'prepositions',
        type: 'find_mistake',
        promptEn: 'Find the mistake in this sentence:',
        promptMl: 'തെറ്റായ വാക്ക് കണ്ടെത്തുക:',
        sentenceWithMistake: 'I wake up on 6 AM every day.',
        options: ['wake', 'on', '6 AM', 'every'],
        correctAnswer: 'on',
        explanationMl: 'കൃത്യമായ സമയത്തിന് മുൻപ് "on" അല്ല, "at" ആണ് ഉപയോഗിക്കേണ്ടത് (at 6 AM).',
        explanationEn: 'Use "at" for specific clock times (at 6 AM).'
      },
      {
        id: 'prp4',
        topicId: 'prepositions',
        type: 'fill_blank',
        promptEn: 'The dog is sitting ___ the shade of the mango tree.',
        promptMl: 'നായ മാവിന്റെ തണലിൽ (അടിയിൽ) ഇരിക്കുന്നു.',
        options: ['under', 'over', 'between', 'at'],
        correctAnswer: 'under',
        explanationMl: 'മരത്തിന്റെ തണലിന്റെ അടിയിലായതിനാൽ "under" ഉപയോഗിക്കുന്നു.',
        explanationEn: '"Under" describes position beneath something.'
      }
    ]
  }
];
