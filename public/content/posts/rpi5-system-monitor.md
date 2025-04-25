---
title: "Build a Real Time System Monitor for your Raspberry Pi using Rust, Actix Web, sysinfo, Docker, and Ngrok"
visible: true
slug: rpi5-system-monitor
---

Today, we'll build out a simple rust actix web server that will gather some system statistics using the sysinfo crate and serve it to a consumer in a requested format. Then, we'll use ngrok to open a tunnel to allow traffic to be served from within the raspberry pi to a public endpoint (an ephemeral one, although you can choose to set up a static long standing endpoint with ngrok all the same), so you can leave this app running as a background process if you want, and then you can just check on it periodically, depending on what you use your raspberry pi for.

## Project Setup

If you want to follow along with the complete source material, you can fork and clone [this repo here](https://github.com/nicholasgalante1997/rpi5-system-monitor).

Open up a terminal and navigate to a directory of your choosing, then we'll scaffold the project with cargo:

```bash
cargo new rpi5-system-monitor

cd rpi5-system-monitor
```

Here is what our dependency structure looks like (Cargo.toml):

```toml
[package]
name = "system-monitor"
...

[dependencies]
actix-cors = "0.7.0"
actix-web = "4"
anyhow = "1.0"
debugrs = "0.2.1"
dotenv = "0.15.0"
futures = "0.3.31"
futures-util = "0.3.31"
serde_json = "1.0.135"
serde = { version = "1.0.217", features = ["derive"] }
sysinfo = "0.34.2"
tokio = { version = "1.43.0", features = ["full"] }
```

So let's start setting up our project. Right now, we just have a simple `src/main.rs` entrypoint file with the basic new cargo app contents. Instead let's scrap all that, and set up a skeleton actix web server instead:

```rs
use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

Okay so now, we have a very basic actix web server that does absolutely nothing.

Let's start by setting up some very minimal logging middleware, to get a _little_ bit of observability into our system. For this, Im using `dotenv` and `debugrs`.

In the `src/main.rs` file:

```rs
use actix_web::{App, HttpServer};

mod env;
mod log;

use actix_web::{App, HttpServer};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

In `src/env/mod.rs`, a simpler dotenv wrapper:

```rs
pub fn setup_env() {
    dotenv::dotenv().ok();
}
```

In `src/log/mod.rs`, a simple factory that will produce inexpensive RsDebugger loggers with our localized namespace:

```rs
use debugrs::RsDebugger;

pub fn logger() -> RsDebugger {
    RsDebugger::new("nick@raspberrypi:system-info:middleware".to_string())
}
```

And then we can update our `src/main.rs` file with the following:

```rs
use actix_web::{App, HttpServer};

mod env;
mod log;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::setup_env();

    HttpServer::new(|| {
        App::new()
            .wrap_fn(|req, srv| {
                let logline = format!("{} {}", req.method(), req.path());
                debug!(log::logger(), logline);
                let fut = srv.call(req);
                async {
                    let res = fut.await?;
                    Ok(res)
                }
            })
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

And now we have a very minimal middleware that will log out all requests to the server with the following format:

**[namespace] METHOD /path**

OR

**[nick@raspberrypi:system-info:middleware] GET /health**

We can enable and disable this logger either programmatically or using environment variables, and in this case we'll opt to just use a simple .env file:

```.env
DEBUG=*
```

> The debugrs crate functions like the [javascript *debug* npm package](https://www.npmjs.com/package/debug), so if you're familiar with that project, you'll be right at home.

## Implementing the System Monitor

Okay so we'll start with the sysinfo crate, and how we'll make the necessary parts available to our application. The loose structure will be as follows:

1. When we start our app, we'll stand up references to the System, Disks, and Components struct instances (You can go above and beyond and add network monitoring with extremely little effort).
2. Well make these structs available to our request handlers using the [actix web Application State feature](https://actix.rs/docs/application/#state).
3. Within the handler, when we get a request, we'll extract the application state, and use it to instantiate a fresh instance of the `SystemReporter` struct (which we'll write together)
4. We'll use that instance of the `SystemReporter` to build a `SystemReport` struct instance
5. We can use methods available to instances of `SystemReport` to get the report in a format we want (in this case, we'll implement HTML, JSON, and RDF).
6. We can stream the report back from the request handler as the response to the browser or consumer

### The `sysinfo` Crate, and Standing Up the System, Disks, and Components Instances

> To learn more about the `sysinfo` crate, check out [the docs](https://docs.rs/sysinfo/latest/sysinfo/).

The `sysinfo` crate