<template>
  <div :class="pageClass">
    <!-- 翻页模式 -->
    <div :class="pageModeClass">
      <vertical-page v-if="scrollTurnPage"></vertical-page>
      <horizontal-page v-else></horizontal-page>
    </div>

    <!-- 工具栏 -->
    <tool-bar :show="$store.state.showToolbar"></tool-bar>
    <!-- 目录弹窗 -->
    <contents-popup :show="contentsStatus"></contents-popup>
  </div>
</template>

<script>
import ToolBar from "../toolbar/index.vue";
import ContentsPopup from "../contentsPopup/index.vue";
import HorizontalPage from '../turnPage/horizontal.vue';
import VerticalPage from '../turnPage/vertical.vue';

export default {
  components: {
    ToolBar,
    ContentsPopup,
    HorizontalPage,
    VerticalPage
  },

  computed: {
    contentsStatus() {
      return this.$store.state.showContents;
    },

    /* 设置pageclass */
    pageClass() {
      const { isDayMode, bgColorNum } = this.$store.state.currentInfo;

      return `reader-page bg-color__${bgColorNum} ${
        !isDayMode ? "bg-color__night" : ""
      }`;
    },

    /* 翻页模式div */
    pageModeClass() {
      const { lineHeight } = this.$store.state.currentInfo;

      return `reader-page__page-mode text__lineHeight_${lineHeight}`
    },

    /* 翻页模式，是否为上下滑动翻页 */
    scrollTurnPage() {
      const { scrollTurnPage } = this.$store.state.currentInfo;
      return scrollTurnPage
    }
  }
};
</script>

<style>
@import url("../../assets/css/global.css");

*,
*:after,
*:before {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

html,
body,
p,
ul,
li,
h1,
h2 {
  margin: 0;
  padding: 0;
}

ul {
  list-style: none;
}

.reader-page {
  position: relative;
  width: 100%;
  height: 100%;
  letter-spacing: 0.02em;
}

.reader-page__page-mode {
  overflow: hidden;
  width: 100%;
  height: 100%;
  padding: 40px 0;
}
</style>