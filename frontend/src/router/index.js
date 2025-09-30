import {createRouter, createWebHistory} from 'vue-router'
import Lessons from '../views/Lessons.vue'
import Cart from '../views/Cart.vue'

export default createRouter({
    history: createWebHistory(),
    routes: [
        {path : '/', component: Lessons},
        {path : '/cart', component: Cart}
    ],
    scrollBehavior: () => ({ top: 0 })
});