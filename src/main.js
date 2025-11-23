import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VeeValidatePlugin from './includes/validate';
import router from './router/routes';
import './style.css';
import { auth } from './firebase/firebase';
import App from './App.vue';
import { useUserStore } from './stores/user';
import AOS from 'aos';
import 'aos/dist/aos.css';

let app;

const pinia = createPinia();
const aos = AOS.init()

async function mountApp() {
    
    // 1. Inisialisasi Pinia
    app.use(pinia);
    app.use(aos)
    
    // 2. Dapatkan instance store dan panggil init()
    const userStore = useUserStore();
    
    // Tunggu inisialisasi sesi Firebase dan pengambilan role
    await userStore.init(); 

    // 3. Tambahkan plugins dan router
    app.use(VeeValidatePlugin);
    app.use(router);

    // 4. Mount Aplikasi
    app.mount('#app');
}

// Cek status otentikasi awal sebelum mount
auth.onAuthStateChanged(async () => {
    if (!app) {
        app = createApp(App);
        
        // Panggil fungsi mountApp yang sudah dimodifikasi
        await mountApp();
    }
});