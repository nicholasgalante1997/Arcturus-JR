import React from 'react';

import { pipeline } from '@/utils/pipeline';

import HeaderView from './View';

function Header() {
  return <HeaderView />;
}

export default pipeline(React.memo)(Header) as React.MemoExoticComponent<typeof Header>;
