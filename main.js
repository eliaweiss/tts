

function createPhrases(phrases) {
    const container = document.createElement('div');
    container.classList.add('phrases-container'); // Add a class for styling

    phrases.forEach(phrase => {
      const phraseDiv = document.createElement('div');
      phraseDiv.classList.add('phrase'); // Add a class for styling

      const paragraph = document.createElement('div');
      paragraph.classList.add('pt')
      paragraph.textContent = phrase.pt;

      // Create a span element to hold the English translation
      const translationSpan = document.createElement('div');
      translationSpan.classList.add('en'); // Hide the translation initially
      translationSpan.classList.add('hidden'); // Hide the translation initially
      translationSpan.textContent = phrase.en;

     
      const buttons = document.createElement('div');
      buttons.classList.add('buttons'); // Hide the translation initially

      const buttonReadAloud = document.createElement('button');
      buttonReadAloud.textContent = 'Ouvir (PT)'; // Portuguese for "Listen (PT)"
      buttonReadAloud.addEventListener('click', () => readAloud(phrase.pt));
      buttons.appendChild(buttonReadAloud)

      const buttonShowTranslation = document.createElement('button');
      buttonShowTranslation.textContent = 'Tradução (EN)'; // Portuguese for "Translation (EN)"
      buttons.appendChild(buttonShowTranslation)
      // Add click event listener to toggle the visibility of the translation
      buttonShowTranslation.addEventListener('click', () => {
        translationSpan.classList.toggle('hidden');  // Toggle hidden class
      });


      phraseDiv.appendChild(paragraph);
      phraseDiv.appendChild(translationSpan);
      phraseDiv.appendChild(buttons);
      container.appendChild(phraseDiv);
    });

    document.body.appendChild(container);
  }



  // Example usage
  const phrases = [
    { pt: 'Olá, como você está?', en: 'Hi, how are you?' },
    { pt: 'Bom dia, prazer em conhecê-lo.', en: 'Good morning, nice to meet you.' },
    { pt: 'Obrigado por sua ajuda.', en: 'Thank you for your help.' },
    { pt: 'Até logo!', en: 'See you later!' }
  ];



  let voices = [];

  function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    // Example usage
    createPhrases(phrases);
  }

  function readAloud(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    // Select a specific voice for Brazilian Portuguese if available
    const selectedVoice = voices.find(voice => voice.lang === 'pt-BR' && voice.name.includes('Google'));
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  window.speechSynthesis.onvoiceschanged = loadVoices;

  // New function to read all pt phrases with a pause
  let isReading = false; // Global boolean variable

  async function readAllPhrases() {
    if (isReading) {
      isReading =  false; //
      return
    }
    isReading = true; // Set to true at the beginning

    let index = 0;
    while (isReading) {
      readAloud(phrases[index].pt);
      index++;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds


      if (index >= phrases.length) {
        index=0
      }
    }
  }
