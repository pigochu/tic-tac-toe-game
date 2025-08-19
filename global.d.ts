// minimal global declarations for FlyonUI runtime helpers
export {}

declare global {
  interface Window {
    HSStaticMethods?: any
    HSOverlay?: any
    // allow other FlyonUI components if needed
    [key: string]: any
  }
}
