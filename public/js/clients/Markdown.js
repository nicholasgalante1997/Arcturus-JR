import dompurify from "dompurify";
import fm from "front-matter";
import { marked } from "marked";

import MarkdownDocument from "../models/Markdown.js";
import { fetchWithTimeout } from "../utils/fetchWithTimeout.js";

class Markdown {
  async fetchMarkdown(file) {
    try {
      const timeoutMs = 2200;
      const response = await fetchWithTimeout(
        file,
        this.#getMarkdownFetchInit(),
        timeoutMs
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      if (text === "") throw new Error("File is empty");
      const { attributes, body } = fm(text);
      const markup = await this.#convertToHtml(body);
      return new MarkdownDocument(body, attributes, markup);
    } catch (error) {
      console.error("Error fetching markdown:", error);
      throw error;
    }
  }

  async #convertToHtml(markdown) {
    return dompurify.sanitize(await Promise.resolve(marked(markdown)));
  }

  #getMarkdownFetchHeaders() {
    const headers = new Headers();
    headers.set("Accept", "text/markdown");
    headers.set("Accept-Encoding", "gzip, br");
    headers.set("X-Client-ID", "minvans-swa");
    return headers;
  }

  #getMarkdownFetchInit(signal) {
    const headers = this.#getMarkdownFetchHeaders();
    return {
      headers,
      method: "GET",
      mode: "no-cors",
      credentials: "same-origin",
    };
  }
}

export default Markdown;
