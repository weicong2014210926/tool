/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'animal-island-ui/style' {
  const style: string;
  export default style;
}
