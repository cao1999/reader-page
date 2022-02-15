<template>
  <!-- 横向翻页，阅读器视口 -->
  <div class="reader-page__viewport-horizontal" ref="horizontal">
    <!-- 阅读内容 -->
    <div :class="textColorClass" ref="pageList">
      <!-- 小说名，只有在第一章显示 -->
      <!-- <h1 class="reader-page__novel-title">{{novelTitle}}</h1> -->
      <!-- 章节标题 -->
      <h2 :class="chapterTitleClass">{{ chapterTitle }}</h2>
      <p
        class="reader-page__content-list--item"
        v-for="(text, index) in contentList"
        :key="index"
      >
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  goPreviousChapter,
  goNextChapter,
  lastChapterToast,
  firstChapterToast,
} from "../../utils/chapter";
import { firstLoadChapter, showToolBar } from "./helper";

// 滑动所需变量
let startPos = 0,
  endPos = 0,
  startTime = 0,
  endTime = 0,
  currentPos = 0,
  moveDistance = 0,
  direction = "left",
  canMove = true,
  isMoved = false;

export default {
  mounted() {
    // 初始化容器信息
    let pageWidth = window.innerWidth;
    let $page = this.$refs.pageList;
    this.$store.commit("updateContainerInfo", {
      pageWidth,
      $page,
    });

    // 首次加载章节数据
    firstLoadChapter(this);

    // 监听点击滑动视口事件
    let $horizontal = this.$refs.horizontal;
    $horizontal.addEventListener("touchstart", this.touchStart);
    $horizontal.addEventListener("touchmove", this.touchMove);
    $horizontal.addEventListener("touchend", this.touchEnd);
  },

  computed: {
    /* 文本颜色 */
    textColorClass() {
      const { isDayMode } = this.$store.state.currentInfo;
      return `reader-page__content-list ${
        !isDayMode ? "night-mode__text-color" : ""
      }`;
    },

    /* 章节标题class */
    chapterTitleClass() {
      const { isDayMode } = this.$store.state.currentInfo;

      return `reader-page__chapter-title ${
        !isDayMode ? "reader-page__chapter-title_night" : ""
      }`;
    },

    /* 章节标题 */
    chapterTitle() {
      const { chapterTitle } = this.$store.state.chapterInfo;
      return chapterTitle;
    },

    /* 小说标题 */
    novelTitle() {
      const { novelTitle } = this.$store.state.chapterInfo;
      return novelTitle;
    },

    /* 章节段落内容 */
    contentList() {
      const { contentList } = this.$store.state.chapterInfo;
      return contentList;
    },
  },

  methods: {
    // 下一页
    nextPage() {
      const { currentInfo, containerInfo, chapterInfo } = this.$store.state;
      const { chapterId, endChapterId } = chapterInfo;
      const { pageNum, totalPageNum } = currentInfo;
      const { $page, pageWidth } = containerInfo;

      // 边界判断
      if (pageNum >= totalPageNum) {
        if (chapterId < endChapterId) {
          this.nextChapter();
        } else {
          lastChapterToast();
        }
        return;
      }

      $page.style.transform = `translateX(-${pageWidth * pageNum}px)`;
      currentPos = -pageWidth * pageNum;
      // 更新当前页数
      this.$store.commit("updateCurrentInfo", {
        pageNum: pageNum + 1,
      });
      // 更新容器的位置
      this.$store.commit("updateContainerInfo", {
        currentPos,
      });
    },

    // 上一页
    previousPage() {
      const { currentInfo, containerInfo, chapterInfo } = this.$store.state;
      const { pageNum } = currentInfo;
      const { startChapterId, chapterId } = chapterInfo;
      const { $page, pageWidth } = containerInfo;

      // 边界判断
      if (pageNum === 1) {
        // 切换上一章
        if (chapterId > startChapterId) {
          this.previousChapter();
        } else {
          firstChapterToast();
        }
        return;
      }

      $page.style.transform = `translateX(-${pageWidth * (pageNum - 2)}px)`;
      currentPos = -pageWidth * (pageNum - 2);
      // 更新当前页数
      this.$store.commit("updateCurrentInfo", {
        pageNum: pageNum - 1,
      });
      // 更新容器的位置
      this.$store.commit("updateContainerInfo", {
        currentPos,
      });
    },

    // 切换到下一章
    nextChapter() {
      const { $page, containerWidth } = this.$store.state.containerInfo;
      $page.style.transitionDuration = "0.3s";
      $page.style.transform = `translateX(-${containerWidth}px)`;

      // 等页面滑过去之后在加载数据
      setTimeout(() => {
        goNextChapter(this);
      }, 300);
    },

    // 切换到上一章
    previousChapter() {
      const { $page, pageWidth } = this.$store.state.containerInfo;
      $page.style.transitionDuration = "0.3s";
      $page.style.transform = `translateX(${pageWidth}px)`;

      // 等页面滑过去之后在加载数据
      setTimeout(() => {
        goPreviousChapter(this, true);
      }, 300);
    },

    // 移动到指定位置
    moveToPos(pos) {
      const { containerInfo, chapterInfo } = this.$store.state;
      const { containerWidth, pageWidth, $page } = containerInfo;
      const { chapterId, startChapterId, endChapterId } = chapterInfo;

      // 滑动区域范围，可以滑动切换章节
      if (
        (pos > 0 || pos < -(containerWidth - pageWidth)) &&
        (chapterId <= startChapterId || chapterId >= endChapterId)
      ) {
        return;
      }

      $page.style.transform = `translateX(${pos}px)`;
    },

    // touchstart事件处理函数
    touchStart(e) {
      const { showToolbar, containerInfo } = this.$store.state;
      const { canSlide } = containerInfo;

      if (!canSlide) {
        return;
      }

      // 当工具栏存在的时候滑动，隐藏工具栏，不允许翻页
      if (showToolbar) {
        showToolBar.call(this);
        canMove = false;
        return;
      }

      // 记录点击屏幕的时间
      startTime = Date.now();
      // 记录点击屏幕的位置
      startPos = e.touches[0].clientX;
    },

    // touchmove事件处理函数
    touchMove(e) {
      if (!canMove) {
        return;
      }

      console.log(e, "touch event");

      const { $page, pageWidth, currentPos, canSlide } = 
      
        this.$store.state.containerInfo;

      if (!canSlide) {
        return;
      }

      if (!isMoved) {
        // move过程中取消动画效果
        $page.style.transition = "0s";
      }
      // 更新滑动的位置
      endPos = e.touches[0].clientX;
      moveDistance = endPos - startPos;
      if (Math.abs(moveDistance) > pageWidth) {
        return;
      }
      direction = moveDistance > 0 ? "right" : "left";
      !isMoved && (isMoved = true);

      // 滑动页面
      this.moveToPos(currentPos + moveDistance);
    },

    // touchmove事件处理函数
    touchEnd() {
      if (!canMove) {
        return (canMove = true);
      }

      endTime = Date.now();
      const {
        containerInfo: { pageWidth, $page, canSlide },
        currentInfo: { leftMode },
      } = this.$store.state;

      if (!canSlide) {
        return;
      }

      //设置动画效果
      $page.style.transition = "transform 0.3s";

      // 判断是否滑动了
      if (!isMoved) {
        // 没有滑动 判断是不是左手模式
        if (startPos < pageWidth * 0.3) {
          if (leftMode) {
            this.nextPage();
          } else {
            this.previousPage();
          }
        } else if (startPos > pageWidth * 0.7) {
          if (leftMode) {
            this.previousPage();
          } else {
            this.nextPage();
          }
        } else {
          showToolBar.call(this);
        }
      } else {
        // 滑动了，判断滑动距离
        if (
          Math.abs(moveDistance) > pageWidth * 0.5 ||
          endTime - startTime <= 300
        ) {
          if (direction === "left") {
            this.nextPage();
          } else {
            this.previousPage();
          }
        } else {
          // 滑动距离太短，回到原来的位置
          this.moveToPos(currentPos);
          this.$store.commit("updateContainerInfo", {
            currentPos,
          });
        }
      }

      isMoved = false;
    },
  },
};
</script>

<style>
.reader-page__viewport-horizontal {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.reader-page__novel-title,
.reader-page__chapter-title {
  padding: 0 65px;
}

.reader-page__novel-title {
  font-size: 80px;
}

.reader-page__chapter-title {
  margin-bottom: 20px;
  font-size: 70px;
  font-weight: 400;
  color: rgb(37, 10, 12);
}

.reader-page__chapter-title_night {
  color: rgb(111, 111, 111);
}

.reader-page__content-list {
  height: 100%;
  column-width: 100vw;
  column-gap: 0;
  -webkit-column-width: 100vw;
  -webkit-column-gap: 0;
  color: #333;
  transform: translateX(0);
  transition: transform 0.3s;
}

.reader-page__content-list--item {
  margin-top: 69px;
  padding: 0 65px;
  text-indent: 2em;
  text-align: justify;
  font-size: 60px;
  opacity: 0.75;
}

.reader-page__content-list--item:first-of-type {
  margin-top: 0;
}
</style>