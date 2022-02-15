<template>
  <div class="tool-bar" :style="`display: ${showToolBar ? 'block' : 'none'}`">
    <!-- 顶部工具栏 目前只作为展示，没有点击功能 -->
    <div :class="topBarClass">
      <!-- 返回按钮 -->
      <div :class="backIconClass"></div>
      <!-- 加入书架 -->
      <div class="tool-bar__top--shelf">
        <div :class="shelfIconClass"></div>
        <div :class="shelfTextClass">加入书架</div>
      </div>
    </div>
    <!-- 底部工具栏 -->
    <div :class="bottomBarClass">
      <!-- 每一个按钮所对应的菜单 -->
      <div class="tool-bar__bottom--menu" v-show="showMenu">
        <component :is="activeMenuComp"></component>
      </div>
      <!-- 按钮icon -->
      <div class="tool-bar__bootom--icons">
        <div
          v-for="(item, index) in iconList"
          :key="index"
          @click="item.handler"
          class="tool-bar__bootom--icons-item"
        >
          <img
            :src="iconSrc(item)"
            :alt="item.alt"
            class="tool-bar__bootom--icons-img"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BgColorMenu from "../menu/bgColor.vue";
import SettingMenu from "../menu/setting.vue";
import ChangeChapter from "../menu/changeChapter.vue";

export default {
  data() {
    return {
      // 控制工具栏的显示隐藏
      showToolBar: false,
      iconList: [
        {
          imgSrc: require("./img/day/contents-day.png"),
          activeImgSrc: require("./img/day/contents-day_active.png"),
          nightImgSrc: require("./img/night/contents.png"),
          nightActiveImgSrc: require("./img/night/contents.png"),
          handler: this.updateContentsStatus,
          name: "contents",
          alt: "目录icon",
        },
        {
          imgSrc: require("./img/day/chapter-day.png"),
          activeImgSrc: require("./img/day/chapter-day_active.png"),
          nightImgSrc: require("./img/night/chapter-night.png"),
          nightActiveImgSrc: require("./img/night/chapter-night_active.png"),
          handler: this.wakeupMenu.bind(null, ChangeChapter, "chapter"),
          name: "chapter",
          alt: "切换章节icon",
        },
        {
          imgSrc: require("./img/day/bright-day.png"),
          activeImgSrc: require("./img/day/bright-day_active.png"),
          nightImgSrc: require("./img/night/bright-night.png"),
          nightActiveImgSrc: require("./img/night/bright-night_active.png"),
          handler: this.wakeupMenu.bind(null, BgColorMenu, "bright"),
          name: "bright",
          alt: "背景色icon",
        },
        {
          imgSrc: require("./img/day/setting-day.png"),
          activeImgSrc: require("./img/day/setting-day_active.png"),
          nightImgSrc: require("./img/night/setting-night.png"),
          nightActiveImgSrc: require("./img/night/setting-night_active.png"),
          handler: this.wakeupMenu.bind(null, SettingMenu, "setting"),
          name: "setting",
          alt: "设置icon",
        },
      ],
      // 当前激活的菜单组件
      activeMenuComp: "",
    };
  },

  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    topBarClass() {
      const { bgColorNum, isDayMode } = this.$store.state.currentInfo;

      return `tool-bar__top toolbar-bg-color__${bgColorNum} ${
        this.show ? "tool-bar__top--show" : "tool-bar__top--hide"
      } ${!isDayMode ? "toolbar-bg-color__night" : ""}`;
    },
    bottomBarClass() {
      const { bgColorNum, isDayMode } = this.$store.state.currentInfo;

      return `tool-bar__bottom toolbar-bg-color__${bgColorNum} ${
        this.show ? "tool-bar__bottom--show" : "tool-bar__bottom--hide"
      } ${!isDayMode ? "toolbar-bg-color__night" : ""}`;
    },

    /* toolbar icon要区分夜间、日间模式和选中状态 */
    iconSrc() {
      const { activeMenu } = this.$store.state.currentInfo;
      const { isDayMode } = this.$store.state.currentInfo;

      return function (item) {
        return activeMenu === item.name
          ? isDayMode
            ? item.activeImgSrc
            : item.nightActiveImgSrc
          : isDayMode
          ? item.imgSrc
          : item.nightImgSrc;
      };
    },

    // 返回按钮class
    backIconClass() {
      const { isDayMode } = this.$store.state.currentInfo;

      return `tool-bar__top--back ${
        !isDayMode ? "tool-bar__top--back-night" : ""
      }`;
    },

    shelfIconClass() {
      const { isDayMode } = this.$store.state.currentInfo;

      return `tool-bar__top--shelf-icon ${
        !isDayMode ? "tool-bar__top--shelf-icon-night" : ""
      }`;
    },

    shelfTextClass() {
      const { isDayMode } = this.$store.state.currentInfo;

      return `tool-bar__top--shelf-text ${
        !isDayMode ? "tool-bar__top--shelf-text-night" : ""
      }`;
    },

    // 是否显示menu
    showMenu() {
      return this.$store.state.currentInfo.showMenu;
    },
  },

  methods: {
    // 更新目录popup状态
    updateContentsStatus() {
      this.$store.commit("updateContentsStatus");
    },

    // 唤起菜单
    wakeupMenu(component, type) {
      const { showMenu } = this.$store.state.currentInfo;
      let isShowMenu = false;

      // 判断菜单当前状态
      if (!showMenu) {
        this.activeMenuComp = component;
        isShowMenu = true;
      } else if (showMenu) {
        if (this.activeMenuComp === component) {
          this.activeMenuComp = "";
          isShowMenu = false;
        } else {
          this.activeMenuComp = component;
          isShowMenu = true;
        }
      }

      this.$store.commit("updateCurrentInfo", {
        showMenu: isShowMenu,
        activeMenu: isShowMenu ? type : "",
      });
    },
  },

  watch: {
    show(status) {
      if (status) {
        this.showToolBar = true;
      } else {
        setTimeout(() => {
          this.showToolBar = false;
        }, 300);
      }
    },
  },
};
</script>

