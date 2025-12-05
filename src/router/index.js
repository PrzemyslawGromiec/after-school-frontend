import {createRouter,  createWebHashHistory} from 'vue-router'
import Lessons from '../views/Lessons.vue'
import Cart from '../views/Cart.vue'
import Feedback from '../views/Feedback.vue';

const routes = [
    {path : '/', component: Lessons},
    {path : '/cart', component: Cart},
    {path : '/feedback', name: 'Feedback', component: Feedback}
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 })
});

export default router;