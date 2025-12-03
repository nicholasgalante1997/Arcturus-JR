const heroText = {
  title: 'Project Arcturus',
  version: 'v2',
  subtitle: `This is a space I've created to share thoughts, opinions, technical essays, instructional guides, tirades, and anything that doesn't fit into a stricter category above.`
};

function V2HeroWidgetView() {
  return (
    <section className="arc-v2__home-hero-widget flex flex-col justify-center items-center">
      <h1 className="arc-v2__home-hero-widget-title">
        {heroText.title}
        <small id="version">{heroText.version}</small>
      </h1>
      <p>
        <b>A Blog By Nick Galante</b>
      </p>

      <p><small><i>This is the <s>first</s> second iteration of Arcturus</i></small></p>
      <p className="arc-v2__home-hero-widget-subtitle">{heroText.subtitle}</p>
    </section>
  );
}

export default V2HeroWidgetView;
