import React from 'react';

import { pipeline } from '@/utils/pipeline';

import ContactFormView from './View';

function ContactForm() {
  return <ContactFormView />;
}

export default pipeline(React.memo)(ContactForm) as React.MemoExoticComponent<React.ComponentType>;
