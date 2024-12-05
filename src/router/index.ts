import { useAuthStore } from '@/stores/auth';
import { auth } from '@/utils/firebase';
import CrudPage from '@/views/CrudPage.vue'; // Tambahkan halaman CRUD
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import ProfilePage from '@/views/ProfilePage.vue';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { onAuthStateChanged } from 'firebase/auth';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      isAuth: false, // Hanya bisa diakses oleh user yang belum login
    },
  },
  {
    path: '/home',
    name: 'home',
    component: HomePage,
    meta: {
      isAuth: true, // Hanya bisa diakses oleh user yang sudah login
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage,
    meta: {
      isAuth: true,
    },
  },
  {
    path: '/crud',
    name: 'crud',
    component: CrudPage, // Halaman CRUD yang baru
    meta: {
      isAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Pengecekan status autentikasi sebelum setiap route
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Tunggu sampai status autentikasi pengguna diperbarui
  if (authStore.user === null) {
    await new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, () => {
        resolve();
        unsubscribe();
      });
    });
  }

  // Cek apakah pengguna sudah login dan mencoba mengakses login page
  if (to.path === '/login' && authStore.isAuth) {
    next('/home');
  }
  // Cek akses ke halaman yang membutuhkan autentikasi
  else if (to.meta.isAuth && !authStore.isAuth) {
    next('/login');
  }
  // Lanjutkan navigasi jika pengecekan berhasil
  else {
    next();
  }
});

export default router;
