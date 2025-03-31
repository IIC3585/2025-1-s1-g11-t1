import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

// PrimeVue
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

// PrimeVue Components and Services
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

// Use PrimeVue and its services
app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app') 