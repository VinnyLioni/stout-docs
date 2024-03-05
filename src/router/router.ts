import { createRouter, createWebHistory } from "vue-router";
// import MainPage from "../views/MainPage.vue";
import NfReader from "../pages/NfReader.vue";
import HomePage from "../pages/HomePage.vue";
import ObjIdentify from "../pages/ObjIdentify.vue";
import DailyNotes from '../pages/DailyNotes.vue'

const routes = [
  {
    path: "/leitor",
    name: "reader",
    component: NfReader,
  },
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/identificador',
    name: 'identifier',
    component: ObjIdentify
  },
  {
    path: '/notas',
    name: 'notes',
    component: DailyNotes
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
