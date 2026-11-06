import { GrammarTopic } from '../types';

export const LEVEL_GRAMMAR_TOPICS: GrammarTopic[] = [
  {
    id: 'intermediate_tenses',
    level: 'Intermediate',
    titleEn: 'Intermediate: Tenses in Context',
    titleMl: 'ഇന്റർമീഡിയറ്റ്: സന്ദർഭത്തിലെ കാലങ്ങൾ',
    descriptionEn: 'Choose tenses that match time, sequence and meaning.',
    descriptionMl: 'സമയത്തിനും സംഭവക്രമത്തിനും അനുസരിച്ച് ശരിയായ കാലം തിരഞ്ഞെടുക്കുക.',
    rulesMl: ['Present perfect: കഴിഞ്ഞ പ്രവർത്തനത്തിന് ഇപ്പോഴുള്ള ബന്ധം — I have finished my work.', 'Past continuous: കഴിഞ്ഞ സമയത്ത് നടന്നുകൊണ്ടിരുന്ന പ്രവർത്തി — I was reading.', 'First conditional: സാധ്യതയുള്ള ഭാവി — If it rains, we will stay home.'],
    questions: [
      {id:'it1',topicId:'intermediate_tenses',type:'multiple_choice',promptEn:'I ___ this book twice, so I know the story.',promptMl:'ഈ പുസ്തകം രണ്ടുതവണ വായിച്ചിട്ടുണ്ട്.',options:['read','have read','am reading','had read'],correctAnswer:'have read',explanationMl:'ഇപ്പോഴുള്ള അറിവുമായി ബന്ധമുള്ള അനുഭവം പറയുന്നതിനാൽ Present Perfect ഉപയോഗിക്കുന്നു.',explanationEn:'Present perfect describes an experience relevant to the present.'},
      {id:'it2',topicId:'intermediate_tenses',type:'fill_blank',promptEn:'When I called her, she ___ dinner.',promptMl:'ഞാൻ വിളിച്ചപ്പോൾ അവൾ അത്താഴം കഴിക്കുകയായിരുന്നു.',options:['cooked','was cooking','has cooked','cooks'],correctAnswer:'was cooking',explanationMl:'കഴിഞ്ഞ ഒരു സമയത്ത് നടന്നുകൊണ്ടിരുന്ന പ്രവർത്തിയാണ് Past Continuous.',explanationEn:'Past continuous describes an action in progress at a past time.'},
      {id:'it3',topicId:'intermediate_tenses',type:'multiple_choice',promptEn:'If you practise daily, you ___ more confident.',promptMl:'ദിവസവും പരിശീലിച്ചാൽ കൂടുതൽ ആത്മവിശ്വാസം ലഭിക്കും.',options:['became','would became','will become','become'],correctAnswer:'will become',explanationMl:'First Conditional: If + Present Simple, will + base verb.',explanationEn:'Use the first conditional for a realistic future possibility.'},
      {id:'it4',topicId:'intermediate_tenses',type:'arrange_sentence',promptEn:'Arrange the sentence correctly.',promptMl:'ശരിയായ വാക്യമായി ക്രമീകരിക്കുക.',shuffledWords:['already','has','She','left'],correctAnswer:'She has already left',explanationMl:'Subject + has + adverb + past participle എന്ന ക്രമം.',explanationEn:'The present perfect places the adverb before the past participle here.'}
    ]
  },
  {
    id: 'advanced_clarity',
    level: 'Advanced',
    titleEn: 'Advanced: Precision & Complex Sentences',
    titleMl: 'അഡ്വാൻസ്ഡ്: കൃത്യതയും സങ്കീർണ്ണ വാക്യങ്ങളും',
    descriptionEn: 'Practise formal structures, concise expression and nuanced grammar.',
    descriptionMl: 'ഔപചാരിക ഘടനകളും കൃത്യമായ പ്രയോഗങ്ങളും പരിശീലിക്കുക.',
    rulesMl: ['Despite + noun/gerund: Despite the rain, we continued.', 'Although + clause: Although it was late, we continued.', 'Parallel structure: Keep items in a list grammatically consistent.', 'Use who for people and which for things in defining relative clauses.'],
    questions: [
      {id:'ac1',topicId:'advanced_clarity',type:'multiple_choice',promptEn:'Choose the grammatically parallel sentence.',promptMl:'വ്യാകരണപരമായി ഒരേ ഘടനയിലുള്ള വാക്യം തിരഞ്ഞെടുക്കുക.',options:['She enjoys reading, swimming and to cycle.','She enjoys reading, swimming and cycling.','She enjoys to read, swimming and cycling.','She enjoys reading, to swim and cycling.'],correctAnswer:'She enjoys reading, swimming and cycling.',explanationMl:'ഒരു പട്ടികയിലെ പ്രവർത്തികൾ ഒരേ gerund ഘടനയിൽ വരണം.',explanationEn:'Items in a series should use parallel grammatical forms.'},
      {id:'ac2',topicId:'advanced_clarity',type:'multiple_choice',promptEn:'Choose the best formal alternative: “Because of the fact that it was raining, we left.”',promptMl:'കൂടുതൽ സംക്ഷിപ്തമായ ഔപചാരിക രൂപം തിരഞ്ഞെടുക്കുക.',options:['Due to it raining, we left.','Because it was raining, we left.','For the reason it rained, we left.','In view raining, we left.'],correctAnswer:'Because it was raining, we left.',explanationMl:'അർത്ഥം നിലനിർത്തി അനാവശ്യമായ വാക്കുകൾ ഒഴിവാക്കുക.',explanationEn:'Prefer concise wording without changing the meaning.'},
      {id:'ac3',topicId:'advanced_clarity',type:'fill_blank',promptEn:'The proposal, ___ was revised yesterday, is ready for review.',promptMl:'ഇന്നലെ തിരുത്തിയ നിർദ്ദേശം പരിശോധനയ്ക്ക് തയ്യാറാണ്.',options:['who','where','which','whose'],correctAnswer:'which',explanationMl:'Proposal ഒരു വസ്തുവായതിനാൽ which ഉപയോഗിക്കുന്നു.',explanationEn:'Use which to refer to a thing in this non-defining relative clause.'},
      {id:'ac4',topicId:'advanced_clarity',type:'multiple_choice',promptEn:'Choose the correct sentence.',promptMl:'ശരിയായ വാക്യം തിരഞ്ഞെടുക്കുക.',options:['Despite of the delay, we finished.','Despite the delay, we finished.','Although the delay, we finished.','In spite the delay, we finished.'],correctAnswer:'Despite the delay, we finished.',explanationMl:'Despite-ന് ശേഷം നേരിട്ട് noun phrase വരും; of ചേർക്കേണ്ടതില്ല.',explanationEn:'Despite is followed directly by a noun phrase, not “of”.'}
    ]
  }
];
