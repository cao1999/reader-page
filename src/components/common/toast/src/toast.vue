<template>
    <transition name="toast-fade" @after-leave="onAfterLeave">
        <div class="toast" id="toast" v-show="visible">
            <span class="toast-text">{{ message }}</span>
        </div>
    </transition>
</template>

<script>
export default {
    data() {
        return {
            message: "",
            visible: false
        };
    },

    props: {
        unMount: Function,
        $dom: Object,
        onClose: Function
    },

    methods: {
        onAfterLeave() {
            this.unMount && this.unMount(this.$dom);
            // 执行回调
            this.onClose && this.onClose();
        }
    }
};
</script>

<style>
.toast {
    position: fixed;
    bottom: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    max-width: 50%;
    padding: 20px 30px;
    color: #fff;
    font-size: 50px;
    line-height: 50px;
    background-color: rgba(0,0,0,.7);
    border-radius: 10px;
}

.toast-fade-enter-active, .toast-fade-leave-active {
    transition: all .5s;
    opacity: 1;
}

.toast-fade-enter, .toast-fade-leave-to {
    opacity: 0;
}
</style>