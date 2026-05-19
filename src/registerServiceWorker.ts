export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", () => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    navigator.serviceWorker.register(`${baseUrl}sw.js`).catch((error: unknown) => {
      console.warn("Service worker nao registrado.", error);
    });
  });
}
