import Vue from 'vue'
import App from './App.vue'
import Buefy from 'buefy'
import wysiwyg from 'vue-wysiwyg'

import 'buefy/dist/buefy.css'
import "vue-wysiwyg/dist/vueWysiwyg.css";

Vue.use(Buefy)
Vue.use(wysiwyg, {})

Vue.config.productionTip = false

new Vue(App).$mount('#app')


