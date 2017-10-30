import Vue from 'vue';
import Router from 'vue-router';

import LayoutMain from '@/components/LayoutMain';
import LayoutPlain from '@/components/LayoutPlain';

import PageDashboard from '@/components/PageDashboard';
import PageVerbal from '@/components/PageVerbal';
import PageVerbalAll from '@/components/PageVerbalAll';
import PageVerbalCreate from '@/components/PageVerbalCreate';
import PageSettings from '@/components/PageSettings';
import PageLogin from '@/components/PageLogin';
import PageSignUp from '@/components/PageSignUp';
import ErrorForbidden from '@/components/ErrorForbidden';
import ErrorNotFound from '@/components/ErrorNotFound';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: LayoutMain,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          component: PageDashboard,
        },
        {
          path: 'verbal/all',
          component: PageVerbalAll,
        },
        {
          path: 'verbal/rekam',
          component: PageVerbalCreate,
        },
        {
          path: 'verbal/:id',
          component: PageVerbal,
        },
        {
          path: 'settings',
          component: PageSettings,
        },
      ],
    },
    {
      path: '/auth',
      component: LayoutPlain,
      children: [
        {
          path: 'login',
          component: PageLogin,
        },
        {
          path: 'signup',
          component: PageSignUp,
        },
      ],
    },
    {
      path: '/error',
      component: LayoutPlain,
      children: [
        {
          path: '404',
          name: 'NotFound',
          component: ErrorNotFound,
        },
        {
          path: '403',
          name: 'Forbidden',
          component: ErrorForbidden,
        },
      ],
    },
    {
      path: '*',
      redirect: { name: 'NotFound' },
    },
  ],
});

export default router;
