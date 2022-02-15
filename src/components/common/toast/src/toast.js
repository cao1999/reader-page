import Vue from 'vue';
import MyToast from './toast.vue';

// TODO: 加入icon、loading效果
const ToastConstructor = Vue.extend(MyToast);
const toastInstance = [];
// toast组件默认属性
const defaultConfig = {
    // 持续时间
    duration: 2000,
    // 文本
    message: '',
    // 关闭toast的callback
    onClose: null,
    // toast的位置，默认是中间
    position: 'middle'
}

// 获取toast实例， 只维护一个实例，只维护一个toast节点
function getInstance() {
    if (toastInstance.length > 0) {
        let instance = toastInstance[0];
        return instance
    }

    return new ToastConstructor()
}

// 获取toast节点
function getToastNode() {
    return document.getElementById('toast');
}

/**
 * 删除toast节点
 * @param {Node} $node toast的节点 
 */
function removeToastNode($node) {
    document.body.removeChild($node)
}

// 关闭toast，在组件内部执行移除node的函数，为了实现动画效果
ToastConstructor.prototype.close = function () {
    this.closed = true;
    this.visible = false;
}

/**
 * 创建toast函数
 * @param {Object} options 
 * @return {Object} toast实例
 */
const Toast = (options = {}) => {
    // 判断当前页面上是否有toast，有的话先移除
    const $toast = getToastNode();
    if ($toast) {
        removeToastNode($toast);
    }

    // 获取toast实例
    let instance = getInstance();
    // 清除上一个定时器
    clearTimeout(instance.timer);

    // 如果options是字符串，则当做message处理
    if (typeof options === 'string') {
        options = {
            message: options
        }
    }

    // 合并默认配置
    options = { ...defaultConfig, ...options};
    const { duration, message, onClose } = options;

    instance.closed = false;
    // 获取组件的虚拟dom
    instance.vm = instance.$mount();
    instance.$dom = instance.vm.$el;
    // 绑定卸载toast的函数
    instance.unMount = removeToastNode;
    instance.onClose = onClose;
    instance.message = message;
    instance.visible = true;
    // 将节点添加到页面上
    document.body.appendChild(instance.$dom);
    toastInstance.length === 0 && toastInstance.push(instance);

    Vue.nextTick(function () {
        // 关闭toast组件
        instance.timer = setTimeout(() => {
            if (instance.closed) {
                return 
            }

            instance.close();
        }, duration);
    })

    return instance
}

export default Toast
