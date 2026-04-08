import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/users/login',
      name: 'users/login',
      component: () => import('../pages/users/Login.vue'),
    },
    {
      path: '/users/register',
      name: 'users/register',
      component: () => import('../pages/users/Register.vue'),
    },
    {
      path: '/users/info',
      name: 'users/info',
      component: () => import('../pages/users/MemberInfo.vue'),
    },
    {
      path: '/users/edit',
      name: 'users/edit',
      component: () => import('../pages/users/MemberEdit.vue'),
    },
    {
      path: '/users/reset',
      name: 'users/reset',
      component: () => import('../pages/users/PasswordReset.vue'),
    },
    {
      path: '/users/delete',
      name: 'users/delete',
      component: () => import('../pages/users/MemberDelete.vue'),
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../pages/expenses/ExpenseList.vue'),
    },
    {
      path: '/expenses/add',
      name: 'expenses/add',
      component: () => import('../pages/expenses/ExpenseAdd.vue'),
    },
    {
      path: '/expenses/modify/:id',
      name: 'expenses/modify/id',
      component: () => import('../pages/expenses/ExpenseModify.vue'),
    },
    {
      path: '/expenses/info/:id',
      name: 'expenses/info/id',
      component: () => import('../pages/expenses/ExpenseInfo.vue'),
    },
    {
      path: '/summaries',
      name: 'summaries',
      component: () => import('../pages/summaries/Summary.vue'),
    },

    {
      path: '/calendars',
      name: 'calendars',
      component: () => import('../pages/calendars/Calendar.vue'),
    },

    {
      path: '/calendars/add',
      name: 'calendars/add',
      component: () => import('../pages/calendars/CalendarAdd.vue'),
    },

    {
      path: '/calendars/info/:id',
      name: 'calendars/info',
      component: () => import('../pages/calendars/CalendarInfo.vue'),
    },

    {
      path: '/calendars/modify/:id',
      name: 'calendars/modify',
      component: () => import('../pages/calendars/CalendarModify.vue'),
    },
    
    {
      path: '/challenges',
      name: 'Challenge',
      component: () => import('../pages/challenges/Challenge.vue'),
    },
    {
      path: '/challenges/add',
      name: 'ChallengeAdd',
      component: () => import('../pages/challenges/ChallengeForm.vue'),
    },
    {
      path: '/challenges/info/:id',
      name: 'ChallengeInfo',
      component: () => import('../pages/challenges/ChallengeInfo.vue'),
    },
    {
      path: '/challenges/modify/:id',
      name: 'ChallengeModify',
      component: () => import('../pages/challenges/ChallengeForm.vue'),
    },
  ],
});

export default router;
