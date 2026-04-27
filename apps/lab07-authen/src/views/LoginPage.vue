<template>
  <ion-page>
    <ion-content :scroll-y="false" class="login-content">
      <div id="recaptcha-container"></div>

      <div class="container">

        <!-- LOGO -->
        <div class="logo-section" v-if="mode === 'main'">
          <h1 class="title">WELCOME</h1>
          <p class="subtitle">เลือกวิธีเข้าสู่ระบบ</p>
        </div>

        <!-- EMAIL FORM -->
        <div v-if="mode === 'email'" class="form-section">
          <h2 class="form-title">Email Login</h2>
          <div class="input-group">
            <label class="input-label">Email</label>
            <ion-input v-model="email" type="email" class="custom-input" placeholder="example@email.com" />
          </div>
          <div class="input-group">
            <label class="input-label">Password</label>
            <ion-input v-model="password" type="password" class="custom-input" placeholder="••••••••" />
          </div>
          <ion-button expand="block" class="btn-primary ion-margin-top" @click="loginEmail">
            เข้าสู่ระบบ
          </ion-button>
          <ion-button expand="block" fill="clear" class="btn-back" @click="mode = 'main'">
            ← ย้อนกลับ
          </ion-button>
        </div>

        <!-- PHONE FORM -->
        <div v-else-if="mode === 'phone'" class="form-section">
          <h2 class="form-title">Phone Login</h2>
          <div v-if="!verificationId">
            <div class="input-group">
              <label class="input-label">เบอร์โทรศัพท์</label>
              <ion-input v-model="phoneNumber" type="tel" class="custom-input" placeholder="+66812345678" />
            </div>
            <ion-button expand="block" class="btn-primary ion-margin-top" @click="sendOtp">
              ส่ง OTP
            </ion-button>
          </div>
          <div v-else>
            <p class="otp-hint">ส่ง OTP ไปที่ {{ phoneNumber }} แล้ว</p>
            <div class="input-group">
              <label class="input-label">รหัส OTP 6 หลัก</label>
              <ion-input v-model="otpCode" type="number" class="custom-input" placeholder="123456" />
            </div>
            <ion-button expand="block" class="btn-primary ion-margin-top" @click="confirmOtp">
              ยืนยัน OTP
            </ion-button>
          </div>
          <ion-button expand="block" fill="clear" class="btn-back"
            @click="mode = 'main'; verificationId = ''">
            ← ย้อนกลับ
          </ion-button>
        </div>

        <!-- MAIN BUTTONS -->
        <div v-else class="buttons-section">
          <ion-button expand="block" class="btn-email" @click="mode = 'email'">
            <ion-icon :icon="mailOutline" slot="start" />
            Login Email / Password
          </ion-button>
          <ion-button expand="block" class="btn-google" @click="loginGoogle">
            <ion-icon :icon="logoGoogle" slot="start" />
            Login Google
          </ion-button>
          <ion-button expand="block" class="btn-phone" @click="mode = 'phone'">
            <ion-icon :icon="phonePortraitOutline" slot="start" />
            Login by Phone
          </ion-button>
        </div>

      </div>

      <ion-loading :is-open="loading" message="กำลังเข้าสู่ระบบ..." />
      <ion-toast :is-open="!!errorMsg" :message="errorMsg" color="danger"
        :duration="3000" @did-dismiss="errorMsg = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage, IonContent, IonButton, IonInput,
  IonLoading, IonToast, IonIcon,
} from "@ionic/vue";
import { mailOutline, logoGoogle, phonePortraitOutline } from "ionicons/icons";
import { authService } from "@/auth/auth-service";

const router = useRouter();
const mode = ref<"main" | "email" | "phone">("main");
const email = ref("");
const password = ref("");
const phoneNumber = ref("");
const otpCode = ref("");
const verificationId = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function loginEmail() {
  try {
    loading.value = true;
    await authService.loginWithEmailPassword({ email: email.value, password: password.value });
    router.replace("/tabs/tab1");
  } catch (e: any) { errorMsg.value = e.message; }
  finally { loading.value = false; }
}

