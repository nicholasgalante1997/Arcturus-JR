export default class MissingBrowserDataLayerProps extends Error {
  constructor() {
    const name = 'MissingBrowserDataLayerPropsError';
    const message = 'You are missing required props [client, state] necessary to render <BrowserDataLayer/>';
    super(message);
    this.name = name;
  }
}
