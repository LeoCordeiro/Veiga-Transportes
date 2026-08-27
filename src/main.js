import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import revela from './directives/revela'
import { aplicarTokens } from './config/tokens'
import './styles/global.css'

// Antes do mount: os tokens precisam existir quando o primeiro componente
// calcular estilo, senão a primeira pintura sai com os valores de fallback.
aplicarTokens()

createApp(App).use(router).use(vuetify).directive('revela', revela).mount('#app')
