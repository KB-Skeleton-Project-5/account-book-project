import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/users/login',
      name: 'users/login',
      component: () => import('../pages/Login.vue'),
    },
    {
      path: '/users/register',
      name: 'users/register',
      component: () => import('../pages/Register.vue'),
    },
    {
      path: '/users/info',
      name: 'users/info',
      component: () => import('../pages/MemberInfo.vue'),
    },
    {
      path: '/users/edit',
      name: 'users/edit',
      component: () => import('../pages/MemberEdit.vue'),
    },
    {
      path: '/users/reset',
      name: 'users/reset',
      component: () => import('../pages/PasswordReset.vue'),
    },
    {
      path: '/users/delete',
      name: 'users/delete',
      component: () => import('../pages/MemberDelete.vue'),
    },
 {
      path: '/expenses',
      name: 'expenses',
      component: () => import('../pages/ExpensesList.vue'),
    },
    {
      path: '/expenses/add',
      name: 'expenses/add',
      component: () => import('../pages/ExpensesAdd.vue'),
    },
    {
      path: '/expenses/modify/:id',
      name: 'expenses/modify/id',
      component: () => import('../pages/ExpenseModify.vue'),
    },
    {
  path: '/summary',
  name: 'summary',
  component: () => import ('../pages/Summary.vue')
},

{
  path : '/calendar',
  name: 'calendar',
  component: () =>import ('../pages/Calendar.vue')
},

{
  path: '/calendar/add',
  name: 'calendar/add',
  component: () => import('../pages/CalendarAdd.vue')

},

{
  path: '/calendar/modify/:id',
  name: 'calendar/modify',
  component: () => import('../pages/CalendarModify.vue')
}, 
      {
      path: '/challenges',
      name: 'Challenge',
      component: () => import('../pages/Challenge.vue'),
    },
    {
      path: '/challenges/add',
      name: 'ChallengeAdd',
      component: () => import('../pages/ChallengeForm.vue'),
    },
    {
      path: '/challenges/info/:id',
      name: 'ChallengeInfo',
      component: () => import('../pages/ChallengeInfo.vue'),
    },
    {
      path: '/challenges/modify:id/',
      name: 'ChallengeModify',
      component: () => import('../pages/ChallengeForm.vue'),
    },
  ],
})

export default router
