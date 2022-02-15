import Vue from 'vue';
import MyLoading from './loading.vue';

const LoadingConstructor = Vue.extend(MyLoading);
// 全局loading组件的实例
let globalLoadingInstance = null;

const getInstance = function () {
    return globalLoadingInstance || new LoadingConstructor()
}

const getLoadingNode = function () {
    return document.getElementById('loading')
}

const removeLoadingNode = ($node) => {
    document.body.removeChild($node)
}


// 全局只维护一个loading组件，node
const Loading = () => {
    const instance = getInstance();
    const loadingNode = getLoadingNode();
    if (loadingNode) {
        // 如果loading node存在，直接返回组件的实例
        return instance
    }

    instance.$node = instance.$mount().$el;
    document.body.appendChild(instance.$node);
    globalLoadingInstance = instance;

    return instance
}

const show = function () {
    Loading()
}

const close = function () {
    getLoadingNode() && globalLoadingInstance && removeLoadingNode(globalLoadingInstance.$node);
}

LoadingConstructor.prototype.show = show;
LoadingConstructor.prototype.close = close;

export default {
    show,
    close
}