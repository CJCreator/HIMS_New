/// <reference types="vite/client" />
/// <reference types="node" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly DEV: boolean
  readonly PROD: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global types for tests
declare global {
  var IntersectionObserver: any;
  var ResizeObserver: any;
  var matchMedia: any;
}