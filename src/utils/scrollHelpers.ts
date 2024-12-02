const SCROLL_OPTIONS: ScrollIntoViewOptions = { 
  behavior: 'smooth',
  block: 'start'
};

const NEXT_BUTTON_SCROLL_OPTIONS: ScrollIntoViewOptions = { 
  behavior: 'smooth',
  block: 'center'
};

export const scrollToElement = (selector: string, options: ScrollIntoViewOptions = SCROLL_OPTIONS) => {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView(options);
  }
};

export const scrollToNextButton = () => {
  setTimeout(() => {
    const nextButton = document.querySelector('[data-next-button]');
    if (nextButton) {
      nextButton.scrollIntoView(NEXT_BUTTON_SCROLL_OPTIONS);
    }
  }, 100);
};

export const scrollToNavigation = () => {
  setTimeout(() => {
    scrollToElement('[data-wizard-navigation]');
  }, 100);
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
};