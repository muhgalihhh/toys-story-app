<template>
  <ion-page class="toy-story-background">
    <ion-header :translucent="true" class="toy-story-header">
      <ion-toolbar color="primary">
        <ion-title class="toy-story-title">{{ user?.displayName }}'s Profile</ion-title>

        <!-- Logout Button with Toy Story Style -->
        <ion-button slot="end" fill="clear" @click="confirmLogout" class="logout-button">
          <ion-icon slot="end" :icon="exit" class="logout-icon"></ion-icon>
          <ion-label>Log Out</ion-label>
        </ion-button>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="toy-story-content">
      <!-- Playful Avatar Container -->
      <div id="avatar-container" class="andy-toy-frame">
        <ion-avatar class="toy-avatar">
          <img alt="Profile Avatar" :src="userPhoto" @error="handleImageError" />
        </ion-avatar>
      </div>

      <!-- Profile Details with Toy Story Styling -->
      <ion-list class="profile-list">
        <ion-item class="profile-item">
          <ion-input label="Name" label-placement="stacked" :value="user?.displayName" :readonly="true" class="toy-input"></ion-input>
        </ion-item>

        <ion-item class="profile-item">
          <ion-input label="Email" label-placement="stacked" :value="user?.email" :readonly="true" class="toy-input"></ion-input>
        </ion-item>
      </ion-list>

      <!-- Tabs Menu -->
      <TabsMenu />
    </ion-content>

    <!-- Logout Confirmation Alert -->
    <ion-alert
      :is-open="showLogoutConfirm"
      header="Confirm Logout"
      message="Are you sure you want to log out?"
      :buttons="[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            showLogoutConfirm = false;
          },
        },
        {
          text: 'Log Out',
          handler: () => {
            logout();
          },
        },
      ]"
    />
  </ion-page>
</template>

<script setup lang="ts">
import TabsMenu from '@/components/TabsMenu.vue';
import { useAuthStore } from '@/stores/auth';
import { IonAlert, IonAvatar, IonButton, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { exit } from 'ionicons/icons';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// State untuk menampilkan konfirmasi logout
const showLogoutConfirm = ref(false);

const logout = async () => {
  try {
    await authStore.logout();
  } catch (error) {
    console.error('Error during logout in profile page:', error);
  }
};

// Fungsi untuk menampilkan konfirmasi logout
const confirmLogout = () => {
  showLogoutConfirm.value = true;
};

const userPhoto = ref(user.value?.photoURL || 'https://ionicframework.com/docs/img/demos/avatar.svg');

function handleImageError() {
  userPhoto.value = 'https://ionicframework.com/docs/img/demos/avatar.svg';
}
</script>

<style>
/* Toy Story Color Palette */
:root {
  --toy-story-primary: #ff8200; /* Woody's Sheriff Badge Orange */
  --toy-story-secondary: #4a90e2; /* Buzz Lightyear Blue */
  --toy-story-background: #f2e8cf; /* Warm, slightly aged paper color */
  --toy-story-text: #2a2a2a; /* Deep charcoal */
}

.toy-story-background {
  --background: var(--toy-story-background);
  font-family: 'Comic Sans MS', cursive, sans-serif;
}

.toy-story-header {
  background-color: var(--toy-story-primary);
  color: white;
}

.toy-story-title {
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

#avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
}

.andy-toy-frame {
  background-color: rgba(255, 255, 255, 0.7);
  border: 3px solid var(--toy-story-primary);
  border-radius: 15px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.toy-avatar {
  width: 150px;
  height: 150px;
  border: 4px solid var(--toy-story-secondary);
}

.toy-avatar img {
  object-fit: cover;
  border-radius: 50%;
}

.profile-list {
  background-color: transparent;
}

.profile-item {
  --background: rgba(255, 255, 255, 0.5);
  --border-radius: 10px;
  margin: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toy-input {
  color: var(--toy-story-text);
  font-weight: bold;
}

.logout-button {
  --color: white;
  --background: var(--toy-story-secondary);
  border-radius: 20px;
  margin-right: 10px;
}

.logout-icon {
  color: white;
  margin-right: 5px;
}
</style>
