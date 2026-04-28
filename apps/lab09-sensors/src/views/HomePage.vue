<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title class="custom-title">Arm Workout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <div class="container">

        <!-- Rep Counter -->
        <div class="rep-circle">
          <span class="rep-number">{{ state?.repDisplay ?? 0 }}</span>
          <span class="rep-label">รอบ</span>
        </div>

        <!-- Status Message -->
        <p class="status-msg">{{ state?.stats.lastMessage ?? 'กด Start เพื่อเริ่ม' }}</p>

        <!-- Buttons -->
        <div class="btn-group">
          <ion-button
            expand="block"
            class="btn-start"
            :disabled="state?.status === 'RUNNING'"
            @click="start"
          >
            ▶️ Start
          </ion-button>
          <ion-button
            expand="block"
            class="btn-stop"
            :disabled="state?.status !== 'RUNNING'"
            @click="stop"
          >
            ⏹️ Stop
          </ion-button>
        </div>

        <!-- Stats Cards -->
        <div v-if="state?.status === 'STOPPED'" class="stats-section">
          <h3 class="stats-title">📊 สถิติการกายบริหาร</h3>

          <div class="stats-grid">
            <div class="stat-card card-purple">
              <span class="stat-value">{{ state?.stats.repsTotal ?? 0 }}</span>
              <span class="stat-label">รอบทั้งหมด</span>
            </div>
            <div class="stat-card card-green">
              <span class="stat-value">{{ state?.stats.repsOk ?? 0 }}</span>
              <span class="stat-label">รอบถูก</span>
            </div>
            <div class="stat-card card-red">
              <span class="stat-value">{{ state?.stats.repsBad ?? 0 }}</span>
              <span class="stat-label">รอบผิด</span>
            </div>
            <div class="stat-card card-yellow">
              <span class="stat-value">{{ state?.stats.score ?? 0 }}</span>
              <span class="stat-label">คะแนน</span>
            </div>
            <div class="stat-card card-cyan">
              <span class="stat-value">{{ state?.stats.avgRepMs ?? 0 }}</span>
              <span class="stat-label">ความเร็วเฉลี่ย (ms)</span>
            </div>
            <div class="stat-card card-orange">
              <span class="stat-value">
                {{ state?.stats.repsTotal
                  ? Math.round((state.stats.repsOk / state.stats.repsTotal) * 100)
                  : 0 }}%
              </span>
              <span class="stat-label">% ถูกต้อง</span>
            </div>
          </div>
        </div>

        <!-- Running indicator -->
        <div v-if="state?.status === 'RUNNING'" class="running-section">
          <ion-spinner name="crescent" class="custom-spinner" />
          <p class="running-text">กำลังนับรอบ... ยกแขนขึ้น-ลง</p>
          <div class="mini-stats">
            <span class="mini-stat">✅ ถูก: {{ state?.stats.repsOk }}</span>
            <span class="mini-stat">❌ ผิด: {{ state?.stats.repsBad }}</span>
          </div>
        </div>

      </div>
    </ion-content>

    <ion-footer class="ion-padding">
      <p class="footer-text">663380602-5 นภัสกร ชัยเกตุ</p>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonSpinner, IonFooter,
} from "@ionic/vue";
import { MotionService } from "@/core/MotionService";
import { TtsService } from "@/core/TtsService";
import { HapticsService } from "@/core/HapticsService";
import { ArmWorkoutEngine } from "@/core/ArmWorkoutEngine";
import type { WorkoutState } from "@/core/types";

const state = ref<WorkoutState | null>(null);
const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();
const haptics = new HapticsService();

let unsubscribe: (() => void) | null = null;

onMounted(() => {
  unsubscribe = engine.onChange((s) => {
    state.value = s;
    // เมื่อนับรอบใหม่ที่ถูกต้อง ให้พูดเลข + สั่น
    if (s.status === "RUNNING" && s.stats.lastMessage?.startsWith("✅")) {
      tts.speak(String(s.repDisplay));
      haptics.success();
    } else if (s.status === "RUNNING" && s.stats.lastMessage?.startsWith("⚠️")) {
      haptics.warning();
    }
  });
});

onUnmounted(() => {
  unsubscribe?.();
  motion.stop();
});

async function start() {
  await tts.speak("เริ่มกายบริหารแขน ยกขึ้นจนสุดแล้วลดลง");
  engine.start();
  await motion.start((s) => engine.process(s));
}

async function stop() {
  await motion.stop();
  engine.stop();
  await tts.speak("หยุดแล้ว คะแนนของคุณคือ " + state.value?.stats.score);
}
</script>

<style scoped>
.custom-toolbar { --background: #000000; --border-color: rgba(251,56,255,0.3); }
.custom-title { color: #FB38FF; font-weight: 800; letter-spacing: 2px; text-shadow: 0 0 10px #FB38FF; }
.main-content { --background: #000000; }

.container { padding: 24px 20px; display: flex; flex-direction: column; align-items: center; }

.rep-circle {
  width: 180px; height: 180px; border-radius: 50%;
  border: 4px solid #FB38FF;
  box-shadow: 0 0 30px rgba(251,56,255,0.6), 0 0 60px rgba(251,56,255,0.3);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.rep-number { font-size: 72px; font-weight: 900; color: #FB38FF; text-shadow: 0 0 20px #FB38FF; line-height: 1; }
.rep-label { font-size: 16px; color: rgba(251,56,255,0.6); letter-spacing: 2px; }

.status-msg { color: #ffffff; font-size: 16px; margin-bottom: 24px; text-align: center; min-height: 24px; }

.btn-group { width: 100%; display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.btn-start { --background: #FB38FF; --color: #000000; --border-radius: 14px; font-weight: 800; height: 52px; --box-shadow: 0 0 20px rgba(251,56,255,0.6); }
.btn-stop { --background: transparent; --border-width: 2px; --border-style: solid; --border-color: #FF4444; --color: #FF4444; --border-radius: 14px; font-weight: 800; height: 52px; }

.stats-section { width: 100%; }
.stats-title { color: #FB38FF; font-size: 18px; font-weight: 800; text-align: center; margin-bottom: 16px; }
.stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.stat-card { border-radius: 14px; padding: 16px; display: flex; flex-direction: column; align-items: center; gap: 4px; }
.card-purple { background: rgba(251,56,255,0.08); border: 1px solid rgba(251,56,255,0.3); }
.card-green { background: rgba(57,255,20,0.06); border: 1px solid rgba(57,255,20,0.3); }
.card-red { background: rgba(255,68,68,0.06); border: 1px solid rgba(255,68,68,0.3); }
.card-yellow { background: rgba(255,214,0,0.06); border: 1px solid rgba(255,214,0,0.3); }
.card-cyan { background: rgba(0,245,255,0.06); border: 1px solid rgba(0,245,255,0.3); }
.card-orange { background: rgba(255,165,0,0.06); border: 1px solid rgba(255,165,0,0.3); }
.stat-value { font-size: 32px; font-weight: 900; color: #ffffff; }
.stat-label { font-size: 12px; color: rgba(255,255,255,0.5); text-align: center; }

.running-section { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.custom-spinner { color: #FB38FF; width: 48px; height: 48px; }
.running-text { color: rgba(251,56,255,0.7); font-size: 14px; }
.mini-stats { display: flex; gap: 24px; }
.mini-stat { color: #ffffff; font-size: 14px; font-weight: 600; }

ion-footer { --background: #000000; border-top: 1px solid rgba(251,56,255,0.2); }
.footer-text { color: rgba(255,255,255,0.4); font-size: 12px; text-align: center; margin: 0; }
</style>