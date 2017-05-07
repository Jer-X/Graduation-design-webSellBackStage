// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueResource);
Vue.use(ElementUI);

function isEmptyObject(obj) {
    for (var key in obj) {
        return false;
    }
    return true;
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});