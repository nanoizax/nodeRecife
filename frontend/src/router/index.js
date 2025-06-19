import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Vehicles from '../pages/Vehicles.vue';
import Motoristas from '../pages/Motoristas.vue';
import Mantenimientos from '../pages/Mantenimientos.vue';
import Telemetria from '../pages/Telemetria.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/vehicles', component: Vehicles },
  { path: '/motoristas', component: Motoristas },
  { path: '/mantenimientos', component: Mantenimientos },
  { path: '/telemetria', component: Telemetria },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;