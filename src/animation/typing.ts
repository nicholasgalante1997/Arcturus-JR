export function runTypewriterAnimation(element: HTMLElement) {
  const textPhrases = [
    "Hi, I'm Nick <wave>",
    'I am a Senior Software Engineer @ Charter Communications',
    'Opinonated about the Web',
    'Unyielding Bar Raiser'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100; // Speed in milliseconds
  let phraseChangeTimeout: NodeJS.Timeout | null = null;

  function typeText() {
    // Clear any existing timeouts to prevent multiple running at once
    if (phraseChangeTimeout) {
      clearTimeout(phraseChangeTimeout);
    }

    const currentPhrase = textPhrases[phraseIndex];

    if (element && currentPhrase) {
      if (isDeleting) {
        // Deleting text
        element.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Faster when deleting

        // If deletion is complete, change to typing mode
        if (charIndex === 0) {
          isDeleting = false;

          // Move to next phrase
          phraseIndex = phraseIndex === textPhrases.length - 1 ? 0 : phraseIndex + 1;

          // Small pause before starting to type the next phrase
          typingSpeed = 500;
        }
      } else {
        // Typing text
        element.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100; // Normal typing speed

        // If typing is complete, wait 4 seconds then start deleting
        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          typingSpeed = 2000; // Wait before starting to delete
        }
      }
    }

    // Schedule the next animation frame
    phraseChangeTimeout = setTimeout(typeText, typingSpeed);
  }

  typeText();
}
