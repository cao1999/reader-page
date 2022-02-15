<template>
  <pull-refresh
    :onBottom="loadNextChapter"
    :onRefresh="loadPreviousChapter"
    :bottomDistance="bottomDistance"
    :canRefreshing="canRefreshing"
    :flagId="'chapter-pullRefresh'"
  >
    <!-- 垂直滑动翻页 -->
    <div
      class="reader-page__viewport-vertical"
      ref="vertical"
      @click="onClickScreen"
      @touchstart="onTouchstart"
    >
      <div class="reader-page__viewport-vertical-chapter-container" ref="chapterContainer">
        <!-- 内容有多个chapter盒子组成 -->
        <div
          v-for="(chapter, index) in chapterList"
          :key="index"
          class="reader-page__viewport-vertical__chapter"
        >
          <h2 :class="chapterTitleClass">
            {{ chapter.chapterTitle }}
          </h2>
          <div :class="textColorClass">
            <p
              v-for="(text, index) in chapter.contentList"
              :key="index"
              class="reader-page__content-list--item"
            >
              {{ text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </pull-refresh>
</template>

<script>
import { firstLoadChapter, showToolBar } from "./helper";
import Toast from "@/components/common/toast/index";
import PullRefresh from "@/components/common/pullRefresh/index.vue";

export default {
  data() {
    return {
      shouldScrollLoad: true,
      bottomDistance: window.innerHeight,
      canRefreshing: true,
    };
  },

  components: {
    PullRefresh,
  },

  mounted() {
    const $vertical = this.$refs.vertical;
    const $chapterContainer = this.$refs.chapterContainer;

    this.$store.commit("updateVerticalContainerInfo", {
      $page: document.getElementById("chapter-pullRefresh"),
      $chapterContainer
    });

    // 首次加载章节数据
    firstLoadChapter(this);

    $vertical.addEventListener("touchstart", this.onTouchstart);
  },

  methods: {
    // 点击屏幕显示、隐藏菜单栏
    onClickScreen() {
      showToolBar.call(this);
    },

    // 加载上一章数据
    loadPreviousChapter() {
      const {
        novelId,
        chapterId,
        startChapterId,
      } = this.$store.state.chapterInfo;

      this.canRefreshing = false;

      if (chapterId === startChapterId) {
        // 两次的props变化时间差太短，使用异步定时器包裹起来
        setTimeout(() => {
          this.canRefreshing = true;
        }, 0);

        return Toast("当前是第一章");
      }

      this.$store.dispatch("getChapterInfo", {
        novelId,
        chapterId: chapterId - 1,
        pullLoad: true,
        showLoading: false,
        callback: () => {
          this.canRefreshing = true;
        },
      });
    },

    // 下拉加载下一章数据
    loadNextChapter() {
      if (this.shouldScrollLoad) {
        const {
          novelId,
          chapterId,
          endChapterId,
        } = this.$store.state.chapterInfo;

        if (chapterId >= endChapterId) {
          return Toast("当前是最后一章");
        }

        // 加载完成前不能再次执行
        this.shouldScrollLoad = false;

        this.$store.dispatch("getChapterInfo", {
          novelId,
          chapterId: chapterId + 1,
          scrollLoad: true,
          callback: () => {
            this.shouldScrollLoad = true;
          },
        });
      }
    },

    onTouchstart() {
      // 监听touchstart事件，当滑动的时候，隐藏菜单栏
      const toolBarVisible = this.$store.state.showToolbar;
      toolBarVisible && showToolBar.call(this);
    },
  },

  computed: {
    chapterTitle() {
      const { chapterTitle } = this.$store.state.chapterInfo;

      return chapterTitle;
    },

    /* 章节标题class */
    chapterTitleClass() {
      const { isDayMode } = this.$store.state.currentInfo;

      return `reader-page__chapter-title ${
        !isDayMode ? "reader-page__chapter-title_night" : ""
      }`;
    },

    chapterList() {
      const { chapterList } = this.$store.state.verticalContainerInfo;

      return chapterList;
    },

    /* 文本颜色 */
    textColorClass() {
      const { isDayMode } = this.$store.state.currentInfo;
      return `reader-page__vertical-content-list ${
        !isDayMode ? "night-mode__text-color" : ""
      }`;
    },
  },
};
</script>

<style>
.reader-page__viewport-vertical {
  height: 100%;
}

.reader-page__vertical-content-list {
  color: #333;
}
</style>