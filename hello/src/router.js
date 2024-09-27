import Vue from 'vue';
import Router from 'vue-router';
import Item from './components/Item';
import User from './components/User';
import CrudUser from './components/CrudUser';
import CrudItem from './components/CrudItem';
import Crudsalarys from './components/Crudsalarys';
import salarys from './components/salarys';

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'cruduser',
      component: CrudUser
    },
    {
      path: '/item',
      name: 'item',
      component: Item
    },
    {
      path: '/user',
      name: 'user',
      component: User
    },
    {
      path: '/salarys',
      name: 'salarys',
      component: salarys
    },
    {
      path: '/cruduser',
      name: 'cruduser',
      component: CrudUser
    },
    {
      path: '/crudsalarys',
      name: 'crudsalarys',
      component: Crudsalarys
    },
    {
      path: '/cruditem',
      name: 'cruditem',
      component: CrudItem
    }
  ]
})
