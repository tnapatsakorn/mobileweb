import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";
import type {
  AuthUser,
  IAuthService,
  EmailPasswordCredentials,
  PhoneCredentials,
} from "./auth-interface";

const firebaseConfig = {
  apiKey: "AIzaSyCOwVcvC2AcPkCwCxqjSvoLhby88xVSPxI",
  authDomain: "lab06-expense-e654e.firebaseapp.com",
  projectId: "lab06-expense-e654e",
  storageBucket: "lab06-expense-e654e.firebasestorage.app",
  messagingSenderId: "322585149309",
  appId: "1:322585149309:web:9b0be31f4bf2bcad741614",
  measurementId: "G-HE8X2K24D7",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);

function mapUser(u: any): AuthUser {
  return {
    uid: u.uid,
    email: u.email ?? null,
    phoneNumber: u.phoneNumber ?? null,
    displayName: u.displayName ?? null,
    photoUrl: u.photoURL ?? null,
  };
}

let verifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;
const recaptchaContainerId = "recaptcha-container";

export function getRecaptchaVerifier(containerId: string): RecaptchaVerifier {
  if (verifier) {
    try { verifier.clear(); } catch (e) {}
    verifier = null;
  }

  // ลบ element เดิมแล้วสร้างใหม่ เพื่อป้องกัน "already rendered"
  const old = document.getElementById(containerId);
  if (old) {
    old.innerHTML = "";
    const newDiv = document.createElement("div");
    newDiv.id = containerId;
    old.parentNode?.replaceChild(newDiv, old);
  }

  verifier = new RecaptchaVerifier(firebaseAuth, containerId, {
    size: "invisible",
  });
  return verifier;
}

export class FirebaseWebAuthService implements IAuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    return firebaseAuth.currentUser ? mapUser(firebaseAuth.currentUser) : null;
  }

  async loginWithEmailPassword(creds: EmailPasswordCredentials): Promise<AuthUser> {
    const r = await signInWithEmailAndPassword(firebaseAuth, creds.email, creds.password);
    return mapUser(r.user);
  }

  async loginWithGoogle(): Promise<AuthUser> {
    const provider = new GoogleAuthProvider();
    const r = await signInWithPopup(firebaseAuth, provider);
    return mapUser(r.user);
  }

  async logout(): Promise<void> {
    await firebaseAuth.signOut();
  }

  async startPhoneLogin(creds: PhoneCredentials): Promise<{ verificationId: string }> {
    const v = getRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(firebaseAuth, creds.phoneNumberE164, v);
    return { verificationId: confirmationResult.verificationId };
  }

  async confirmPhoneCode(payload: {
    verificationId: string;
    verificationCode: string;
  }): Promise<AuthUser> {
    if (!confirmationResult) throw new Error("No confirmation result");
    const r = await confirmationResult.confirm(payload.verificationCode);
    return mapUser(r.user);
  }
}