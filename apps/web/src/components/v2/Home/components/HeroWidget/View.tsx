import type { HeroWidgetViewProps } from './types';

function V2HeroWidgetView({ copy }: HeroWidgetViewProps) {
  return (
    <section className="arc-v2__home-hero-widget flex flex-col justify-center items-center">
      <h1 className="arc-v2__home-hero-widget-title">
        {copy.title}
        <small id="version">{copy.version}</small>
      </h1>
      <p>
        <b>{copy.author}</b>
      </p>

      <p>
        <small>
          <i>{copy.iteration}</i>
        </small>
      </p>
      <p className="arc-v2__home-hero-widget-subtitle">{copy.subtitle}</p>
    </section>
  );
}

export default V2HeroWidgetView;
