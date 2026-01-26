import { memo } from "react";

import { pipeline } from "@/utils/pipeline";
import type { ContactInfoProps } from "../../types";

function ContactInfoView({ email, socialLinks }: ContactInfoProps) {
  return (
    <aside className="v2-contact-info">
      <h2 className="v2-contact-info__title">Other Ways to Connect</h2>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Email</h3>
        <a href={`mailto:${email}`} className="v2-contact-info__email">
          {email}
        </a>
      </div>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Social</h3>
        <ul className="v2-contact-info__social-list">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                className="v2-contact-info__social-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="v2-contact-info__social-icon">{link.icon}</span>
                <span className="v2-contact-info__social-name">{link.name}</span>
                <span className="v2-contact-info__social-username">
                  @{link.username}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="v2-contact-info__section">
        <h3 className="v2-contact-info__section-title">Response Time</h3>
        <p className="v2-contact-info__text">
          I typically respond within 24-48 hours during weekdays.
        </p>
      </div>
    </aside>
  );
}

export default pipeline(memo)(ContactInfoView);
