class MarkdownDocument {
  /**
   * @type {string}
   */
  #markdown;

  /**
   * @type {object}
   */
  #properties;

  /**
   * @type {string}
   */
  #markup;

  constructor(markdown, properties, markup) {
    this.#markdown = markdown;
    this.#properties = properties;
    this.#markup = markup;
  }

  get markdown() {
    return this.#markdown;
  }
  get properties() {
    return this.#properties;
  }
  get markup() {
    return this.#markup;
  }

  asMarkdown() {
    return this.markdown;
  }

  asHtml() {
    return this.markup;
  }

  asJson() {
    return {
      markdown: this.#markdown,
      properties: this.#properties,
      markup: this.#markup
    };
  }

  attribute(key) {
    return this.#properties[key] || null;
  }
}

export default MarkdownDocument;
