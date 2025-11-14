import React, { memo } from 'react';

import { pipeline } from '@/utils/pipeline';

import { ContactForm } from './components/ContactForm';

function ContactView() {
  return (
    <div className="markdown-content">
      <ContactForm />
    </div>
  );
}

export default pipeline(memo)(ContactView) as React.MemoExoticComponent<React.ComponentType>;
