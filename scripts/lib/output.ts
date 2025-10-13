export function getOutputFilePath(pathname: string) {
  switch (pathname) {
    case '/': {
      return 'index.html';
    }
    default: {
      return `${pathname.replace(/^\//, '')}/index.html`;
    }
  }
}
