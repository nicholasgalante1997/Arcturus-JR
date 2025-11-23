export default class MissingServerDataLayerProps extends Error {
  constructor() {
    const name = 'MissingServerDataLayerPropsError';
    const message = 'You are missing required props [client] necessary to render <ServerDataLayer/>';
    super(message);
    this.name = name;
  }
}
