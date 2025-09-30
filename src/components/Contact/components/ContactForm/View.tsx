import { pipeline } from "@/utils/pipeline";
import React from "react";

function ContactFormView() {
  return (
    <form action="https://formspree.io/f/xnnpkkjo" className="fs-form" target="_top" method="POST">
      <div className="fs-field">
        <label className="fs-label" htmlFor="name">
          Your Name
        </label>
        <input placeholder="Ada Lovelace" className="fs-input" id="name" name="name" required />
      </div>
      <div className="fs-field">
        <label className="fs-label" htmlFor="email">
          Email
        </label>
        <input placeholder="ada@lovelace.co" className="fs-input" id="email" name="email" required />
        <p className="fs-description">This will help me respond to your query via an email.</p>
      </div>
      <div className="fs-field">
        <label className="fs-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="fs-textarea"
          id="message"
          name="message"
          placeholder="Enter your message here"
          required
        ></textarea>
        <p className="fs-description">What would you like to discuss? I typically respond within a few days.</p>
      </div>
      <div className="fs-button-group">
        <button className="fs-button" type="submit">
          Submit
        </button>
      </div>
    </form>
  );
}

export default pipeline(React.memo)(ContactFormView) as React.MemoExoticComponent<React.ComponentType>;