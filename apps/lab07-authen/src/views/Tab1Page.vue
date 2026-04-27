<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title class="custom-title">Profile</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="doLogout" class="logout-btn">
            <ion-icon :icon="logOutOutline" slot="start" />
            ออกจากระบบ
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <div v-if="user" class="profile-container">

        <!-- Avatar + Name -->
        <div class="avatar-section">
          <div class="avatar-ring">
            <img v-if="user.photoUrl" :src="user.photoUrl" class="avatar-img" />
            <div v-else class="avatar-placeholder">
              {{ (user.displayName || user.email || '?')[0].toUpperCase() }}
            </div>
          </div>
          <h2 class="display-name">{{ user.displayName ?? "ผู้ใช้งาน" }}</h2>
          <p class="user-email">{{ user.email ?? user.phoneNumber ?? '-' }}</p>
        </div>

        <!-- Info Cards -->
        <div class="info-cards">
          <div class="info-card card-purple">
            <span class="card-label">UID</span>
            <span class="card-value uid-text">{{ user.uid }}</span>
          </div>
          <div class="info-card card-cyan">
            <span class="card-label">Email</span>
            <span class="card-value">{{ user.email ?? '-' }}</span>
          </div>
          <div class="info-card card-green">
            <span class="card-label">เบอร์โทร</span>
            <span class="card-value">{{ user.phoneNumber ?? '-' }}</span>
          </div>
          <div class="info-card card-yellow">
            <span class="card-label">ชื่อ</span>
            <span class="card-value">{{ user.displayName ?? '-' }}</span>
          </div>
        </div>

      </div>

      <div v-else class="loading-container">
        <ion-spinner name="crescent" class="custom-spinner" />
        <p class="loading-text">กำลังโหลดข้อมูล...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons, IonIcon, IonSpinner,
} from "@ionic/vue";
import { logOutOutline } from "ionicons/icons";
import { authService } from "@/auth/auth-service";
import type { AuthUser } from "@/auth/auth-interface";

const router = useRouter();
const user = ref<AuthUser | null>(null);

onMounted(async () => {
  const { firebaseAuth } = await import("@/auth/auth-web");
  await new Promise<void>((resolve) => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((u) => {
      unsubscribe();
      resolve();
    });
  });
  user.value = await authService.getCurrentUser();
});

async function doLogout() {
  await authService.logout();
  router.replace("/login");
}
</script>

<style scoped>
.custom-toolbar {
  --background: #000000;
  --border-color: rgba(251, 56, 255, 0.3);
}

.custom-title {
  color: #FB38FF;
  font-weight: 800;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #FB38FF;
}

.logout-btn {
  --color: rgba(251, 56, 255, 0.7);
  font-size: 13px;
}

.profile-content {
  --background: #000000;
}

.profile-container {
  padding: 24px 20px;
  min-height: 100%;
}

.avatar-section {
  text-align: center;
  padding: 24px 0 32px;
}

.avatar-ring {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid #FB38FF;
  box-shadow: 0 0 20px rgba(251,56,255,0.6), 0 0 40px rgba(251,56,255,0.3);
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 48px;
  font-weight: 900;
  color: #FB38FF;
  text-shadow: 0 0 10px #FB38FF;
}

.display-name {
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px;
}

.user-email {
  color: rgba(251, 56, 255, 0.6);
  font-size: 14px;
  margin: 0;
}

.info-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-card {
  border-radius: 14px;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-purple {
  background: rgba(251, 56, 255, 0.08);
  border: 1px solid rgba(251, 56, 255, 0.3);
}

.card-cyan {
  background: rgba(0, 245, 255, 0.06);
  border: 1px solid rgba(0, 245, 255, 0.3);
}

.card-green {
  background: rgba(57, 255, 20, 0.06);
  border: 1px solid rgba(57, 255, 20, 0.3);
}

.card-yellow {
  background: rgba(255, 214, 0, 0.06);
  border: 1px solid rgba(255, 214, 0, 0.3);
}

.card-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.card-purple .card-label { color: rgba(251,56,255,0.7); }
.card-cyan .card-label { color: rgba(0,245,255,0.7); }
.card-green .card-label { color: rgba(57,255,20,0.7); }
.card-yellow .card-label { color: rgba(255,214,0,0.7); }

.card-value {
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
}

.uid-text {
  font-size: 11px;
  word-break: break-all;
  color: rgba(255,255,255,0.7);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.custom-spinner {
  color: #FB38FF;
  width: 48px;
  height: 48px;
}

.loading-text {
  color: rgba(251, 56, 255, 0.6);
  margin-top: 16px;
  font-size: 14px;
}
</style>