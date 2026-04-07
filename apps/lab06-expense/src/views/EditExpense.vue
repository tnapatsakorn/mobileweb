<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-input label="ชื่อรายการ" v-model="title"></ion-input>

      <ion-input label="จำนวนเงิน" type="number" v-model="amount"></ion-input>

      <ion-select label="ประเภท" v-model="type">
        <ion-select-option value="income">รายรับ</ion-select-option>
        <ion-select-option value="expense">รายจ่าย</ion-select-option>
      </ion-select>

      <ion-button expand="block" @click="updateExpense">
        อัปเดต
      </ion-button>

      <ion-button color="danger" expand="block" @click="deleteExpense">
        ลบข้อมูล
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;

const title = ref("");
const amount = ref(0);
const type = ref("expense");

onMounted(async () => {
  const docRef = doc(db, "expenses", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    title.value = data.title;
    amount.value = data.amount;
    type.value = data.type;
  }
});

const updateExpense = async () => {
  const docRef = doc(db, "expenses", id);

  await updateDoc(docRef, {
    title: title.value,
    amount: amount.value,
    type: type.value
  });

  router.push("/list");
};

const deleteExpense = async () => {
  if (confirm("ต้องการลบใช่ไหม?")) {
    await deleteDoc(doc(db, "expenses", id));
    router.push("/list");
  }
};
</script>