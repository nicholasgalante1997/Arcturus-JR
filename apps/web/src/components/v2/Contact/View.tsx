import { memo } from 'react';

import config from '@/config/config';
import copy from '@/content/en.json';
import { pipeline } from '@/utils/pipeline';
import { withProfiler } from '@/utils/profiler';

import ContactFormView from './components/ContactForm/View';

const { contact } = copy;
const EMAIL = 'rustycloud42@protonmail.com';

function V2ContactPageView() {
  return (
    <div className="v2-contact-page v2-contact-editorial">
      <div className="wrapper">
        <header className="v2-contact-intro">
          <p className="v2-contact-intro__eyebrow">{contact.eyebrow}</p>
          <h1>{contact.title}</h1>
          <p className="v2-contact-intro__lead">{contact.introduction}</p>
          <p className="v2-contact-intro__aside">{contact.aside}</p>
        </header>

        <div className="v2-contact-layout">
          <section className="v2-contact-form-section" aria-labelledby="contact-form-title">
            <header>
              <h2 id="contact-form-title">{contact.formTitle}</h2>
              <p>{contact.formDescription}</p>
            </header>
            <ContactFormView />
          </section>

          <aside className="v2-contact-alternatives">
            <h2>{contact.alternativesTitle}</h2>
            <p>{contact.alternativesDescription}</p>
            <dl>
              <div>
                <dt>{contact.emailLabel}</dt>
                <dd>
                  <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </dd>
              </div>
              <div>
                <dt>{contact.primaryGithubLabel}</dt>
                <dd>
                  <a href={config.LINKS.GITHUB} target="_blank" rel="noreferrer">
                    nicholasgalante1997 <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>{contact.organizationGithubLabel}</dt>
                <dd>
                  <a href="https://github.com/mega-blastoise" target="_blank" rel="noreferrer">
                    mega-blastoise <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt>{contact.linkedinLabel}</dt>
                <dd>
                  <a href={config.LINKS.LINKEDIN} target="_blank" rel="noreferrer">
                    Connect on LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default pipeline(memo, withProfiler('v2_Contact_Page_View'))(V2ContactPageView);
