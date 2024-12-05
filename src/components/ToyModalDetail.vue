<template>
  <ion-modal :is-open="isOpen" @didDismiss="closeModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Detail Mainan</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Tutup</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="modal-content">
        <ion-card>
          <ion-card-header>
            <ion-card-title>{{ toy?.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <p><strong>Kenangan:</strong> {{ toy?.memory }}</p>
            <p><strong>Dibuat Pada:</strong> {{ toy?.createdAt?.toDate().toLocaleString() }}</p>
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { Toy } from '@/stores/firestore';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/vue';
import { PropType } from 'vue';

// Props untuk menerima data dari parent
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  toy: {
    type: Object as PropType<Toy | null>,
    default: null,
  },
});

// Emit untuk mengirimkan event ke parent
const emit = defineEmits(['close']);

// Fungsi untuk menutup modal
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

ion-card {
  width: 100%;
  max-width: 500px;
}
</style>
