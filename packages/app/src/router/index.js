import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Security from '@/components/layouts/Security.vue';
import store from '@/store';

const routes = [
  {
    path: '/',
    name: 'Security',
    component: Security,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
      },
      {
        path: '/quizzes/create',
        name: 'QuizCreate',
        component: () => import('@/views/quizzes/QuizCreate.vue'),
      },
      {
        path: '/quizzes/:quizId([0-9a-f]{24})',
        name: 'Quiz',
        component: () => import('@/views/quizzes/Quiz.vue'),
      },
      {
        path: '/:roomId([0-9A-Z]{6})',
        name: 'Game',
        component: () => import('@/views/Game.vue'),
      },
      {
        path: 'quizzes/:quizId([0-9a-f]{24})/play',
        name: 'QuizPlay',
        component: () => import('@/views/quizzes/QuizPlay.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/auth/Logout.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
  },
  {
    path: '/recovery',
    name: 'Recovery',
    component: () => import('@/views/auth/Recovery.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/auth/Auth.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters['auth/isAuthenticated']) {
      next();
      return;
    }
    localStorage.setItem('after_auth_path', to.path);
    next('/login');
  } else {
    next();
  }
});

export default router;
