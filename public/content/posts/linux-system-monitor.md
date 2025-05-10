---
title: "Build a System Monitor for your Linux Machine using Rust, Actix Web, sysinfo, Docker, and Ngrok"
visible: true
slug: linux-system-monitor
---

Today, we'll build out a simple rust actix web server that will gather some system statistics using the sysinfo crate and serve it to a consumer in a requested format. Then, we'll use ngrok to open a tunnel to allow traffic to be served from within the linux host to a public endpoint (an ephemeral one, although you can choose to set up a static long standing endpoint with ngrok all the same), so you can leave this app running as a background process if you want, and then you can just check on it periodically, depending on what you use you host for.

## Project Setup

If you want to follow along with the complete source material, you can fork and clone [this repo here](https://github.com/nicholasgalante1997/linux-system-monitor).

Open up a terminal and navigate to a directory of your choosing, then we'll scaffold the project with cargo:

```bash
cargo new linux-system-monitor

cd linux-system-monitor
```

Here is what our dependency structure looks like (Cargo.toml):

```toml
[package]
name = "system-monitor"
...

[dependencies]
actix-cors = "0.7.0"
actix_files = "0.6.6"
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

And then we can update our `src/main.rs` file with the following:

```rs
use actix_web::{App, HttpServer};
use debugrs::log;

mod env;
mod log;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::setup_env();

    HttpServer::new(|| {
        App::new()
            .wrap_fn(|req, srv| {
                let logline = format!("{} {}", req.method(), req.path());
                log(logline);
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

**[namespace] METHOD /path +{time since last log}**

OR

**[linux-system-monitor] GET /api/http-views/pages/overview +25ms**

We can enable and disable this logger either programmatically or using environment variables, and in this case we'll opt to just use a simple .env file:

```.env
DEBUG=*
```

> The debugrs crate functions like the [javascript *debug* npm package](https://www.npmjs.com/package/debug), so if you're familiar with that project, you'll be right at home.

## Implementing the System Monitor

### The `sysinfo` Crate, and Standing Up the System, Disks, and Components Instances

> To learn more about the `sysinfo` crate, check out [the docs](https://docs.rs/sysinfo/latest/sysinfo/).

The `sysinfo` crate allows us to get insights/data into our computing resources, component temperatures, disk space, running processes, available memory, and a lot more.  

What we'll start by doing, is setting up a struct to represent our app state. We're going to take the approach of setting up our `sysinfo` struct instancesonce at application start, and then sharing it across requests as application state. From within the handlers, we can refresh the system statistics.  

> main.rs

```rs
use actix_web::{App, HttpServer};
use debugrs::debug;

mod app;
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

> src/app/mod.rs

```rs
use sysinfo::{Components, Disks, Networks, System};

use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct AppState {
    pub components: Arc<Mutex<Components>>,
    pub disks: Arc<Mutex<Disks>>,
    pub networks: Arc<Mutex<Networks>>,
    pub system: Arc<Mutex<System>>,
}

```

We want to use an `Arc` here, and since we expect to have, at times, a mutable reference to several of the fields above, we'll also want to use a `Mutex` here, so that we can get a lock on our mutable reference when we need it.

When we set this up in our `main.rs` file, it looks like this:

```rs
use actix_web::{App, HttpResponse, HttpServer, web};
use debugrs::debug;
use sysinfo::{Components, Disks, Networks, System};

use std::sync::{Arc, Mutex};

mod app;
mod env;
mod log;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::setup_env();

    let components = Components::new_with_refreshed_list();
    let disks = Disks::new_with_refreshed_list();
    let networks = Networks::new();
    let mut system = System::new_all();

    system.refresh_all();

    let app_state = app::AppState {
        components: Arc::new(Mutex::new(components)),
        disks: Arc::new(Mutex::new(disks)),
        networks: Arc::new(Mutex::new(networks)),
        system: Arc::new(Mutex::new(system)),
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
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

So now we've instantiated the system info structs we think we'll need. What we can do now is start setting up handlers for the endpoints that we want to support.

Let's start with the hypertext endpoints (html)

We can first update our `main.rs` file:

```rs
use actix_web::{App, HttpResponse, HttpServer, middleware, web};
use debugrs::debug;
use sysinfo::{Components, Disks, Networks, System};

use std::sync::{Arc, Mutex};

mod app;
mod env;
mod log;
mod services;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env::setup_env();

    let components = Components::new_with_refreshed_list();
    let disks = Disks::new_with_refreshed_list();
    let networks = Networks::new();
    let mut system = System::new_all();

    system.refresh_all();

    let app_state = app::AppState {
        components: Arc::new(Mutex::new(components)),
        disks: Arc::new(Mutex::new(disks)),
        networks: Arc::new(Mutex::new(networks)),
        system: Arc::new(Mutex::new(system)),
    };

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(app_state.clone()))
            .wrap_fn(|req, srv| {
                let logline = format!("{} {}", req.method(), req.path());
                debug!(log::logger(), logline);

                let fut = srv.call(req);
                async {
                    let res = fut.await?;
                    Ok(res)
                }
            })
            .service(
                web::scope("/api")
                    .wrap(middleware::Compress::default())
                    .configure(|config| {
                        config.service(services::http_views::routes::render_overview_as_html);
                        config.service(services::http_views::routes::render_cpu_as_html);
                        config.service(services::http_views::routes::render_memory_as_html);
                        config.service(services::http_views::routes::render_disks_as_html);
                    }),
            )
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
```

What we've done above, is set up a scope `"/api"` which will allow us to subpath any handlers within this web resource scope under the `/api` path, which is what we want for now. We also setup four routes within the `/api` scope: An **Overview** route, a **CPU** route, a **Memory** route, and a **Disks** route. We can use these routes to fetch hypertext representations of our system information at it's current state.  

Let's setup our `services` module.  

> src/services/mod.rs

```rs
pub mod http_views;
```

> src/services/http_views/mod.rs

```rs
pub mod routes {

    use actix_web::{get, web, HttpResponse, Responder};
    use anyhow::Error;
    use futures::{future::ok, stream::once};
    use crate::{app::AppState, models::system_report::SystemReporter, ui::HttpViews};

    #[get("/http-views/pages/overview")]
    pub async fn render_overview_as_html(app_state: web::Data<AppState>) -> impl Responder {
        let mut components = app_state.components.lock().unwrap();
        let mut disks = app_state.disks.lock().unwrap();
        let networks = app_state.networks.lock().unwrap();
        let mut system = app_state.system.lock().unwrap();
    
        let mut system_reporter = SystemReporter::new(&mut components, &mut disks, &networks, &mut system);
        let system_report = system_reporter.build_report();

        let view = HttpViews::get_overview_view(&system_report.system_info, &system_report.disks_report_info);
        let bytes = web::Bytes::from(view);
        let body = once(ok::<_, Error>(bytes));

        HttpResponse::Ok().content_type("text/html").streaming(body)
    }

    #[get("/http-views/pages/cpu")]
    pub async fn render_cpu_as_html(app_state: web::Data<AppState>) -> impl Responder {
        let mut components = app_state.components.lock().unwrap();
        let mut disks = app_state.disks.lock().unwrap();
        let networks = app_state.networks.lock().unwrap();
        let mut system = app_state.system.lock().unwrap();
    
        let mut system_reporter = SystemReporter::new(&mut components, &mut disks, &networks, &mut system);
        let system_report = system_reporter.build_report();

        let view = HttpViews::get_cpu_view(&system_report.system_info, &system_report.cpu_report_info);
        let bytes = web::Bytes::from(view);
        let body = once(ok::<_, Error>(bytes));

        HttpResponse::Ok().content_type("text/html").streaming(body)
    }

    #[get("/http-views/pages/memory")]
    pub async fn render_memory_as_html(app_state: web::Data<AppState>) -> impl Responder {

        let mut components = app_state.components.lock().unwrap();
        let mut disks = app_state.disks.lock().unwrap();
        let networks = app_state.networks.lock().unwrap();
        let mut system = app_state.system.lock().unwrap();

        let mut system_reporter = SystemReporter::new(&mut components, &mut disks, &networks, &mut system);
        let system_report = system_reporter.build_report();

        let view = HttpViews::get_memory_view(&system_report.system_info);
        let bytes = web::Bytes::from(view);
        let body = once(ok::<_, Error>(bytes));
        HttpResponse::Ok().content_type("text/html").streaming(body)
    }


    #[get("/http-views/pages/disks")]
    pub async fn render_disks_as_html(app_state: web::Data<AppState>) -> impl Responder {

        let mut components = app_state.components.lock().unwrap();
        let mut disks = app_state.disks.lock().unwrap();
        let networks = app_state.networks.lock().unwrap();
        let mut system = app_state.system.lock().unwrap();

        let mut system_reporter = SystemReporter::new(&mut components, &mut disks, &networks, &mut system);
        let system_report = system_reporter.build_report();

        let view = HttpViews::get_disks_view(&system_report.disks_report_info);
        let bytes = web::Bytes::from(view);
        let body = once(ok::<_, Error>(bytes));
        HttpResponse::Ok().content_type("text/html").streaming(body)
    }

}
```

That's a lot at once. Let's break it down slowly.

First, we setup an encapsulating `routes` module:

```rs
pub mod routes {
    // ...
}
```

Then we load modules that we'll need from some external crates and our own crate:

```rs
pub mod routes {
    use actix_web::{get, web, HttpResponse, Responder};
    use anyhow::Error;
    use futures::{future::ok, stream::once};
    use crate::{app::AppState, models::system_report::SystemReporter, ui::HttpViews};
}
```

You might be already familiar with the `app::AppState` struct since we built that together. Don't worry about not recognizing the `models::system_report::SystemReporter` or `ui::HttpViews` structs, we haven't built those yet, but we're about to!

We want to bring in `anyhow::Error` for Errors that may be thrown during our request handler operation, and `futures` so that we can stream back the response after generating it.  

We deconstruct our shared app state, and get locks for each field in the struct. Once we have access to our `System` instance, `Disks` instance list, and `Components` instance list, we can construct a new instance of our `SystemReporter` struct and use it to build a `SystemReport`.

Let's implement those structs now.

> src/main.rs

```rs
...
mod app;
mod env;
mod log;
mod models; // Add this
mod services;
...
```

> src/models/mod.rs

```rs
pub mod builders;
pub mod data_objects;
pub mod system_report;
pub mod temperature_severity_status;
```

> src/models/system_report/mod.rs

```rs
use serde::{Serialize, Deserialize};
use sysinfo::{
    Components, CpuRefreshKind, Disks, MemoryRefreshKind, Networks, RefreshKind, System,
};

use crate::{
    models::{
        builders::{
            component_info::ComponentReportInfoBuilder, cpu_info::CpuInfoBuilder,
            disk_info::DiskReportInfoBuilder, system_info_builder::SystemInfoBuilder,
        },
        data_objects::{
            component_info::ComponentReportInfo, cpu_info::CpuReportInfo,
            disk_info::DiskReportInfo, system_info::SystemReportInfo,
        },
        temperature_severity_status::TemperatureSeverityStatus,
    },
    utils,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NetworkReportInfo {}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemReport {
    pub components_report_info: Vec<ComponentReportInfo>,
    pub cpu_report_info: Vec<CpuReportInfo>,
    pub disks_report_info: Vec<DiskReportInfo>,
    pub network_report_info: NetworkReportInfo,
    pub system_info: SystemReportInfo,
}

impl SystemReport {
    pub fn into_html(&self) -> String {
        format!(
            r#"
                <div class="cards-container">
                    <!-- Platform Info Card -->
                    {}

                    <!-- Memory Card -->
                    {}

                    <!-- CPU Cards -->
                    {}

                    <!-- Temperature Card -->
                    {}

                    <!-- Disks Cards -->
                    {}
                </div>
            "#,
            &self.convert_platform_data_to_markup_card(),
            &self.convert_memory_info_to_markup_card(),
            &self.convert_cpus_to_markup_cards(),
            &self.convert_components_info_into_temperature_markup_cards(),
            &self.convert_disks_to_markup_card(),
        )
    }

    fn convert_cpus_to_markup_cards(&self) -> String {
        let mut cpu_markup = String::new();
        for cpu in &self.cpu_report_info {
            let card = format!(
                r#"
                    <!-- CPU Card -->
                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-server"></i>
                            CPU
                        </div>
                        <div class="info-row">
                            <span class="info-label">Model</span>
                            <span class="info-value">{}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Core Name</span>
                            <span class="info-value">{}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Clock Speed</span>
                            <span class="info-value">1.8 GHz</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">CPU Usage</span>
                            <span class="info-value">{}%</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: {}%"></div>
                        </div>
                    </div>
                "#,
                &cpu.brand, &cpu.name, &cpu.usage_percent, &cpu.usage_percent,
            );

            cpu_markup.push_str(&card);
        }

        cpu_markup
    }

    fn convert_platform_data_to_markup_card(&self) -> String {
        format!(
            r#"
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-microchip"></i>
                        Platform Information
                    </div>
                    <div class="info-row">
                        <span class="info-label">Operating System</span>
                        <span class="info-value">{}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Kernel Version</span>
                        <span class="info-value">{}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Num Cpus</span>
                        <span class="info-value">{}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Architecture</span>
                        <span class="info-value">{}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Hostname</span>
                        <span class="info-value">{}</span>
                    </div>
                </div>
            "#,
            &self.system_info.system_os_version,
            &self.system_info.system_kernal_version,
            &self.system_info.num_cpus,
            &self.system_info.cpu_arch,
            &self.system_info.system_host_name,
        )
    }

    fn convert_memory_info_to_markup_card(&self) -> String {
        format!(
            r#"
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-memory"></i>
                        Memory
                    </div>
                    <div class="info-row">
                        <span class="info-label">Total Memory</span>
                        <span class="info-value">{:.3} GB</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Used Memory</span>
                        <span class="info-value">{:.3} GB</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: {}%"></div>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Available Memory</span>
                        <span class="info-value">{:.3} GB</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Swap Usage</span>
                        <span class="info-value">{:.3} MB / {:.3} GB</span>
                    </div>
                </div>
            "#,
            utils::convert_bytes_to_gbs(self.system_info.total_memory),
            utils::convert_bytes_to_gbs(self.system_info.used_memory),
            utils::convert_to_percent(self.system_info.used_memory, self.system_info.total_memory),
            utils::convert_bytes_to_gbs(self.system_info.available_memory),
            utils::convert_bytes_to_mbs(self.system_info.used_swap),
            utils::convert_bytes_to_gbs(self.system_info.total_swap),
        )
    }

    fn convert_disks_to_markup_card(&self) -> String {
        let mut cards = String::new();

        let _ = &self.disks_report_info.iter().for_each(|disk| {
            let card = format!(
                r#"
                    <div class="card">
                        <div class="card-title">
                            <i class="fas fa-hdd"></i>
                            Storage
                        </div>
                        <div class="info-row">
                            <span class="info-label">Device</span>
                            <span class="info-value">{:?} {:#?}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">FS</span>
                            <span class="info-value">{:#?}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Total Space</span>
                            <span class="info-value">{:.3} GB</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Available</span>
                            <span class="info-value">{:.2} GB ({:.1}%)</span>
                        </div>
                        <div class="progress-container">
                            <div class="progress-bar" style="width: {}%"></div>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Bytes Read / Bytes Written</span>
                            <span class="info-value">{}B / {}B</span>
                        </div>
                    </div>        
                "#,
                disk.name,
                disk.mount_point,
                disk.file_system,
                utils::convert_bytes_to_gbs(disk.total_space),
                utils::convert_bytes_to_gbs(disk.available_space),
                utils::convert_to_percent(disk.available_space, disk.total_space),
                100.0_f64 - utils::convert_to_percent(disk.available_space, disk.total_space),
                disk.usage_total_read_bytes,
                disk.usage_total_write_bytes
            );

            cards.push_str(&card);
        });

        cards
    }

    fn convert_components_info_into_temperature_markup_cards(&self) -> String {
        let mut cards = format!(
            r#"
                <div class="card">
                    <div class="card-title">
                        <i class="fas fa-thermometer-half"></i>
                        System Temperatures
                    </div>
            "#
        );

        let _ = &self.components_report_info.iter().for_each(|component| {
            let severity = TemperatureSeverityStatus::get_severity_color_based_on_temperature_status(
                component.status.clone()
            );

            let card = format!(
                r#"
                    <div class="info-row">
                        <span class="info-label">{} CPU Temperature</span>
                        <div class="temperature-indicator">
                            <span class="temperature-value {}">{}°C</span>
                        </div>
                    </div>
                "#,
                &component.label,
                severity,
                &component.temperature,
            );

            cards.push_str(&card);
        });

        cards.push_str(
            r#"
            </div>
        "#,
        );

        cards
    }


}

pub struct SystemReporter<'a> {
    components: &'a mut Components,
    disks: &'a mut Disks,
    networks: &'a Networks,
    system: &'a mut System,
}

impl<'a> SystemReporter<'a> {
    pub fn new(
        components: &'a mut Components,
        disks: &'a mut Disks,
        networks: &'a Networks,
        system: &'a mut System,
    ) -> Self {
        SystemReporter {
            components,
            disks,
            networks,
            system,
        }
    }

    pub fn build_report(&mut self) -> SystemReport {
        
        // Refresh system handle specifics
        self.system.refresh_specifics(
            RefreshKind::nothing()
                .with_cpu(CpuRefreshKind::everything())
                .with_memory(MemoryRefreshKind::everything()),
        );

        self.system.refresh_cpu_usage();
        std::thread::sleep(sysinfo::MINIMUM_CPU_UPDATE_INTERVAL);
        self.system.refresh_cpu_usage();

        let platform = System::distribution_id();
        let cpu_arch = System::cpu_arch();
        let num_cpus: u8 = self.system.cpus().len().try_into().expect("(Error): This machine supercedes 256 individual cpu units");

        let system_name = System::name().unwrap_or_else(|| "Undetermined".to_string());
        let system_kernal_version =
            System::kernel_version().unwrap_or_else(|| "Undetermined".to_string());
        let system_os_version =
            System::long_os_version().unwrap_or_else(|| "Undetermined".to_string());
        let system_host_name = System::host_name().unwrap_or_else(|| "Undetermined".to_string());

        let uptime = System::uptime();

        let mut system_info_builder = SystemInfoBuilder::new();

        let system_info = system_info_builder
            .set_available_memory(self.system.available_memory())
            .set_used_memory(self.system.used_memory())
            .set_total_memory(self.system.total_memory())
            .set_available_swap(self.system.total_swap() - self.system.used_swap())
            .set_used_swap(self.system.used_swap())
            .set_total_swap(self.system.total_swap())
            .set_platform(&platform)
            .set_system_name(&system_name)
            .set_system_host_name(&system_host_name)
            .set_system_kernal_version(&system_kernal_version)
            .set_system_os_version(&system_os_version)
            .set_cpu_arch(&cpu_arch)
            .set_num_cpus(num_cpus)
            .set_total_cpu_usage(self.system.global_cpu_usage())
            .set_uptime_in_seconds(uptime)
            .build();

        let mut cpu_info_reports: Vec<CpuReportInfo> = Vec::new();
        let cpus = self.system.cpus();
        for cpu in cpus {
            let cpu_brand = cpu.brand();
            let cpu_frequency = cpu.frequency();
            let cpu_name = cpu.name();
            let cpu_usage = cpu.cpu_usage();
            let cpu_vendor_id = cpu.vendor_id();

            let cpu_report_info_builder = CpuInfoBuilder::new();
            let cpu_report_info = cpu_report_info_builder
                .set_brand(cpu_brand.to_string())
                .set_frequency(cpu_frequency)
                .set_name(cpu_name.to_string())
                .set_usage_percent(cpu_usage)
                .set_vendor_id(cpu_vendor_id.to_string())
                .build();

            cpu_info_reports.push(cpu_report_info);
        }

        let mut disks_info_reports: Vec<DiskReportInfo> = Vec::new();
        for disk in self.disks.iter_mut() {
            disk.refresh();

            let name = disk.name();
            let mount_point = disk.mount_point();
            let file_system = disk.file_system();
            let kind = disk.kind();
            let total_space = disk.total_space();
            let available_space = disk.available_space();
            let used_space = total_space - available_space;
            let usage = disk.usage();
            let total_read_bytes = usage.total_read_bytes;
            let total_written_bytes = usage.total_written_bytes;

            let disk_report_info_builder = DiskReportInfoBuilder::new();
            let disk_report_info = disk_report_info_builder
                .set_available_space(available_space)
                .set_used_space(used_space)
                .set_total_space(total_space)
                .set_percentage_free(utils::convert_to_percent(available_space, total_space))
                .set_usage_total_read_bytes(total_read_bytes)
                .set_usage_total_write_bytes(total_written_bytes)
                .set_kind(format!("{:#?}", kind).as_str())
                .set_file_system(format!("{:#?}", file_system).as_str())
                .set_mount_point(format!("{:#?}", mount_point).as_str())
                .set_name(format!("{:#?}", name).as_str())
                .build();

            disks_info_reports.push(disk_report_info);
        }

        let mut component_info_reports: Vec<ComponentReportInfo> = Vec::new();
        for component in self.components.iter_mut() {
            component.refresh();

            let label = component.label();
            let temperature = match component.temperature() {
                Some(temp) => temp,
                None => 0.0_f32,
            };
            let critical = component.critical();

            let component_report_info_builder = ComponentReportInfoBuilder::new();
            let component_report_info = component_report_info_builder
                .set_label(label.to_string())
                .set_temperature(temperature)
                .set_critical_temperature(critical)
                .set_status(TemperatureSeverityStatus::get_temperature_status(
                    temperature,
                    critical,
                ))
                .build();

            component_info_reports.push(component_report_info);
        }

        SystemReport {
            components_report_info: component_info_reports,
            cpu_report_info: cpu_info_reports,
            disks_report_info: disks_info_reports,
            network_report_info: NetworkReportInfo {},
            system_info,
        }
    }
}

```