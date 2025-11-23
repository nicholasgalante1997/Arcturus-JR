import React, { createContext, useCallback, useContext, useEffect } from 'react';

import { WorkerFileMap, WorkerNameEnum } from './types';

import type { WorkerContextType, WorkerProviderComponentProps } from './types';

const WorkerContext = createContext<WorkerContextType | null>(null);

const createWorker = (url: string): Worker => new Worker(url, { type: 'module', credentials: 'same-origin' });

export function useWorkerContext(): WorkerContextType {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorkerContext must be used within a WorkerProvider');
  }
  return context;
}

function WorkerProvider({ children }: WorkerProviderComponentProps) {
  const [workers, setWorkers] = React.useState<Map<WorkerNameEnum, Worker>>(() => new Map());
  const [worker_prefetchCache, setWorkerPrefetchCache] = React.useState<Worker | null>(null);

  function updateWorkerMap(name: WorkerNameEnum, worker: Worker) {
    setWorkers((prevWorkerMap) => {
      const newWorkerMap = new Map(prevWorkerMap);
      newWorkerMap.set(name, worker);
      return newWorkerMap;
    });
  }

  useEffect(() => {
    setWorkerPrefetchCache(createWorker(WorkerFileMap[WorkerNameEnum.PrefetchCacheWorker]));
  }, []);

  useEffect(() => {
    if (worker_prefetchCache && !workers.has(WorkerNameEnum.PrefetchCacheWorker)) {
      updateWorkerMap(WorkerNameEnum.PrefetchCacheWorker, worker_prefetchCache);
    }
  }, [worker_prefetchCache, workers]);

  const requestWorker = useCallback(
    (name: WorkerNameEnum): Worker => {
      let worker = workers.get(name);
      if (!worker) {
        worker = createWorker(WorkerFileMap[name]);
        updateWorkerMap(name, worker);
      }

      return worker;
    },
    [workers]
  );

  const contextValue: WorkerContextType = {
    workers,
    requestWorker
  };

  return <WorkerContext.Provider value={contextValue}>{children}</WorkerContext.Provider>;
}

export default WorkerProvider;
