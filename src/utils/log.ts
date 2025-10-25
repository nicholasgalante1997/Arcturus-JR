import debug from 'debug';

export const DEBUG_NAMESPACE = 'arc:web' as const;
export const dlog = debug(DEBUG_NAMESPACE);
export const getNamespacedDebugger = (extension: string) => dlog.extend(extension);
export const debugMode = () => debug.enable('arc:*');

const DateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'full',
  timeStyle: 'long',
  timeZone: 'America/Denver'
});

/**
 * Smol Json Logger
 */
interface JLog {
  (...logs: unknown[]): void;

  disabled: boolean;
  ns: string;

  disable(this: JLog): void;
  enable(this: JLog): void;

  label(...labels: string[]): void;
  unlabel(): void;
}

const jlog: JLog = Object.assign(
  function (this: JLog, ...logs: unknown[]) {
    if (this?.disabled) return;
    console.log({ namespace: jlog.ns, timestamp: DateFormatter.format(new Date()), logs });
  },
  {
    ns: DEBUG_NAMESPACE,
    disabled: false,
    enable: function (this: JLog) {
      this.disabled = false;
    },
    disable: function (this: JLog) {
      this.disabled = true;
    },
    label: function (this: JLog, ...labels: string[]) {
      const label = Array.from(labels).join(':');
      this.ns = `${DEBUG_NAMESPACE}:${label}`;
    },
    unlabel: function (this: JLog) {
      this.ns = DEBUG_NAMESPACE;
    }
  }
);

export { jlog };
