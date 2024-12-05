<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>
          <ion-icon :icon="home" slot="start" style="margin-right: 8px"></ion-icon>
          Home
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div id="home-container">
        <ion-text style="text-align: center; margin-bottom: 20px">
          <h2>Welcome to the Home Page</h2>
        </ion-text>

        <ion-text style="text-align: center; margin-bottom: 10px">
          <h3>List Mainan</h3>
        </ion-text>

        <!-- Daftar Item dari Firestore -->
        <ion-list>
          <template v-if="toys.length > 0">
            <ion-item v-for="toy in toys" :key="toy.id">
              <ion-icon :icon="document" slot="start"></ion-icon>
              <ion-label>
                <h3>{{ toy.name }}</h3>
                <p>{{ toy.memory }}</p>
              </ion-label>
            </ion-item>
          </template>
          <template v-else>
            <ion-item>
              <p>Tidak ada mainan</p>
            </ion-item>
          </template>
        </ion-list>
      </div>
      <TabsMenu />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import TabsMenu from '@/components/TabsMenu.vue';
import { firestoreStore } from '@/stores/firestore';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/vue';
import { document, home } from 'ionicons/icons';
import { onMounted, ref } from 'vue';

// Variabel untuk menyimpan ikon
const icons = { document, home };

// Data mainan dari Firestore
const toys = ref<Toy[]>([]);

// Fungsi untuk memuat data mainan
const loadToys = async () => {
  try {
    toys.value = await firestoreStore.getToys();
  } catch (error) {
    console.error('Error loading toys:', error);
  }
};

// Panggil saat komponen dimuat
onMounted(() => {
  loadToys();
});
</script>
<style scoped>
#home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

ion-list {
  width: 90%;
}

ion-item h3 {
  font-size: 1.2rem;
  margin: 0;
}

ion-item p {
  font-size: 0.9rem;
  margin: 0;
  color: var(--ion-color-medium);
}
</style>
