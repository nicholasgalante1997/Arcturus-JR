import React from 'react';

export interface WorkerProviderComponentProps extends React.PropsWithChildren {}

export enum WorkerNameEnum {
  PrefetchCacheWorker = 'prefetch-cache-worker'
}

export const WorkerFileMap = {
  [WorkerNameEnum.PrefetchCacheWorker]: '/workers/worker___prefetch-cache.js'
} as const;

export interface WorkerContextType {
  workers: Map<WorkerNameEnum, Worker>;
  requestWorker(name: WorkerNameEnum): Worker;
}
