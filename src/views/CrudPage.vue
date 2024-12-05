<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Kelola Mainan</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-text style="text-align: center; margin-bottom: 30px">
        <h2>Operasi CRUD Mainan</h2>
      </ion-text>

      <!-- Form untuk menambah atau mengedit mainan -->
      <div id="form-container">
        <ion-input v-model="toyName" label="Nama Mainan" placeholder="Masukkan nama mainan" clear-input class="input-field"></ion-input>
        <ion-input v-model="toyMemory" label="Kenangan" placeholder="Masukkan kenangan dengan mainan" clear-input class="input-field"></ion-input>

        <ion-button expand="full" color="primary" @click="saveToy" class="save-button">
          <ion-label>{{ isEdit ? 'Perbarui Mainan' : 'Tambah Mainan' }}</ion-label>
        </ion-button>
      </div>

      <!-- Daftar mainan yang dapat dihapus, diubah, atau dilihat -->
      <ion-list class="toy-list">
        <ion-item v-for="toy in toys" :key="toy.id" class="toy">
          <ion-label>
            <h3>{{ toy.name }}</h3>
            <p>{{ toy.memory }}</p>
          </ion-label>
          <div slot="end">
            <ion-button @click="openModal(toy)" color="tertiary" fill="clear">Lihat</ion-button>
            <ion-button @click="editToy(toy)" color="secondary" fill="clear">Ubah</ion-button>
            <ion-button @click="confirmDelete(toy.id)" color="danger" fill="clear">Hapus</ion-button>
          </div>
        </ion-item>
      </ion-list>

      <ToyModal :is-open="isModalOpen" :toy="selectedToy" @close="closeModal" />

      <ion-alert :is-open="isErrorAlertOpen" header="Error" :message="errorMessage" buttons="OK" @didDismiss="isErrorAlertOpen = false" />

      <ion-alert
        :is-open="isConfirmAlertOpen"
        header="Konfirmasi"
        message="Apakah Anda yakin ingin menghapus mainan ini?"
        :buttons="[
          {
            text: 'Batal',
            role: 'cancel',
          },
          {
            text: 'Hapus',
            role: 'destructive',
            handler: handleDelete,
          },
        ]"
        @didDismiss="isConfirmAlertOpen = false"
      />

      <ion-alert :is-open="isSuccessAlertOpen" header="Sukses" :message="successMessage" buttons="OK" @didDismiss="isSuccessAlertOpen = false" />
      <TabMenu />
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import TabMenu from '@/components/TabsMenu.vue';
import ToyModal from '@/components/ToyModalDetail.vue';
import { firestoreStore } from '@/stores/firestore';
import { IonAlert, IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonText, IonTitle, IonToolbar } from '@ionic/vue';
import { onMounted, ref } from 'vue';

// State untuk data mainan dan form
const toys = ref([]);
const toyName = ref('');
const toyMemory = ref('');
const isEdit = ref(false);
const editingToyId = ref<string | null>(null);

// State untuk modal
const isModalOpen = ref(false);
const selectedToy = ref<null | { id: string; name: string; memory: string; createdAt: any }>(null);

// State untuk Alert Error
const isErrorAlertOpen = ref(false);
const errorMessage = ref('');

// State untuk Alert Konfirmasi
const isConfirmAlertOpen = ref(false);
const toyToDelete = ref<string | null>(null);

// State untuk Alert Sukses
const isSuccessAlertOpen = ref(false);
const successMessage = ref('');

// Fungsi untuk memuat data dari Firestore
const loadToys = async () => {
  try {
    toys.value = await firestoreStore.getToys();
  } catch (error) {
    showErrorAlert('Gagal memuat data mainan. Silakan coba lagi.');
  }
};

// Fungsi untuk menyimpan data (Tambah atau Edit)
const saveToy = async () => {
  try {
    if (isEdit.value && editingToyId.value) {
      await firestoreStore.updateToy(editingToyId.value, toyName.value, toyMemory.value);
      showSuccessAlert('Mainan berhasil diperbarui.');
    } else {
      await firestoreStore.addToy(toyName.value, toyMemory.value);
      showSuccessAlert('Mainan berhasil ditambahkan.');
    }

    toyName.value = '';
    toyMemory.value = '';
    isEdit.value = false;
    editingToyId.value = null;

    await loadToys();
  } catch (error) {
    showErrorAlert('Gagal menyimpan data mainan. Silakan coba lagi.');
  }
};

// Fungsi untuk mengisi form dengan data yang akan di-edit
const editToy = (toy: { id: string; name: string; memory: string }) => {
  toyName.value = toy.name;
  toyMemory.value = toy.memory;
  isEdit.value = true;
  editingToyId.value = toy.id;
};

// Fungsi untuk konfirmasi penghapusan
const confirmDelete = (id: string) => {
  toyToDelete.value = id;
  isConfirmAlertOpen.value = true;
};

// Fungsi untuk menghapus data
const handleDelete = async () => {
  if (toyToDelete.value) {
    try {
      await firestoreStore.deleteToy(toyToDelete.value);
      showSuccessAlert('Mainan berhasil dihapus.');
      await loadToys();
    } catch (error) {
      showErrorAlert('Gagal menghapus mainan. Silakan coba lagi.');
    }
  }
  toyToDelete.value = null;
};

// Fungsi untuk menampilkan Alert Error
const showErrorAlert = (message: string) => {
  errorMessage.value = message;
  isErrorAlertOpen.value = true;
};

// Fungsi untuk menampilkan Alert Sukses
const showSuccessAlert = (message: string) => {
  successMessage.value = message;
  isSuccessAlertOpen.value = true;
};

// Fungsi untuk membuka modal
const openModal = (toy: { id: string; name: string; memory: string; createdAt: any }) => {
  selectedToy.value = toy;
  isModalOpen.value = true;
};

// Fungsi untuk menutup modal
const closeModal = () => {
  isModalOpen.value = false;
  selectedToy.value = null;
};

// Memuat data saat komponen dipasang
onMounted(() => {
  loadToys();
});
</script>

<style scoped>
#form-container {
  margin: 20px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.input-field {
  margin-bottom: 20px;
  border-radius: 10px;
}

.save-button {
  --border-radius: 8px;
}

.toy-list {
  margin-top: 20px;
}

.toy {
  border-radius: 8px;
  padding: 10px;
  background-color: #ffffff;
  margin-bottom: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.toy ion-button {
  margin-left: 10px;
}
</style>
