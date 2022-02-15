import ReadPage from '../view/readerPage.vue';
import NotFound from '../view/404.vue';
import VueRouter from "vue-router";

const routes = [
    {
        name: 'readPage',
        path: '/readPage/:novelId/:urlChapterId',
        component: ReadPage
    },
    // 404页面
    {
        path: '*',
        component: NotFound
    }
]

const router = new VueRouter({
    routes
})

export default router