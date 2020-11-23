import { createRouter, createWebHistory } from 'vue-router';
import Game from '../views/Game.vue';
import Login from '../views/Login.vue';
import store from '../store';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/games/:roomId?',
    name: 'Game',
    component: Game,
    beforeEnter: (to, from, next) => {
      if (!store.state.auth.isAuthenticated) {
        return next('/login');
      }
      return next();
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Login,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
