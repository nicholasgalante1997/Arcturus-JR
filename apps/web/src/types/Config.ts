export interface ConfigLinks {
  GITHUB: string;
  LINKEDIN: string;
}

export interface ConfigRoutes {
  PUBLIC: string[];
  PRIVATE: string[];
}

export interface Config {
  SHOW_WORK_IN_PROGRESS_VIEW: boolean;
  LINKS: ConfigLinks;
  ROUTES: ConfigRoutes;
}
