import { createRouter, createWebHistory } from 'vue-router'


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
      component: () => import('../pages/expenses/ExpensesList.vue'),
    },
    {
      path: '/expenses/add',
      name: 'expenses/add',
      component: () => import('../pages/expenses/ExpensesAdd.vue'),
    },
    {
      path: '/expenses/modify/:id',
      name: 'expenses/modify/id',
      component: () => import('../pages/expenses/ExpensesModify.vue'),
    },
    {
  path: '/summary',
  name: 'summary',
  component: () => import ('../pages/summary/Summary.vue')
},

{
  path : '/calendar',
  name: 'calendar',
  component: () =>import ('../pages/calendar/Calendar.vue')
},

{
  path: '/calendar/add',
  name: 'calendar/add',
  component: () => import('../pages/calendar/CalendarAdd.vue')

},

{
  path: '/calendar/modify/:id',
  name: 'calendar/modify',
  component: () => import('../pages/calendar/CalendarModify.vue')
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
      path: '/challenges/modify:id/',
      name: 'ChallengeModify',
      component: () => import('../pages/challenges/ChallengeForm.vue'),
    },
  ],
})

export default router