<template>
  <div class="bg-menu">
    <!-- 设置背景颜色 -->
    <ul class="bg-menu__list">
      <li
        :class="bgItemClass(item)"
        v-for="item in bgList"
        :key="item"
        @click="() => changeBgColor(item)"
      ></li>
      <!-- 白天、夜间模式按钮，优先级高于背景色 -->
      <li :class="modeClass" @click="changeMode">
        <span class="bg-menu__list--mode-text">{{ modeText }}</span>
        <i :class="modeIconClass"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgList: [1, 2, 3, 4],
    };
  },

  computed: {
    modeClass() {
      const isDayMode = this.$store.state.currentInfo.isDayMode;

      return `bg-menu__list--mode ${
        !isDayMode ? "bg-menu__list--mode_night" : ""
      }`;
    },

    modeIconClass() {
      const isDayMode = this.$store.state.currentInfo.isDayMode;

      return `bg-menu__list--mode-icon bg-menu__list--mode-${
        isDayMode ? "day" : "night"
      }`;
    },

    modeText() {
      const isDayMode = this.$store.state.currentInfo.isDayMode;

      return `${isDayMode ? "日间" : "夜间"}`;
    },

    bgItemClass() {
      const { bgColorNum } = this.$store.state.currentInfo;

      return function (item) {
        return `bg-menu__list--bg bg-menu__list--bg-border-${item}${
          bgColorNum === item ? "_active" : ""
        } bg-color__${item}`;
      };
    },
  },

  methods: {
    changeBgColor(index) {
      this.$store.commit("updateCurrentInfo", {
        bgColorNum: index,
      });

      localStorage.setItem("bgColor", JSON.stringify(index));
    },

    // 切换夜间、白天模式
    changeMode() {
      const mode = this.$store.state.currentInfo.isDayMode;
      this.$store.commit("updateCurrentInfo", { isDayMode: !mode });

      localStorage.setItem("dayMode", JSON.stringify(!mode));
    },
  },
};
</script>

<style>
.bg-menu {
  padding: 43px 0;
}

.bg-menu__list {
  display: flex;
  justify-content: space-between;
}

.bg-menu__list--bg {
  box-sizing: content-box;
  width: 95px;
  height: 95px;
  border-radius: 50%;
}

/* 默认border颜色 */
.bg-menu__list--bg-border-1 {
  border: 5px solid #f1f2f6;
}

.bg-menu__list--bg-border-2 {
  border: 5px solid #cfdfce;
}

.bg-menu__list--bg-border-3 {
  border: 5px solid #cbdaf1;
}

.bg-menu__list--bg-border-4 {
  border: 5px solid #e9ddc0;
}

/* 激活状态下的border颜色 */
.bg-menu__list--bg-border-1_active {
  border: 5px solid #ffd014;
}

.bg-menu__list--bg-border-2_active {
  border: 5px solid #8fc481;
}

.bg-menu__list--bg-border-3_active {
  border: 5px solid #68a5d8;
}

.bg-menu__list--bg-border-4_active {
  border: 5px solid #a3875f;
}

/* 夜间、白天模式class */
.bg-menu__list--mode {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  padding-right: 20px;
  padding-left: 47px;
  opacity: 0.8;
  background: #36393d;
  border-radius: 50px;
  border-radius: 50px;
  border: 6px solid #36393d;
}

.bg-menu__list--mode_night {
  border: 6px solid rgba(255, 255, 255, 0.6);
}

.bg-menu__list--mode-text {
  display: inline-block;
  padding-right: 10px;
  opacity: 0.8;
  font-size: 36px;
  color: #ffffff;
}

.bg-menu__list--mode-icon {
  display: inline-block;
  height: 80px;
  width: 80px;
}

.bg-menu__list--mode-night {
  background: url("./img/night-mode.png") no-repeat center/100%;
}

.bg-menu__list--mode-day {
  background: url("./img/day-mode.png") no-repeat center/100%;
}
</style>