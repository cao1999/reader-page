<template>
  <div class="chapter-menu">
    <!-- 上一章按钮 -->
    <div :class="previousBtnClass" @click="goPrevious"></div>
    <!-- 切换章节滑块 -->
    <Slider
      :onEnd="sliderEnd"
      :onStart="sliderStart"
      :onMove="sliderMove"
      :blockPos="sliderProgress"
    ></Slider>
    <!-- 下一章按钮 -->
    <div :class="nextBtnClass" @click="goNext"></div>
    <!-- 章节信息窗口 -->
    <div :class="chapterWindowClass" v-show="chapterWindowStatus">
      <!-- 章节名 -->
      <div class="chapter-menu__chapter-window--title overflow-line">
        {{ chapterTitle }}
      </div>
      <!-- 进度 -->
      <div class="chapter-menu__chapter-window--progress overflow-line">
        {{ chapterProgress }}
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "@/components/common/slider/index.vue";
import { round } from "mathjs";
import { goNextChapter, goPreviousChapter } from "@/utils/chapter";
import { debounce } from "@/utils/common";

// 关闭章节弹窗
const closeChapterWindow = debounce(function () {
  this.$store.commit("updateChapterSliderInfo", {
    showChapterWindow: false,
  });
}, 1000);

export default {
  data() {
    return {
      // 控制滑块的位置，初始化
      sliderProgress: 0,
      // 当前滑动时，请求的章节id
      finishedId: "",
      // 滑块是否在滑动
      isSliding: false,
    };
  },

  components: {
    Slider,
  },

  methods: {
    sliderStart() {
      this.showChapterWindow(false);
    },

    // 滑动时执行的函数
    sliderMove(progress) {
      this.isSliding = true;

      const {
        startChapterId,
        endChapterId,
        novelId,
      } = this.$store.state.chapterInfo;
      const totalChapter = endChapterId - startChapterId;
      const chapterId = startChapterId + Math.floor(totalChapter * progress);

      if (this.finishedId !== chapterId) {
        this.$store.dispatch("getChapterInfo", {
          novelId,
          chapterId,
        });

        this.finishedId = chapterId;
      }

      // 更新当前进度
      this.$store.commit("updateChapterSliderInfo", { progress });
    },

    // 滑动结束时执行的函数
    sliderEnd() {
      this.isSliding = false;

      // 隐藏章节窗口
      this.$store.commit("updateChapterSliderInfo", {
        showChapterWindow: false,
      });
    },

    /**
     * 显示章节窗口
     * @param {Boolean} isClick 是否点击触发
     */
    showChapterWindow(isClick = true) {
      const { showChapterWindow } = this.$store.state.chapterSliderInfo;

      if (!showChapterWindow) {
        this.$store.commit("updateChapterSliderInfo", {
          showChapterWindow: true,
        });
      }

      // 1s后消失
      if (isClick) {
        closeChapterWindow.call(this);
      }
    },

    // 上一章 切换章节，更新滑块位置
    goPrevious() {
      this.showChapterWindow();
      goPreviousChapter(this);
    },

    // 下一章 切换章节，更新滑块位置
    goNext() {
      this.showChapterWindow();
      goNextChapter(this);
    },
  },

  computed: {
    chapterWindowClass() {
      const { bgColorNum, isDayMode } = this.$store.state.currentInfo;

      return `chapter-menu__chapeter-window toolbar-bg-color__${bgColorNum} ${
        !isDayMode
          ? "toolbar-bg-color__night chapter-menu__chapeter-window_night"
          : ""
      }`;
    },

    // 章节当前进度
    chapterProgress() {
      const { progress } = this.$store.state.chapterSliderInfo;
      return round(progress * 100, 2) + "%";
    },

    // 章节window的显示状态
    chapterWindowStatus() {
      return this.$store.state.chapterSliderInfo.showChapterWindow;
    },

    // 上一章按钮class
    previousBtnClass() {
      const { isDayMode } = this.$store.state.currentInfo;
      return `chapter-menu__previous-btn ${
        !isDayMode ? "chapter-menu__previous-btn_night" : ""
      }`;
    },

    // 下一章按钮class
    nextBtnClass() {
      const { isDayMode } = this.$store.state.currentInfo;
      return `chapter-menu__next-btn ${
        !isDayMode ? "chapter-menu__next-btn_night" : ""
      }`;
    },

    // 章节标题
    chapterTitle() {
      const { chapterTitle } = this.$store.state.chapterInfo;
      return chapterTitle;
    },

    sliderPosition() {
      const { progress } = this.$store.state.chapterSliderInfo;
      return progress;
    },
  },

  watch: {
    // 手动更新滑块的位置，第一次监听到就执行
    sliderPosition: {
      handler(progress) {
        // 当滑块滑动时，不执行更新操作
        if (this.isSliding) {
          return;
        }

        this.sliderProgress = progress;
      },
      immediate: true
    },
  },
};
</script>

<style>
.chapter-menu {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 43px 0;
}

.chapter-menu__previous-btn,
.chapter-menu__next-btn {
  width: 28px;
  height: 49px;
}

.chapter-menu__previous-btn {
  background: url("./img/chapter/previous.png") no-repeat center/100%;
}

.chapter-menu__next-btn {
  background: url("./img/chapter/next.png") no-repeat center/100%;
}

/* 禁止点击 */
.chapter-menu__previous-btn_forbid {
  background: url("./img/chapter/previous_forbid.png") no-repeat center/100%;
}

.chapter-menu__next-btn_forbid {
  background: url("./img/chapter/next_forbid.png") no-repeat center/100%;
}

/* 夜间模式切换章节按钮 */
.chapter-menu__previous-btn_night {
  background: url("./img/chapter/previous_night.png") no-repeat center/100%;
}

.chapter-menu__next-btn_night {
  background: url("./img/chapter/next_night.png") no-repeat center/100%;
}

.chapter-menu__chapeter-window {
  position: absolute;
  top: -133px;
  left: 50%;
  width: 60%;
  margin: 0 auto;
  padding: 36px 70px;
  text-align: center;
  color: #000;
  transform: translate3d(-50%, -100%, 0);
  border-radius: 7%;
}

.chapter-menu__chapter-window--title,
.chapter-menu__chapter-window--progress {
  opacity: 0.7;
  font-size: 40px;
  letter-spacing: 0;
}

.chapter-menu__chapter-window--title {
  margin-bottom: 7px;
}

.chapter-menu__chapeter-window_night {
  color: #fff;
}
</style>