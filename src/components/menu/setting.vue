<template>
    <div :class="settingMenuClass">
        <div class="setting-menu__gap">
            <div class="setting-menu__gap-title">正文间距</div>
            <ul class="setting-menu__gap-list">
                <li
                    :class="gapItemClass(index + 1)"
                    v-for="(item, index) in lineHeight"
                    :key="item"
                    @click="changeLineHeight(index + 1)"
                >
                    <span>{{ item }}</span>
                </li>
            </ul>
        </div>
        <div class="setting-menu__slide-hand">
            <div class="setting-menu__slide-hand-text">
                点击屏幕左侧翻到下一页（左手模式）
            </div>
            <div :class="switchIconClass" @click="switchTrigger"></div>
        </div>
        <div class="setting-menu__turn-page-mode">
            <div class="setting-menu__slide-hand-text">
                切换上下滑动翻页模式
            </div>
            <div :class="turnPageSwitchClass" @click="changeTurnPageMde"></div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            lineHeight: ["大", "中", "小", "标准"],
        };
    },

    methods: {
        // 修改段落间的间距
        changeLineHeight(index) {
            const { lineHeight } = this.$store.state.currentInfo;

            if (lineHeight === index) {
                return;
            }

            const {
                containerInfo: { $page, pageWidth, containerWidth, currentPos },
                currentInfo: { pageNum, totalPageNum },
            } = this.$store.state;
            // 将lineHeight的值更新到本地和store
            localStorage.setItem("textLineHeight", JSON.stringify(index));
            this.$store.commit("updateCurrentInfo", { lineHeight: index });
            // 根据容器的最新宽度重新更新页数， TODO: 优化逻辑
            setTimeout(() => {
                // 容器新的宽度
                const containerWidthNew = $page.scrollWidth;
                // 更新lineHeight后该章节多出、少出的页数
                const pageCount =
                    (containerWidthNew - containerWidth) / pageWidth;
                const isUpdateContainerPos =
                    containerWidthNew < containerWidth &&
                    totalPageNum - pageNum + 1 <= Math.abs(pageCount);
                let newPos;
                // 更新容器的位置，只有在最后几页（少的那几页）的时候更新
                if (isUpdateContainerPos) {
                    newPos = -pageWidth * (pageNum + pageCount - 1);
                    $page.style.transitionDuration = "0s";
                    $page.style.transform = `translateX(${newPos}px)`;
                    // 更新当前页数
                    this.$store.commit("updateCurrentInfo", {
                        pageNum: pageNum + pageCount,
                    });
                }
                // 更新章节总页数
                this.$store.commit("updateCurrentInfo", {
                    totalPageNum: Math.round(containerWidthNew / pageWidth),
                });
                // 更新容器总宽度
                this.$store.commit("updateContainerInfo", {
                    containerWidth: containerWidthNew,
                    currentPos: isUpdateContainerPos ? newPos : currentPos,
                });
            }, 0);
        },

        // 点击左右手模式开关
        switchTrigger() {
            const { leftMode } = this.$store.state.currentInfo;
            const newStatus = !leftMode;

            // 更新到本地和store中
            localStorage.setItem("leftMode", JSON.stringify(newStatus));
            this.$store.commit("updateCurrentInfo", { leftMode: newStatus });
        },

        changeTurnPageMde() {
            const { scrollTurnPage } = this.$store.state.currentInfo;
            const newStatus = !scrollTurnPage;

            // 更新到本地和store中
            localStorage.setItem("scrollTurnPage", JSON.stringify(newStatus));
            this.$store.commit("updateCurrentInfo", {
                scrollTurnPage: newStatus,
            });
        },
    },

    computed: {
        // 设置菜单wrapper的class
        settingMenuClass() {
            const { isDayMode } = this.$store.state.currentInfo;

            return `setting-menu ${!isDayMode ? "setting-menu_night" : ""}`;
        },

        gapItemClass() {
            const {
                lineHeight,
                bgColorNum,
                isDayMode,
            } = this.$store.state.currentInfo;
            const gapBtnBgColorClass = `setting-menu__gap-listItem_active_${bgColorNum}`;

            return function (index) {
                return `setting-menu__gap-listItem ${
                    !isDayMode ? "setting-menu__gap-listItem_night" : ""
                } ${index === lineHeight ? gapBtnBgColorClass : ""}`;
            };
        },

        // 左手模式开关的class
        switchIconClass() {
            const {
                bgColorNum,
                leftMode,
                isDayMode,
            } = this.$store.state.currentInfo;
            const switchClass = `switch__icon_${bgColorNum}`;

            return `setting-menu__slide-hand-switch ${
                !isDayMode ? "setting-menu__slide-hand-switch_night" : ""
            } ${leftMode ? switchClass : ""}`;
        },

        // 翻页模式开关的class
        turnPageSwitchClass() {
            const {
                bgColorNum,
                scrollTurnPage,
                isDayMode,
            } = this.$store.state.currentInfo;
            const switchClass = `switch__icon_${bgColorNum}`;

            return `setting-menu__slide-hand-switch ${
                !isDayMode ? "setting-menu__slide-hand-switch_night" : ""
            } ${scrollTurnPage ? switchClass : ""}`;
        },
    },
};
</script>

<style>
.setting-menu {
    padding: 43px 0;
    color: #000000;
}

/* 设置菜单黑夜模式 */
.setting-menu_night {
    color: rgba(255,255,255,.7);
}

/* 设置文本间距 */
.setting-menu__gap-title {
    margin-bottom: 43px;
    opacity: 0.8;
    font-size: 46px;
    line-height: 46px;
}

.setting-menu__gap-list {
    display: flex;
    justify-content: space-between;
}

.setting-menu__gap-listItem {
    padding: 21px 78px;
    opacity: 0.6;
    font-size: 46px;
    background-color: rgba(0, 0, 0, 0.04);
    border-radius: 54px;
}

.setting-menu__gap-listItem_night {
    background-color: rgba(255, 255, 255, 0.1);
}

.setting-menu__gap-listItem_active_1 {
    background-color: rgba(255, 208, 20, 0.7);
}

.setting-menu__gap-listItem_active_2 {
    background-color: #b7e1bf;
}

.setting-menu__gap-listItem_active_3 {
    background-color: #c1d4f2;
}

.setting-menu__gap-listItem_active_4 {
    background-color: #ddc7a2;
}

/* 设置左右手模式 */
.setting-menu__slide-hand {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 102px;
}

.setting-menu__slide-hand-text {
    font-size: 46px;
    line-height: 46px;
    opacity: 0.8;
}

.setting-menu__slide-hand-switch {
    width: 102px;
    height: 63px;
    background: url("./img/switch_off.png") no-repeat center/100%;
}

.setting-menu__slide-hand-switch_night {
    background: url("./img/switch_off_night.png") no-repeat center/100%;
}

/* 翻页模式 */
.setting-menu__turn-page-mode {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 60px;
}

.switch__icon_1 {
    background: url("./img/switch_1.png") no-repeat center/100%;
}

.switch__icon_2 {
    background: url("./img/switch_2.png") no-repeat center/100%;
}

.switch__icon_3 {
    background: url("./img/switch_3.png") no-repeat center/100%;
}

.switch__icon_4 {
    background: url("./img/switch_4.png") no-repeat center/100%;
}
</style>