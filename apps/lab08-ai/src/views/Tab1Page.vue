<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="custom-toolbar">
        <ion-title class="custom-title">🤖 Gemini Vision</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="main-content">
      <div class="container">

        <input ref="fileEl" type="file" accept="image/*" hidden @change="onFileChange" />

        <div class="btn-group">
          <ion-button expand="block" class="btn-file" @click="fileEl?.click()">
            <ion-icon :icon="imageOutline" slot="start" />
            เลือกไฟล์ภาพ
          </ion-button>
          <ion-button expand="block" class="btn-camera" @click="onTakePhoto">
            <ion-icon :icon="cameraOutline" slot="start" />
            ถ่ายภาพ (Camera)
          </ion-button>
        </div>

        <div v-if="previewUrl" class="preview-section">
          <img :src="previewUrl" class="preview-img" />
        </div>

        <ion-button v-if="img" expand="block" class="btn-analyze" :disabled="loading" @click="onAnalyze">
          <ion-icon :icon="sparklesOutline" slot="start" />
          {{ loading ? 'กำลังวิเคราะห์...' : 'วิเคราะห์ภาพ' }}
        </ion-button>

        <div v-if="loading" class="loading-section">
          <ion-spinner name="crescent" class="custom-spinner" />
          <p class="loading-text">AI กำลังวิเคราะห์ภาพ...</p>
        </div>

        <div v-if="result" class="result-section">
          <div class="result-card card-purple">
            <span class="card-label">📝 คำบรรยาย</span>
            <span class="card-value">{{ result.caption }}</span>
          </div>

          <div class="result-card card-cyan">
            <span class="card-label">🏷️ Tags</span>
            <div class="tags-wrap">
              <span v-for="tag in result.tags" :key="tag" class="tag-chip">{{ tag }}</span>
            </div>
          </div>

          <div v-if="result.objects && result.objects.length" class="result-card card-green">
            <span class="card-label">🔍 วัตถุที่พบ</span>
            <div v-for="obj in result.objects" :key="obj.name" class="object-row">
              <span class="object-name">{{ obj.name }}</span>
              <span v-if="obj.confidence" class="object-conf">{{ Math.round(obj.confidence * 100) }}%</span>
            </div>
          </div>

          <div v-if="result.safety" class="result-card card-yellow">
            <span class="card-label">🛡️ Safety</span>
            <span class="card-value">{{ result.safety.isSensitive ? '⚠️ มีเนื้อหาอ่อนไหว' : '✅ ปลอดภัย' }}</span>
            <span v-if="result.safety.notes" class="card-note">{{ result.safety.notes }}</span>
          </div>
        </div>

      </div>

      <ion-toast :is-open="!!errorMsg" :message="errorMsg" color="danger" :duration="3000" @did-dismiss="errorMsg = ''" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonSpinner, IonToast,
} from "@ionic/vue";
import { imageOutline, cameraOutline, sparklesOutline } from "ionicons/icons";
import { PhotoService } from "@/core/photo.service";
import { GeminiVisionService } from "@/core/gemini.service";
import type { Base64Image, ImageAnalysisResult } from "@/core/ai.interface";

const fileEl = ref<HTMLInputElement | null>(null);
const img = ref<Base64Image | null>(null);
const previewUrl = ref("");
const result = ref<ImageAnalysisResult | null>(null);
const loading = ref(false);
const errorMsg = ref("");

async function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
  result.value = null;
}

async function onTakePhoto() {
  try {
    loading.value = true;
    const b64 = await PhotoService.fromCamera();
    img.value = b64;
    previewUrl.value = `data:${b64.mimeType};base64,${b64.base64}`;
    result.value = null;
  } catch (e: any) {
    errorMsg.value = e.message;
  } finally {
    loading.value = false;
  }
}

async function onAnalyze() {
  if (!img.value) return;
  try {
    loading.value = true;
    result.value = await GeminiVisionService.analyze(img.value);
  } catch (e: any) {
    errorMsg.value = e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.custom-toolbar { --background: #000000; --border-color: rgba(251,56,255,0.3); }
.custom-title { color: #FB38FF; font-weight: 800; letter-spacing: 2px; text-shadow: 0 0 10px #FB38FF; }
.main-content { --background: #000000; }
.container { padding: 20px; }
.btn-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
.btn-file { --background: transparent; --border-width: 2px; --border-style: solid; --border-color: #FB38FF; --color: #FB38FF; --border-radius: 14px; --box-shadow: 0 0 18px rgba(251,56,255,0.4); font-weight: 700; height: 52px; }
.btn-camera { --background: transparent; --border-width: 2px; --border-style: solid; --border-color: #00F5FF; --color: #00F5FF; --border-radius: 14px; --box-shadow: 0 0 18px rgba(0,245,255,0.4); font-weight: 700; height: 52px; }
.btn-analyze { --background: #FB38FF; --color: #000000; --border-radius: 14px; font-weight: 800; height: 52px; --box-shadow: 0 0 24px rgba(251,56,255,0.7); margin-bottom: 20px; }
.preview-section { margin-bottom: 20px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(251,56,255,0.3); }
.preview-img { width: 100%; display: block; }
.loading-section { display: flex; flex-direction: column; align-items: center; padding: 24px; }
.custom-spinner { color: #FB38FF; width: 48px; height: 48px; }
.loading-text { color: rgba(251,56,255,0.7); margin-top: 12px; }
.result-section { display: flex; flex-direction: column; gap: 12px; }
.result-card { border-radius: 14px; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.card-purple { background: rgba(251,56,255,0.08); border: 1px solid rgba(251,56,255,0.3); }
.card-cyan { background: rgba(0,245,255,0.06); border: 1px solid rgba(0,245,255,0.3); }
.card-green { background: rgba(57,255,20,0.06); border: 1px solid rgba(57,255,20,0.3); }
.card-yellow { background: rgba(255,214,0,0.06); border: 1px solid rgba(255,214,0,0.3); }
.card-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
.card-purple .card-label { color: rgba(251,56,255,0.8); }
.card-cyan .card-label { color: rgba(0,245,255,0.8); }
.card-green .card-label { color: rgba(57,255,20,0.8); }
.card-yellow .card-label { color: rgba(255,214,0,0.8); }
.card-value { color: #ffffff; font-size: 15px; font-weight: 500; line-height: 1.5; }
.card-note { color: rgba(255,255,255,0.5); font-size: 13px; }
.tags-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
.tag-chip { background: rgba(0,245,255,0.15); color: #00F5FF; border: 1px solid rgba(0,245,255,0.4); border-radius: 20px; padding: 4px 12px; font-size: 13px; font-weight: 600; }
.object-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px solid rgba(57,255,20,0.1); }
.object-name { color: #ffffff; font-size: 14px; }
.object-conf { color: rgba(57,255,20,0.8); font-size: 13px; font-weight: 700; }
</style>