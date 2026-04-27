import { Capacitor } from "@capacitor/core";
import type { IAuthService } from "./auth-interface";

let _service: IAuthService | null = null;

export async function getAuthService(): Promise<IAuthService> {
  if (_service) return _service;

  if (Capacitor.isNativePlatform()) {
    const { FirebaseAppAuthService } = await import("./auth-app");
    _service = new FirebaseAppAuthService();
  } else {
    const { FirebaseWebAuthService } = await import("./auth-web");
    _service = new FirebaseWebAuthService();
  }
  return _service;
}

// proxy object ที่ใช้แทน authService แบบ sync
export const authService: IAuthService = new Proxy({} as IAuthService, {
  get(_target, prop) {
    return async (...args: any[]) => {
      const svc = await getAuthService();
      return (svc as any)[prop](...args);
    };
  },
});