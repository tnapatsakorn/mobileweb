<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>✏️ แก้ไขรายการ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <!-- 💳 Card ครอบฟอร์ม -->
      <ion-card>
        <ion-card-content>

          <ion-input 
            label="ชื่อรายการ" 
            v-model="title"
            placeholder="เช่น ค่าข้าว"
          ></ion-input>

          <ion-input 
            label="จำนวนเงิน" 
            type="number" 
            v-model="amount"
            placeholder="0"
          ></ion-input>

        </ion-card-content>
      </ion-card>

      <!-- ✅ ปุ่ม -->
      <ion-button expand="block" @click="updateExpense">
        บันทึกการแก้ไข
      </ion-button>

      <ion-button expand="block" color="danger" @click="confirmDelete">
        ลบข้อมูล
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonButton,
  IonCard, IonCardContent,
  alertController
} from '@ionic/vue';

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/firebase";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;

const title = ref("");
const amount = ref(0);

// 🔄 โหลดข้อมูล
onMounted(async () => {
  const docRef = doc(db, "expenses", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data: any = docSnap.data();
    title.value = data.title;
    amount.value = data.amount;
  }
});

// ✅ UPDATE
const updateExpense = async () => {
  if (!title.value || amount.value <= 0) {
    const alert = await alertController.create({
      header: "ข้อมูลไม่ครบ",
      message: "กรุณากรอกข้อมูลให้ถูกต้อง",
      buttons: ["ตกลง"]
    });
    await alert.present();
    return;
  }

  await updateDoc(doc(db, "expenses", id), {
    title: title.value,
    amount: Number(amount.value)
  });

  router.push("/tabs/tab1");
};

// ✅ DELETE + confirm
const confirmDelete = async () => {
  const alert = await alertController.create({
    header: 'ยืนยันการลบ',
    message: 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    buttons: [
      {
        text: 'ยกเลิก',
        role: 'cancel'
      },
      {
        text: 'ลบ',
        role: 'destructive',
        handler: async () => {
          await deleteDoc(doc(db, "expenses", id));
          router.push("/tabs/tab1");
        }
      }
    ]
  });

  await alert.present();
};
</script>