import React from 'react';

import { pipeline } from '@/utils/pipeline';

import { type DefaultFallbackErrorComponentProps } from './types';
import DefaultErrorComponentView from './View';

function DefaultErrorComponent({ error, reset }: DefaultFallbackErrorComponentProps) {
  return <DefaultErrorComponentView error={error} reset={reset} />;
}

export default pipeline(React.memo)(DefaultErrorComponent) as React.MemoExoticComponent<
  React.ComponentType<DefaultFallbackErrorComponentProps>
>;
