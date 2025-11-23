import { bootstrap } from './bootstrap';

type NodeEnvironment = 'production' | 'development' | undefined;

const NODE_ENV = (process?.env?.NODE_ENV as NodeEnvironment) || ('production' as const as NodeEnvironment);

bootstrap({ env: NODE_ENV });
