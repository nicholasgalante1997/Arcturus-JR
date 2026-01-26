import clsx from 'clsx';
import { memo, useState } from 'react';

import { pipeline } from '@/utils/pipeline';

import type { FAQItem } from '../../types';

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Are you available for freelance work?',
    answer:
      'I selectively take on freelance projects that align with my expertise. Feel free to reach out with details about your project.'
  },
  {
    question: 'Do you do consulting?',
    answer:
      "Yes, I offer consulting services for architecture reviews, performance optimization, and technical strategy. Let's discuss your needs."
  },
  {
    question: 'Can I use your code examples?',
    answer:
      'All code examples on this blog are available under the MIT license unless otherwise noted. Attribution is appreciated but not required.'
  },
  {
    question: 'How can I support your work?',
    answer:
      'The best way to support is by sharing articles you find helpful, providing feedback, or connecting with me on social media.'
  }
];

function FAQSectionView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="v2-contact-faq" aria-labelledby="faq-title">
      <h2 id="faq-title" className="v2-contact-faq__title">
        Frequently Asked Questions
      </h2>

      <div className="v2-contact-faq__list">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className={clsx('v2-contact-faq__item', openIndex === index && 'v2-contact-faq__item--open')}
          >
            <button
              type="button"
              className="v2-contact-faq__question"
              onClick={() => toggleFAQ(index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              {item.question}
              <svg className="v2-contact-faq__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M5 7.5l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div id={`faq-answer-${index}`} className="v2-contact-faq__answer" hidden={openIndex !== index}>
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default pipeline(memo)(FAQSectionView);
