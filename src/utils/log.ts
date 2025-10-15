import debug from 'debug';

export const DEBUG_NAMESPACE = 'arc:web' as const;
export const dlog = debug(DEBUG_NAMESPACE);
export const getNamespacedDebugger = (extension: string) => dlog.extend(extension);
export const debugMode = () => debug.enable('arc:*');
