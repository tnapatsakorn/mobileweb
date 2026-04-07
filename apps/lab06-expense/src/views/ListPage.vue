<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>รายการทั้งหมด</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-list>
        <ion-item v-for="item in expenses" :key="item.id" @click="$router.push('/edit/' + item.id)">
          <ion-label>
            <h2>{{ item.title }}</h2>
            <p>{{ item.amount }} บาท ({{ item.type }})</p>
          </ion-label>
        </ion-item>
      </ion-list>
        <ion-card>
            <ion-card-content>
                <p>รายรับ: {{ totalIncome }} บาท</p>
                <p>รายจ่าย: {{ totalExpense }} บาท</p>
            </ion-card-content>
        </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

const expenses = ref<any[]>([]);

onMounted(() => {
  onSnapshot(collection(db, "expenses"), (snapshot) => {
    expenses.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
});

import { computed } from "vue";

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

<style scoped>
    .income {
  color: #2ecc71;
  font-weight: bold;
}

.expense {
  color: #e74c3c;
  font-weight: bold;
}

.item-card {
  border-radius: 12px;
  margin-bottom: 10px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.1);
}

ion-card {
  border-radius: 16px;
}
</style>