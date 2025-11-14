import React from 'react';

import { pipeline } from '@/utils/pipeline';

import ContactView from './View';

function Contact() {
  return <ContactView />;
}

export default pipeline(React.memo)(Contact);
