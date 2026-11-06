import { SpeakingScenario } from '../types';

export const SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 'intro',
    titleEn: 'Introducing Yourself',
    titleMl: 'സ്വയം പരിചയപ്പെടുത്തൽ',
    descriptionEn: 'Practice saying your name, hometown, and hobbies to a friendly English speaker.',
    descriptionMl: 'നിങ്ങളുടെ പേര്, നാട്, താത്പര്യങ്ങൾ എന്നിവ ഇംഗ്ലീഷിൽ ആത്മവിശ്വാസത്തോടെ പറയാൻ ശീലിക്കുക.',
    partnerRoleEn: 'Friendly Tutor (Emma)',
    partnerRoleMl: 'സൗഹൃദ അധ്യാപിക (എമ്മ)',
    starterMessageEn: 'Hello! Welcome to our English speaking practice. My name is Emma. What is your name?',
    starterMessageMl: 'ഹലോ! നമ്മുടെ ഇംഗ്ലീഷ് സംഭാഷണ പരിശീലനത്തിലേക്ക് സ്വാഗതം. എന്റെ പേര് എമ്മ എന്നാണ്. നിങ്ങളുടെ പേരെന്താണ്?',
    suggestedStarters: [
      'Hello Emma! My name is...',
      'Nice to meet you! I am from Kerala.',
      'I am an English beginner and happy to practice.'
    ],
    emoji: '👋'
  },
  {
    id: 'family',
    titleEn: 'Talking About Family',
    titleMl: 'കുടുംബത്തെക്കുറിച്ച് സംസാരിക്കൽ',
    descriptionEn: 'Talk about your parents, brothers, sisters, and home life.',
    descriptionMl: 'അച്ഛനമ്മമാരെക്കുറിച്ചും, സഹോദരങ്ങളെക്കുറിച്ചും ലളിതമായി സംസാരിക്കാം.',
    partnerRoleEn: 'Classmate (David)',
    partnerRoleMl: 'സഹപാഠി (ഡേവിഡ്)',
    starterMessageEn: 'Hi there! I was just thinking about home. Could you tell me about your family?',
    starterMessageMl: 'ഹായ്! ഞാൻ വീടിനെക്കുറിച്ച് ഓർക്കുകയായിരുന്നു. നിങ്ങളുടെ കുടുംബത്തെക്കുറിച്ച് പറയാമോ?',
    suggestedStarters: [
      'There are four members in my family.',
      'My father works in a bank and my mother is a teacher.',
      'I have one brother and one sister.'
    ],
    emoji: '👨‍👩‍👧‍👦'
  },
  {
    id: 'college',
    titleEn: 'At College / School',
    titleMl: 'കോളേജിൽ / വിദ്യാലയത്തിൽ',
    descriptionEn: 'Discuss subjects, classes, teachers, and campus activities with a student.',
    descriptionMl: 'പഠിക്കുന്ന വിഷയങ്ങൾ, ക്ലാസ്സുകൾ, ലൈബ്രറി എന്നിവയെക്കുറിച്ച് സംസാരിക്കാം.',
    partnerRoleEn: 'College Friend (Priya)',
    partnerRoleMl: 'കോളേജ് സുഹൃത്ത് (പ്രിയ)',
    starterMessageEn: 'Hey! Did you attend the morning lecture today? What subject do you like the most?',
    starterMessageMl: 'ഹേയ്! ഇന്ന് രാവിലെ ക്ലാസ്സിൽ ഉണ്ടായിരുന്നോ? നിനക്ക് ഏറ്റവും ഇഷ്ടപ്പെട്ട വിഷയം ഏതാണ്?',
    suggestedStarters: [
      'Yes, I attended the English class.',
      'I really enjoy studying computer science.',
      'The lecture was very interesting today.'
    ],
    emoji: '🎓'
  },
  {
    id: 'shop',
    titleEn: 'At a Shop / Supermarket',
    titleMl: 'കടയിൽ സാധനങ്ങൾ വാങ്ങുമ്പോൾ',
    descriptionEn: 'Ask for grocery items, check prices, sizes, and billing options.',
    descriptionMl: 'സാധനങ്ങൾ ചോദിക്കാനും, വില തിരക്കാനും, പണം നൽകാനും ശീലിക്കാം.',
    partnerRoleEn: 'Shopkeeper (John)',
    partnerRoleMl: 'കടക്കാരൻ (ജോൺ)',
    starterMessageEn: 'Good day! Welcome to our store. How can I help you today?',
    starterMessageMl: 'നമസ്കാരം! ഞങ്ങളുടെ കടയിലേക്ക് സ്വാഗതം. ഞാൻ എന്താണ് സഹായിക്കേണ്ടത്?',
    suggestedStarters: [
      'I would like to buy a notebook and two pens.',
      'How much is this packet of tea?',
      'Can I pay using Google Pay or cash?'
    ],
    emoji: '🛒'
  },
  {
    id: 'friend',
    titleEn: 'Meeting a Friend',
    titleMl: 'സുഹൃത്തിനെ കാണുമ്പോൾ',
    descriptionEn: 'Catch up with a friend over tea, asking how they are and planning weekend fun.',
    descriptionMl: 'ചായ കുടിച്ച് വിശേഷങ്ങൾ ചോദിച്ചറിയാനും വാരാന്ത്യ പ്ലാനുകൾ സംസാരിക്കാനും.',
    partnerRoleEn: 'Close Friend (Sam)',
    partnerRoleMl: 'പ്രിയ സുഹൃത്ത് (സാം)',
    starterMessageEn: 'Hey buddy! Long time no see! How have you been doing lately?',
    starterMessageMl: 'ഹേയ് ചങ്ങാതീ! കണ്ടിട്ട് എത്ര നാളായി! എന്തൊക്കെയുണ്ട് പുതിയ വിശേഷങ്ങൾ?',
    suggestedStarters: [
      'I have been doing great, thank you!',
      'Let us go have a cup of hot tea.',
      'Are you free this Saturday evening?'
    ],
    emoji: '☕'
  },
  {
    id: 'directions',
    titleEn: 'Asking for Directions',
    titleMl: 'വഴി ചോദിക്കുമ്പോൾ',
    descriptionEn: 'Politely ask how to find a railway station, hospital, or bus stand in a new city.',
    descriptionMl: 'പുതിയൊരു നഗരത്തിൽ സ്റ്റേഷൻ, ആശുപത്രി എന്നിവ അന്വേഷിക്കാൻ.',
    partnerRoleEn: 'Helpful Local (Sarah)',
    partnerRoleMl: 'നാട്ടുകാരി (സാറ)',
    starterMessageEn: 'Hello there! You look like you are looking for something. Can I help you with directions?',
    starterMessageMl: 'ഹലോ! നിങ്ങൾ എന്തോ തിരയുന്നതുപോലെ തോന്നുന്നു. വഴി പറഞ്ഞുതരാൻ സഹായിക്കണോ?',
    suggestedStarters: [
      'Excuse me, could you tell me where the railway station is?',
      'Is there a bus stop near here?',
      'How far is the government hospital from here?'
    ],
    emoji: '🗺️'
  },
  {
    id: 'routines',
    titleEn: 'Daily Routines',
    titleMl: 'ദിനചര്യകൾ (Daily Routines)',
    descriptionEn: 'Describe your wake-up time, meals, work or study hours, and relaxing evenings.',
    descriptionMl: 'രാവിലെ ഉണരുന്നത് മുതൽ രാത്രി ഉറങ്ങുന്നത് വരെയുള്ള കാര്യങ്ങൾ വിവരിക്കാം.',
    partnerRoleEn: 'Speaking Coach (Alex)',
    partnerRoleMl: 'സംസാര പരിശീലകൻ (അലക്സ്)',
    starterMessageEn: 'Hi! Let us talk about daily habits. What time do you usually wake up in the morning?',
    starterMessageMl: 'ഹലോ! നമുക്ക് ദിവസേനയുള്ള ശീലങ്ങളെക്കുറിച്ച് സംസാരിക്കാം. സാധാരണയായി രാവിലെ എത്ര മണിക്കാണ് ഉണരുന്നത്?',
    suggestedStarters: [
      'I usually wake up at 6:30 AM every morning.',
      'After waking up, I drink warm tea and read the news.',
      'I go to work at 9 o’clock in the morning.'
    ],
    emoji: '⏰'
  }
];
