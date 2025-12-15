import { memo } from 'react';

import { useI18nContext } from '@/contexts/i18n/Context';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import V2HeroWidgetView from './View';

function V2HeroWidget() {
  const { t } = useI18nContext();
  return <V2HeroWidgetView 
    copy={{
      title: t('home.hero.display.name'),
      version: t('home.hero.display.version'),
      author: t('home.hero.display.author'),
      subtitle: t('home.hero.display.subtitle'),
      iteration: t('home.hero.display.iteration-text'),
    }}
  />;
}

export default pipeline(withProfiler('v2_Home_HeroWidget'), memo)(V2HeroWidget) as React.MemoExoticComponent<
  typeof V2HeroWidget
>;
