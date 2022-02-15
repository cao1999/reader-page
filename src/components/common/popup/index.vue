<template>
  <div class="popup" v-show="showPopup">
    <!-- mask -->
    <div :class="maskClass" @click="clickMask"></div>

    <!-- 主体内容 -->
    <div :class="mainClass">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showPopup: false,
    };
  },

  props: {
    // 控制popup的显示隐藏
    show: {
      type: Boolean,
      default: false,
    },
    // 动画持续的时间
    timeout: {
      type: Number,
      default: 300,
    },
    // 点击mask触发的事件
    onClickMask: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    maskClass() {
      return (
        "popup__mask " + (this.show ? "popup__mask--show" : "popup__mask--hide")
      );
    },

    mainClass() {
      return (
        "popup__main " + (this.show ? "popup__main--show" : "popup__main--hide")
      );
    },
  },

  methods: {
    clickMask() {
      this.onClickMask();
    },
  },

  watch: {
    show(status) {
      if (!status) {
        setTimeout(() => {
          this.showPopup = false
        }, this.timeout);
      } else {
        this.showPopup = true
      }
    }
  }
};
</script>

<style>
.popup {
  position: fixed;
  top: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
}

.popup__mask {
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 100%;
  background: rgba(19, 17, 26, 0.49);
}

.popup__mask--show {
  animation: showMask 0.3s forwards;
}

.popup__mask--hide {
  animation: hideMask 0.3s forwards;
}

.popup__main {
  position: absolute;
  bottom: 0;
  z-index: 1;
  width: 100%;
}

.popup__main--show {
  animation: showMain 0.3s forwards;
}

.popup__main--hide {
  animation: hideMain 0.3s forwards;
}

@keyframes showMask {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes hideMask {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

@keyframes showMain {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes hideMain {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100%);
  }
}
</style>