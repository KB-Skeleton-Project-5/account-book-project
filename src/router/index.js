import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('../pages/main/MainHome.vue'),
    },
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
      name: 'challenges',
      component: () => import('../pages/challenges/Challenge.vue'),
    },
    {
      path: '/challenges/add',
      name: 'challenges/add',
      component: () => import('../pages/challenges/ChallengeAdd.vue'),
    },
    {
      path: '/challenges/info/:id',
      name: 'challenges/info',
      component: () => import('../pages/challenges/ChallengeInfo.vue'),
    },
    {
      path: '/challenges/modify:id/',
      name: 'challenges/modify',
      component: () => import('../pages/challenges/ChallengeAdd.vue'),
    },
  ],
});

import { getUserInfo } from '../util/authUtil.js'

// 로그인이 필요한 페이지 목록
const authRequiredPages = [
  'main',
  'users/info',
  'users/edit',
  'users/delete',
  'expenses',
  'expenses/add',
  'expenses/modify/id',
  'expenses/info/id',
  'summaries',
  'calendars',
  'calendars/add',
  'calendars/info',
  'calendars/modify',
  'challenges',
  'challenges/add',
  'challenges/info',
  'challenges/modify',
]

router.beforeEach((to, from, next) => {
  const userInfo = getUserInfo()

  if (authRequiredPages.includes(to.name) && !userInfo.authenticated) {
    next({ name: 'users/login' })
  } else {
    next()
  }
})

export default router;
