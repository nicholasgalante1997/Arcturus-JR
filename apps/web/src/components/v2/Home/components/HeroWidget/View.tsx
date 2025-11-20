import React from "react";

const version = "jr. v2.0.0-rc.1";

function V2HeroWidgetView() {
    return (
        <section className="arc-v2__home-hero-widget flex flex-col justify-center items-center">
            <h1 className="arc-v2__home-hero-widget-title">
                Project Arcturus
            </h1>

            <small>{version}</small>
        </section>
    );
}

export default V2HeroWidgetView;