async function loginGoogle() {
  try {
    loading.value = true;
    await authService.loginWithGoogle();
    router.replace("/tabs/tab1");
  } catch (e: any) { errorMsg.value = e.message; }
  finally { loading.value = false; }
}

async function sendOtp() {
  try {
    loading.value = true;
    const result = await authService.startPhoneLogin({ phoneNumberE164: phoneNumber.value });
    verificationId.value = result.verificationId;
  } catch (e: any) { errorMsg.value = e.message; }
  finally { loading.value = false; }
}

async function confirmOtp() {
  try {
    loading.value = true;
    await authService.confirmPhoneCode({
      verificationId: verificationId.value,
      verificationCode: otpCode.value,
    });
    router.replace("/tabs/tab1");
  } catch (e: any) { errorMsg.value = e.message; }
  finally { loading.value = false; }
}
</script>

<style scoped>
.login-content {
  --background: #000000;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 24px;
  background: #000000;
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
}

.logo-circle {
  font-size: 72px;
  margin-bottom: 16px;
  display: block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 8px #FB38FF); }
  50% { transform: scale(1.12); filter: drop-shadow(0 0 24px #FB38FF); }
}

.title {
  font-size: 42px;
  font-weight: 900;
  letter-spacing: 8px;
  color: #FB38FF;
  text-shadow: 0 0 10px #FB38FF, 0 0 30px #FB38FF, 0 0 60px #FB38FF;
  margin: 0;
}

.subtitle {
  color: rgba(251, 56, 255, 0.6);
  font-size: 14px;
  margin-top: 8px;
  letter-spacing: 2px;
}

.buttons-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 8px;
}

.btn-email {
  --background: transparent;
  --border-width: 2px;
  --border-style: solid;
  --border-color: #FB38FF;
  --color: #FB38FF;
  --border-radius: 14px;
  --box-shadow: 0 0 18px rgba(251,56,255,0.5);
  font-weight: 700;
  letter-spacing: 1px;
  height: 52px;
}

.btn-google {
  --background: transparent;
  --border-width: 2px;
  --border-style: solid;
  --border-color: #00F5FF;
  --color: #00F5FF;
  --border-radius: 14px;
  --box-shadow: 0 0 18px rgba(0,245,255,0.5);
  font-weight: 700;
  letter-spacing: 1px;
  height: 52px;
}

.btn-phone {
  --background: transparent;
  --border-width: 2px;
  --border-style: solid;
  --border-color: #39FF14;
  --color: #39FF14;
  --border-radius: 14px;
  --box-shadow: 0 0 18px rgba(57,255,20,0.5);
  font-weight: 700;
  letter-spacing: 1px;
  height: 52px;
}

.form-section {
  width: 100%;
}

.form-title {
  color: #FB38FF;
  font-size: 26px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 28px;
  text-shadow: 0 0 12px #FB38FF;
}

.input-group {
  margin-bottom: 16px;
}

.input-label {
  color: rgba(251, 56, 255, 0.8);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: block;
  margin-bottom: 6px;
}

.custom-input {
  --background: rgba(251, 56, 255, 0.07);
  --color: #ffffff;
  --placeholder-color: rgba(255,255,255,0.25);
  --border-radius: 10px;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  border: 1px solid rgba(251, 56, 255, 0.35);
  border-radius: 10px;
}

.btn-primary {
  --background: #FB38FF;
  --background-activated: #d020dd;
  --color: #000000;
  --border-radius: 14px;
  font-weight: 800;
  letter-spacing: 1px;
  height: 52px;
  --box-shadow: 0 0 24px rgba(251,56,255,0.7);
}

.btn-back {
  --color: rgba(251, 56, 255, 0.5);
  margin-top: 4px;
}

.otp-hint {
  color: rgba(251, 56, 255, 0.7);
  text-align: center;
  font-size: 13px;
  margin-bottom: 16px;
}
</style>