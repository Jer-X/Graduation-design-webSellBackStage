import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/home';
import login from '@/components/login';
import order from '@/components/order';
import goods from '@/components/goods';
import columns from '@/components/columns';
import add from '@/components/add';
import seller from '@/components/seller';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: login
        },
        {
            path: '/home',
            name: 'Home',
            component: Home,
            children: [{
                    name: 'orders',
                    path: 'orders',
                    component: order
                },
                {
                    name: 'goods',
                    path: 'goods',
                    component: goods
                },
                {
                    name: 'add',
                    path: 'add',
                    component: add
                },
                {
                    name: 'seller',
                    path: 'seller',
                    component: seller
                },
                {
                    name: 'columns',
                    path: 'columns',
                    component: columns
                }
            ]
        }
    ]
});