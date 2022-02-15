<template>
    <!-- 滑轨 -->
    <div :class="sliderClass" ref="slider">
        <div class="chapter-menu__slider-rail">
            <!-- 开始滑块 -->
            <div
                :class="startBlockClass"
                @touchstart="touchstart"
                @touchmove="touchmove"
                @touchend="touchend"
                ref="startBlock"
            ></div>
            <!-- 记录滑块初始的位置 -->
            <!-- <div class="chapter-menu__slider-block-memory"></div> -->
        </div>
    </div>
</template>

<script>
import { round } from "mathjs";

export default {
    data() {
        return {
            startPos: 0,
            endPos: 0,
            currentPos: 0,
            moveDistance: 0,
            sliderWidth: 0,
            blockWidth: 0,
            railwayWidth: 0,
            percentage: 0,
            // 到达右边界
            achieveRight: false,
            // 到达左边界
            achieveLeft: true,
        };
    },

    props: {
        // 滑动结束后要执行函数
        onEnd: {
            type: Function,
            default: () => () => {},
        },

        onMove: {
            type: Function,
            default: () => () => {},
        },

        onStart: {
            type: Function,
            default: () => () => {},
        },

        // 控制滑块的位置，值需要在0和1之间，包括边界
        blockPos: {
            type: Number,
            default: 0,
            validator(value) {
                if (value >= 0 && value <= 1) {
                    return true;
                } else {
                    return console.error(
                        "The value of blockPos should between 0 and 1"
                    );
                }
            },
        },
    },

    mounted() {
        const $startBlock = this.$refs.startBlock;
        const $slider = this.$refs.slider;
        const sliderWidth = $slider.clientWidth;
        const blockWidth = $startBlock.clientWidth;
        // 真实滑轨的长度
        const railwayWidth = sliderWidth - blockWidth;
        this.sliderWidth = sliderWidth;
        this.blockWidth = blockWidth;
        this.railwayWidth = railwayWidth;
        // 更新滑块的初始位置
        this.moveByProps(this.blockPos * railwayWidth);
    },

    methods: {
        touchstart(e) {
            // 记录起点位置
            this.startPos = e.touches[0].clientX;
            this.onStart(this.percentage);
        },

        touchmove(e) {
            this.endPos = e.touches[0].clientX;
            this.moveDistance = this.endPos - this.startPos;
            const targetPos = this.currentPos + this.moveDistance;
            // 从当前位置开始滑动
            this.move(targetPos);
        },

        touchend() {
            // 更新当前位置
            this.currentPos = this.currentPos + this.moveDistance;
            this.onEnd(this.percentage);
        },

        // 通过props数据来控制滑动，而非触摸滑动
        moveByProps(pos) {
            this.move(pos, false);
            // 更新滑块的当前位置
            this.currentPos = pos;
        },

        /**
         * 实现滑动
         * @param {Number} pos 要滑动到的坐标
         * @param {Boolean} isMoving 是否通过滑动调用
         */
        move(pos, isMoving = true) {
            // 右边界
            const rightBorder = this.sliderWidth - this.blockWidth;
            // 边界判断
            if (pos < 0) {
                if (!this.achieveLeft) {
                    this.achieveLeft = true;
                    pos = 0;
                } else {
                    return;
                }
            } else if (pos > rightBorder) {
                if (!this.achieveRight) {
                    this.achieveRight = true;
                    pos = rightBorder;
                } else {
                    return;
                }
            } else {
                this.achieveRight = false;
                this.achieveLeft = false;
            }

            // 计算当前进度，百分比，使用round函数提高数值的精确度
            this.percentage = round(pos / rightBorder, 4);
            // 执行onMove回调
            isMoving && this.onMove(this.percentage);
            this.$refs.startBlock.style.transform = `translateX(${pos}px)`;
        },
    },

    computed: {
        sliderClass() {
            const { isDayMode } = this.$store.state.currentInfo;
            return `chapter-menu__slider ${
                !isDayMode ? "chapter-menu__slider_night" : ""
            }`;
        },

        startBlockClass() {
            const { isDayMode } = this.$store.state.currentInfo;
            return `chapter-menu__slider-block-start ${
                !isDayMode ? "chapter-menu__slider-block-start_night" : ""
            }`;
        },
    },

    watch: {
        blockPos(newPos) {
            const $block = this.$refs.startBlock;
            if ($block) {
                this.moveByProps(newPos * this.railwayWidth);
            }
        },
    },
};
</script>

<style>
.chapter-menu__slider {
    position: relative;
    flex: 1;
    height: 100px;
    margin: 0 49px;
    opacity: 0.04;
    background: #000000;
    border-radius: 50px;
}

.chapter-menu__slider_night {
    opacity: 0.1;
    background: #ffffff;
}

.chapter-menu__slider-block-start,
.chapter-menu__slider-block-memory {
    position: absolute;
    width: 100px;
    height: 100px;
    border-radius: 50%;
}

.chapter-menu__slider-block-start {
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 0 60px 0 rgba(50, 50, 50, 1);
}

.chapter-menu__slider-block-start_night {
    background: #88888a;
}

.chapter-menu__slider-block-memory {
    opacity: 0.3;
    background: #000000;
}
</style>