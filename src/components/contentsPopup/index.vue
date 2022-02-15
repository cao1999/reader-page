<template>
    <Popup :show="show" :onClickMask="clickMask">
        <div :class="contentClass">
            <div class="contents__header">
                <h1 class="contents__header-title">{{ novelTitle }}</h1>
            </div>
            <div class="contents__main">
                <ul class="contents__main-list">
                    <li
                        class="contents__main-list--item"
                        v-for="(item, index) in chapterList"
                        :key="index"
                        @click="clickChapter(item.chapterId)"
                    >
                        <span>{{ item.chapterTitle }}</span>
                    </li>
                </ul>
            </div>
        </div>
    </Popup>
</template>

<script>
import Popup from "../common/popup/index";
// TODO: 优化目录样式

export default {
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },

    components: {
        Popup,
    },

    computed: {
        chapterList() {
            const { chapterList } = this.$store.state.novelInfo;

            return chapterList;
        },

        novelTitle() {
            const { novelTitle } = this.$store.state.novelInfo;

            return novelTitle;
        },

        /* 设置目录class */
        contentClass() {
            const { bgColorNum, isDayMode } = this.$store.state.currentInfo;

            return `contents toolbar-bg-color__${bgColorNum} ${
                !isDayMode ? "toolbar-bg-color__night" : ""
            }`;
        },
    },

    methods: {
        // 点击蒙层触发的函数
        clickMask() {
            this.$store.commit("updateContentsStatus");
        },

        // 点击章节
        clickChapter(chapterId) {
            const { novelId } = this.$store.state.chapterInfo;
            this.$store.commit("updateContentsStatus");

            this.$store.dispatch("getChapterInfo", {
                novelId,
                chapterId,
                scrollLoad: false
            });
        },
    },

    mounted() {
        this.$store.dispatch("getChapterListInfo", {
            novelId: 1,
        });
    },
};
</script>

<style>
.contents {
    width: 100%;
    background-color: #fff;
    border-radius: 30px 30px 0 0;
}

.contents__header {
    padding: 40px 0;
    /* border-bottom: 1px solid #ccc; */
}

.contents__header-title {
    text-align: center;
    font-size: 50px;
    color: #656565;
}

.contents__main {
    overflow: scroll;
    height: 60vh;
    padding: 40px;
}

.contents__main-list--item {
    margin-bottom: 60px;
    color: #656565;
}

.contents__main-list--item:last-child {
    margin-bottom: 0;
}
</style>