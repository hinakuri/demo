import Vue from 'vue';
import Router from 'vue-router';
import Item from './components/Item';
import User from './components/User';
import CrudUser from './components/CrudUser';
import CrudItem from './components/CrudItem';
import Crudsalarys from './components/Crudsalarys';
import salarys from './components/salarys';
import price from './components/price';
import CrudPrice from './components/CrudPrice';

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
      path: '/price',
      name: 'price',
      component: price
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
      path: '/crudPrice',
      name: 'crudPrice',
      component: CrudPrice
    },
    {
      path: '/cruditem',
      name: 'cruditem',
      component: CrudItem
    }
  ]
})
