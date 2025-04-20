<form
  action="https://formspree.io/f/xnnpkkjo"
  class="fs-form"
  target="_top"
  method="POST"
>
  <div class="fs-field">
    <label class="fs-label" for="name">Your Name</label>
    <input placeholder="Ada Lovelace" class="fs-input" id="name" name="name" required />
  </div>
  <div class="fs-field">
    <label class="fs-label" for="email">Email</label>
    <input placeholder="ada@lovelace.co" class="fs-input" id="email" name="email" required />
    <p class="fs-description">
      This will help me respond to your query via an email.
    </p>
  </div>
  <div class="fs-field">
    <label class="fs-label" for="message">Message</label>
    <textarea
      class="fs-textarea"
      id="message"
      name="message"
      placeholder="Enter your message here"
      required
    ></textarea>
    <p class="fs-description">What would you like to discuss? I typically respond within a few days.</p>
  </div>
  <div class="fs-button-group">
    <button class="fs-button" type="submit">Submit</button>
  </div>
</form>
