// src/stores/auth.ts
import router from '@/router';
import { auth } from '@/utils/firebase';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { alertController } from '@ionic/vue';
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithCredential, signOut } from 'firebase/auth';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // Variabel User
  const user = ref<User | null>(null);

  // Variabel isAuth mengembalikan true or false
  // Cek jika user sudah login atau belum
  const isAuth = computed(() => user.value !== null);

  // Sign In with Google
  const loginWithGoogle = async () => {
    try {
      await GoogleAuth.initialize({
        clientId: '259152233910-h7jkvlchppnkp537jtoc5c053r94u7ls.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });

      const googleUser = await GoogleAuth.signIn();

      const idToken = googleUser.authentication.idToken;

      const credential = GoogleAuthProvider.credential(idToken);

      const result = await signInWithCredential(auth, credential);

      user.value = result.user;

      // Success popup
      const successAlert = await alertController.create({
        header: 'Login Berhasil!',
        message: 'Anda berhasil login dengan Google.',
        buttons: ['OK'],
      });
      await successAlert.present();

      router.push('/home');
    } catch (error) {
      console.error('Google sign-in error:', error);

      // Error popup
      const errorAlert = await alertController.create({
        header: 'Login Gagal!',
        message: 'Terjadi kesalahan saat login dengan Google. Coba lagi.',
        buttons: ['OK'],
      });
      await errorAlert.present();

      throw error;
    }
  };

  // Logout with enhanced error handling
  const logout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase

      await GoogleAuth.signOut();

      user.value = null; // Reset the user object

      // Success popup
      const successAlert = await alertController.create({
        header: 'Logout Berhasil!',
        message: 'Anda telah berhasil logout.',
        buttons: ['OK'],
      });

      await successAlert.present();

      // Redirect to login page after alert is dismissed
      successAlert.onDidDismiss().then(() => {
        router.replace('/login');
      });
    } catch (error) {
      console.error('Logout error:', error);

      // Error handling: Reset user state in case of error
      user.value = null;

      // Show error popup
      const errorAlert = await alertController.create({
        header: 'Logout Gagal!',
        message: 'Terjadi kesalahan saat logout. Coba lagi.',
        buttons: ['OK'],
      });

      await errorAlert.present();

      // Optional: Redirect even if logout fails
      router.replace('/login');

      throw error;
    }
  };

  // Firebase listener to manage user state
  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    if (!currentUser) {
      router.replace('/login'); // Redirect ke halaman login jika tidak ada user
    }
  });

  return { user, isAuth, loginWithGoogle, logout };
});