<style>
.tool-bar__top {
  position: absolute;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 30px 75px;
  background-color: #fff;
  box-shadow: 0 2px 80px 0 rgba(0, 0, 0, 0.1);
}

.tool-bar__top--back {
  width: 31px;
  height: 54px;
  background: url("./img/day/back.png") no-repeat center/100%;
}

.tool-bar__top--back-night {
  background: url("./img/night/back-night.png") no-repeat center/100%;
}

.tool-bar__top--shelf {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tool-bar__top--shelf-icon {
  width: 98px;
  height: 98px;
  margin-bottom: 6px;
  background: url("./img/day/shelf.png") no-repeat center/100%;
}

.tool-bar__top--shelf-icon-night {
  background: url("./img/night/shelf-night.png") no-repeat center/100%;
}

.tool-bar__top--shelf-text {
  font-size: 30px;
  line-height: 39px;
  color: #000;
  opacity: 0.75;
}

.tool-bar__top--shelf-text-night {
  color: #ffffff;
  opacity: 0.5;
}

.tool-bar__bottom {
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: #fff;
}

.tool-bar__top--show {
  animation: showTopBar 0.3s forwards;
}

.tool-bar__top--hide {
  animation: hideTopBar 0.3s forwards;
}

.tool-bar__bottom--show {
  animation: showBottomBar 0.3s forwards;
}

/* animation-fill-mode设置为forwards表示保留最后一个状态 */
.tool-bar__bottom--hide {
  animation: hideBottomBar 0.3s forwards;
}

.tool-bar__bottom--menu {
  padding: 20px 75px;
}

.tool-bar__bootom--icons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 48px 75px;
}

.tool-bar__bootom--icons-item {
  width: 98px;
  height: 98px;
  font-size: 0;
}

.tool-bar__bootom--icons-img {
  width: 100%;
  height: 100%;
}

@keyframes showTopBar {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes hideTopBar {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-100%);
  }
}

@keyframes showBottomBar {
  0% {
    transform: translateY(100%);
  }

  100% {
    transform: translateY(0);
  }
}

@keyframes hideBottomBar {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(100%);
  }
}
</style>