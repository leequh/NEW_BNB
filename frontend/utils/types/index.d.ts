interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    options?: {
      [key: string]: any
    },
  ) => void
}
