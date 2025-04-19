<!-- This is not markdown! Hmph! -->

<div class="about-hero-section">
    <div class="about-hero-image-container">
        <img src="/assets/doodles-ember.avif" alt="Profile Image">
    </div>
    <div class="about-hero-text-container">
        <div class="about-text-typing-container">
          <h1 class="about-hero-text"></h1>
        </div>
    </div>
</div>

<div class="about-content-container">
  <h2>Professional History</h2>
  <section class="occupation-section">
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Charter Communications, Experience Standards Organization</h3>
          <p class="card-subtitle">Senior Software Engineer, Senior Design Technologist</p>
        </div>
        <div class="card-meta">
          <div>Greenwood Village, Colorado</div>
          <div>Aug 2023 - Present</div>
        </div>
      </div>
      <div class="card-content">
        <ul>
          <li><strong>Microfrontend System Audit</strong> Audited an internal distributed microfrontend SAAS Dashboard application, using Babel, Treesitter, React, and Bun.js to convert internal packages into source code ASTs for granular analysis. Created a graph database neo4j instance within a shared docker compose network alongside a Bun.js server & process that allowed for automated scraping of internal packages using the Bitbucket REST API for audit analysis and reporting to the shared neo4j database. Constructed an API to serve graph nodes and relationships to restful consumers. Created a matrix of export and import dependencies.</li>
          <li><strong>Prototyping Tooling</strong> Created a template for rapid React.js Web UI prototyping with a customizable Bun.js server and websocket infrastructure, build system configuration, and release pipeline CICD configuration.</li>
          <li><strong>R&D Prototyping Lead</strong> Developed R&D Prototypes for Spectrum Core Ordering, Spectrum Core Billing, and Spectrum Core Mobile. Led User Experience Testing with current Spectrum Core Agents for iterative feedback and deployments. Used pilot role configurations to release in iterative a/b rollouts waves to end Spectrum Agent Users.</li>
          <li><strong>Real-Time Communication Prototype:</strong> Designed and implemented a real-time chat Agent/Customer prototype for agent-customer interactions facilitated by Generative AI Models, leveraging React, Websockets, Bun.js and internal LMs data.</li>
          <li><strong>Adaptive and Accessible UI Migration</strong> Led a workstream to refactor the existing internal SAAS sales dashboard UI to ensure the application was fully responsive at mobile and tablet sizes, and accessible in accordance with the WCAGII Standard Compliance recommendations.</li>
          <li><strong>Figma Plugins & Figma Rest API Tooling:</strong> Developed a suite of Figma tooling to support Design System synchronization efforts using the Figma Rest API and Figma Plugin API and React with Esbuild. Plugins were deployed internally and served the function of allowing for quick vcs of Figma Files (analagous to a git command line tool but for Figma's Version History API), and the bidirectional synchronization of design tokens from a Figma File as Figma Variables and a Code Repository as Amazon Style Dictionary Design Tokens.</li>
        </ul>
        <div class="tech-tags">
          <span class="tech-tag">JavaScript</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">React</span>
          <span class="tech-tag">Vue</span>
          <span class="tech-tag">GSAP.js</span>
          <span class="tech-tag">Three.js</span>
          <span class="tech-tag">Node.js</span>
          <span class="tech-tag">Bun</span>
          <span class="tech-tag">Rust</span>
          <span class="tech-tag">Java</span>
          <span class="tech-tag">Spring Boot</span>
          <span class="tech-tag">Gitlab CI/CD</span>
          <span class="tech-tag">Figma API</span>
          <span class="tech-tag">Bitbucket REST API</span>
          <span class="tech-tag">Gitlab CI/CD</span>
          <span class="tech-tag">Docker</span>
          <span class="tech-tag">Amazon Web Services</span>
          <span class="tech-tag">Amazon EKS</span>
          <span class="tech-tag">Neo4j</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Amazon, Amazon Games Organization</h3>
          <p class="card-subtitle">Software Development Engineer, SDE Interviewer</p>
        </div>
        <div class="card-meta">
          <div>Seattle, Washington</div>
          <div>Sep 2021 - June 2023</div>
        </div>
      </div>
      <div class="card-content">
        <ul>
          <li><strong>Improved Digitial Goods Enterprise Purchase Service Reliability:</strong> Developed a suite of synthetic integration tests for Digital Goods Fulfillment endpoints that ran on a Fargate at 5 minute intervals, and would alert the CloudFormation stack if the service was unavailable, was experiencing high latency that surpassed the SLA threshold, or was failing health checks.</li>
          <li><strong>Accelerated Build Times for the Amazon Digital Goods Detail Page Web Application:</strong> Led a R&D spike regarding the migration of a monolithic Next.js web app to distributed micro-frontends, using Webpack's Module Federation and Native Webpack Plugins, reducing build times from 11 to 6 minutes and reducing the package size into several smaller, more modular chunks.</li>
          <li><strong>Enhanced Reliabaility of EU Region Amazon Digital Goods Checkout Page Payment Flows:</strong> Designed and implemented an isomorphic payment flow for European and EMEA Region marketplaces, allowing for the implementation of one time payments for authenticated users, and dedicated removal of payment record within EU Data Privacy requirement timelines.</li>
          <li><strong>Gotham Design System Founder</strong> Served as Founder and Lead Developer for Gotham Design System, which was a net new Amazon Design System that maintained implementation libraries in React, Angular, and Native Components; this design system was used for supporting Amazon Prime Gaming, Amazon Digital Goods, and Prime Video User Interfaces.</li>
        </ul>
        <div class="tech-tags">
          <span class="tech-tag">JavaScript</span>
          <span class="tech-tag">TypeScript</span>
          <span class="tech-tag">React</span>
          <span class="tech-tag">Next.js</span>
          <span class="tech-tag">Micro-Frontends</span>
          <span class="tech-tag">Design Systems</span>
          <span class="tech-tag">Amazon Web Services</span>
          <span class="tech-tag">Java</span>
          <span class="tech-tag">GraphQL</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Infosys Limited</h3>
          <p class="card-subtitle">Software Engineer</p>
        </div>
        <div class="card-meta">
          <div>Denver, Colorado</div>
          <div>Jan 2021 - Aug 2021</div>
        </div>
      </div>
      <div class="card-content">
        <ul>
          <li><strong>Automated Telecommunication Disconnect Processes for CenturyLink:</strong> Developed an event-driven architecture to automate CenturyLink's service disconnect process, removing agent manual intervention from the disconnect process by creating an event dispatching queue for different phases of a disconnect order, and expediting disconnect scheduling timelines by over 41%.</li>
          <li><strong>Extensive Java and DSA Training:</strong> Earned certifications in Java, Data Structures and Algorithms, REST API Development (Spring Boot), Modern Angular and React Web Development, and Cloud Deployment using Azure.</li>
        </ul>
        <div class="tech-tags">
          <span class="tech-tag">Java</span>
          <span class="tech-tag">DSA</span>
          <span class="tech-tag">REST API Development</span>
          <span class="tech-tag">RabbitMQ</span>
          <span class="tech-tag">Spring Boot</span>
          <span class="tech-tag">Angular</span>
          <span class="tech-tag">React</span>
          <span class="tech-tag">Azure</span>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">Intuily, Inc. (Formerly Sodalyt)</h3>
          <p class="card-subtitle">Lead Mobile App Developer</p>
        </div>
        <div class="card-meta">
          <div>New York City, NY</div>
          <div>May 2020 - Jan 2021</div>
        </div>
      </div>
      <div class="card-content">
        <ul>
          <li><strong>Delivered a Cloud-Based App:</strong> Built a mobile app for a cloud based service provider platform with React Native, AWS AppSync, and AWS SageMaker, and deployed the application across Google Play and Apple App Stores.</li>
          <li><strong>Automated Deployment Pipelines:</strong> Created CI/CD pipelines for deploying native app artifacts to app stores on merges into main with proper validation, testing, and bake time in lower environments.</li>
        </ul>
        <div class="tech-tags">
          <span class="tech-tag">React Native</span>
          <span class="tech-tag">AWS AppSync</span>
          <span class="tech-tag">AWS SageMaker</span>
          <span class="tech-tag">CI/CD</span>
        </div>
      </div>
    </div>
  </section>
  <h2>Open Source</h2>
  <section class="open-source-section">
    <div class="card project-card">
      <a href="https://www.npmjs.com/package/sleepydogs" target="_blank"><h3 class="project-title">NPM - sleepydogs</h3></a>
      <p class="project-description">This is a library of different zero dependency Typescript modules for common coding patterns.</p>
      <div class="tech-tags">
        <span class="tech-tag">Javascript</span>
        <span class="tech-tag">Typescript</span>
        <span class="tech-tag">NPM</span>
        <span class="tech-tag">Standard Readme</span>
        <span class="tech-tag">Jest</span>
      </div>
    </div>
    <div class="card project-card">
      <a href="https://crates.io/crates/debugrs" target="_blank"><h3 class="project-title">Crates.io - debugrs</h3></a>
      <p class="project-description">Created a lightweight threadsafe rust logging library based on the common node.js utility: debug</p>
      <div class="tech-tags">
        <span class="tech-tag">Rust</span>
        <span class="tech-tag">Crates.io</span>
      </div>
    </div>
  </section>
  <h2>Personal Projects</h2>
  <section class="personal-projects-section">
    <div class="card project-card">
      <h3 class="project-title">LazyOllama</h3>
      <p class="project-description">Browser-based GUI that serves as a SAAS Dashboard for the Ollama REST Client, allowing a user to pull, run, and manage open source AI models on their own hardware using Ollama and Open-WebUI.</p>
      <div class="tech-tags">
        <span class="tech-tag">Typescript</span>
        <span class="tech-tag">WebSockets</span>
        <span class="tech-tag">React</span>
        <span class="tech-tag">Turborepo</span>
        <span class="tech-tag">Bun.js</span>
        <span class="tech-tag">Open-WebUI</span>
        <span class="tech-tag">Ollama</span>
        <span class="tech-tag">Docker</span>
        <span class="tech-tag">Rust</span>
        <span class="tech-tag">Postgres</span>
        <span class="tech-tag">NGINX</span>
      </div>
    </div>
    <div class="card project-card">
      <h3 class="project-title">Pokemon Color Synchronizer</h3>
      <p class="project-description">A cross browser lighting platform that synchronizes multiple browser windows and tabs to the same animated color wheel, theme. Allows a user to distill a theme wheel from a chosen pokemon. This one's mad cool.</p>
      <div class="tech-tags">
        <span class="tech-tag">ES6</span>
        <span class="tech-tag">Broadcast Channel</span>
        <span class="tech-tag">PokemonTCGAPI</span>
        <span class="tech-tag">Pokemon API</span>
      </div>
    </div>
  </section>
  <h2>Interests</h2>
  <section class="interests-section">
    <div class="card">
      <div class="card-content">
        <ul>
          <li><strong>My Dogs and My Fiance:</strong> Wouldn't have made it here without them, they're the best. I'm happy to say I'm also super interested in them.</li>
          <li><strong>The Dallas Cowboys:</strong> It's a down year alright, but a real fan rides the ups and downs, knowing that Jones family will eventually move to Romania in exile.</li>
          <li><strong>The Eagles (The Band, not the Football Team):</strong> If you come across a better song than <a href="">Desperado</a>, don't tell me about it.</li>
          <li><strong>Web Performance Optimization:</strong> Researching and implementing techniques to maximize frontend performance and user experience based on new browser and ecmascript features.</li>
          <li><strong>SOLID Protocol</strong> Data Emancipation in the Digital Age. You should read up on the SOLID protocol. It's the abandoned step-child of Tim Berner's Lee</li>
          <li><strong>Rust, and Systems and Embedded Programming</strong> Rust is just my favorite. I could go on forever, but I won't. I love Rust, and it's allowing me to level up as a programmer in ways I could not previously imagine.</li>
          <li><strong>Micro-Frontend Architecture:</strong> Developing strategies for implementing and scaling micro-frontend approaches in enterprise applications.</li>
          <li><strong>Thanks for getting this far, and taking an interest in my interests.</strong></li>
        </ul>
      </div>
    </div>
  </section>
</div>