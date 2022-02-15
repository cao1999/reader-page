<template>
  <div
    class="pull-refresh"
    ref="pullRefresh"
    :style="boxStyle"
    @scroll="onScroll"
    :id="flagId"
  >
    <div class="pull-refresh__loading" ref="pullRefreshLoading">
      <span></span>
    </div>
    <div class="pull-refresh__container" ref="pullRefreshContainer">
      <slot></slot>
    </div>
  </div>
</template>

<script>
let startPos = 0;
let moveDis = 0;
let endPos = 0;
let maxPos = 0;
let overDis = 0;
let isMoved = false;

export default {
  data() {
    return {
      canPull: true,
    };
  },

  mounted() {
    this.addTouchEvent();
  },

  props: {
    onRefresh: {
      type: Function,
    },
    onBottom: {
      type: Function,
    },
    bottomDistance: {
      type: Number,
      default: 0,
    },
    boxStyle: {
      type: Object,
      default: () => ({}),
    },
    flagId: {
      type: String,
      required: true,
    },
    canRefreshing: {
      type: Boolean,
      default: true,
    },
    maxDistance: {
      type: Number,
      default: 100,
    },
    showLoadingDistance: {
      type: Number,
      default: 50,
    },
  },

  methods: {
    // 监听内容滚动
    onScroll() {
      const $pullRefresh = this.$refs.pullRefresh;
      const scrollHeight = $pullRefresh.scrollHeight;
      const scrollTop = $pullRefresh.scrollTop;
      const viewportHeight = $pullRefresh.clientHeight;

      // 当距离页面底部一定距离时，执行回调
      if (scrollTop >= scrollHeight - viewportHeight - this.bottomDistance) {
        this.onBottom && this.onBottom();
      }
    },

    // 移动函数
    move(pos, duration = 0) {
      const $pullRefreshLoading = this.$refs.pullRefreshLoading;
      const $pullRefreshContainer = this.$refs.pullRefreshContainer;

      $pullRefreshContainer.style.transition = `transform ${duration}s`;
      $pullRefreshContainer.style.transform = `translateY(${pos}px)`;
      $pullRefreshLoading.style.transition = `transform ${duration}s`;
      // 滑动的多少距离开始显示loading
      $pullRefreshLoading.style.transform = `translateY(${pos -
        this.showLoadingDistance}px)`;
    },

    canPullRefresh() {
      const $pullRefresh = this.$refs.pullRefresh;
      const scrollTop = $pullRefresh.scrollTop;

      return scrollTop === 0;
    },

    onTouchstart(e) {
      // 是否允许下拉
      if (!this.canPull || !this.canPullRefresh()) {
        return;
      }

      startPos = e.touches[0].clientY;
    },

    onTouchmove(e) {
      if (!this.canPull || !this.canPullRefresh()) {
        return;
      }

      endPos = e.touches[0].clientY;
      moveDis = endPos - startPos;
      isMoved = true;
      // 下拉的最大距离不超过100
      if (moveDis > this.maxDistance) {
        maxPos = endPos > maxPos ? endPos : maxPos;
        moveDis = this.maxDistance;

        // 在超出范围内向上滑动，组件也需要同步向上滑动
        if (endPos < maxPos) {
          overDis = maxPos - endPos;

          this.move(this.maxDistance - overDis);
        }

        return;
      }

      // 暂时不支持上滑，所以小于0return
      if (moveDis < 0) {
        return;
      }

      this.move(moveDis - overDis);
    },

    onTouchend() {
      if (!this.canPull || !this.canPullRefresh() || !isMoved) {
        return;
      }

      if (moveDis - overDis < this.showLoadingDistance) {
        maxPos = 0;
        overDis = 0;
        return this.move(0, 0.3);
      }

      if (moveDis < 0) {
        return;
      }

      this.canPull = false;
      isMoved = false;
      maxPos = 0;
      overDis = 0;
      this.onRefresh && this.onRefresh();
    },

    // 添加touch事件
    addTouchEvent() {
      const $pullRefresh = this.$refs.pullRefresh;
      $pullRefresh.addEventListener("touchstart", this.onTouchstart);
      $pullRefresh.addEventListener("touchmove", this.onTouchmove);
      $pullRefresh.addEventListener("touchend", this.onTouchend);
    },
  },

  watch: {
    canRefreshing(status) {
      if (status) {
        // 容器复位
        this.move(0, 0.3);
        setTimeout(() => {
          this.canPull = true;
        }, 300);
      } else {
        this.canPull = false;
      }
    },
  },
};
</script>

<style>
.pull-refresh {
  position: relative;
  overflow: scroll;
  height: 100%;
}

.pull-refresh__loading {
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);
  line-height: 50px;
}

.pull-refresh__loading span {
  display: inline-block;
  width: 60px;
  height: 60px;
  border: 5px solid #ccc;
  border-top-color: #fff;
  border-radius: 50%;
  animation: pullLoading 0.5s infinite linear;
}

@keyframes pullLoading {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

.pull-refresh__container {
  height: 100%;
}
</style>
