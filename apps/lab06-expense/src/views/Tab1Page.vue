<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Expense Tracker</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- 🔥 Summary -->
      <ion-card>
        <ion-card-content>
          <h2>สรุปยอด</h2>
          <p style="color: green;">รายรับ: {{ totalIncome }} บาท</p>
          <p style="color: red;">รายจ่าย: {{ totalExpense }} บาท</p>
        </ion-card-content>
      </ion-card>

      <!-- 📋 List -->
      <ion-list>
        <ion-item
          v-for="item in expenses"
          :key="item.id"
          :router-link="`/edit/${item.id}`"
        >
          <ion-label>
            <h2>{{ item.title }}</h2>

            <p :style="{ color: item.type === 'income' ? 'green' : 'red' }">
              {{ item.type === 'income' ? '+' : '-' }} {{ item.amount }} บาท
            </p>

          </ion-label>
        </ion-item>
      </ion-list>

      <!-- ➕ Floating Button -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button router-link="/add">
          +
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel,
  IonCard, IonCardContent,
  IonFab, IonFabButton
} from '@ionic/vue';

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { ref, onMounted, computed } from "vue";

const expenses = ref<any[]>([]);

// 🔄 realtime
onMounted(() => {
  onSnapshot(collection(db, "expenses"), (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

// 💰 summary
const totalIncome = computed(() =>
  expenses.value
    .filter(e => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0)
);

const totalExpense = computed(() =>
  expenses.value
    .filter(e => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0)
);
</script>