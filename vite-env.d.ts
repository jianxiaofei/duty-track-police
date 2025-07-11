/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // 如果有其他环境变量，也可以在这里声明
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}