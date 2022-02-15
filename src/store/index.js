import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/utils/request'
import { isEmptyObject, assign, shouldUpdateURL, isInteger } from '@/utils/common'
import Loading from '@/components/common/loading';
import Toast from '@/components/common/toast';
import { storeChapterInfo, updateSlideBlockPos, saveCacheData } from '@/utils/chapter';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 目录弹窗的状态
        showContents: false,
        // 工具栏的状态
        showToolbar: false,
        // 缓存的章节（已经发起过请求的书，之后跳转就无须发起请求，以章节id为属性名）
        cacheChapter: {},
        // 章节信息
        chapterInfo: {
            novelId: 0,
            chapterId: 0,
            contentList: [],
            chapterTitle: '',
            novelTitle: '',
            startChapterId: 0,
            endChapterId: 0
        },
        // 小说信息
        novelInfo: {
            // 小说标题
            novelTitle: '',
            // 章节列表
            chapterList: [],
        },
        // 当前页面状态信息
        currentInfo: {
            // 页号
            pageNum: 1,
            // 背景色号
            bgColorNum: JSON.parse(localStorage.getItem('bgColor') || '1'),
            // 是否是日间模式
            isDayMode: JSON.parse(localStorage.getItem('dayMode') || 'true'),
            // 字体大小
            fontSize: '',
            // 文本间距 1:大 2：中 3：小 4：标准
            lineHeight: JSON.parse(localStorage.getItem('textLineHeight') || '4'),
            // 左手模式
            leftMode: JSON.parse(localStorage.getItem('leftMode') || 'false'),
            // 上下翻页模式
            scrollTurnPage: JSON.parse(localStorage.getItem('scrollTurnPage') || 'false'),
            // 工具栏菜单的状态
            showMenu: false,
            // 当前激活的菜单
            activeMenu: '',
            // 当前章节总页数
            totalPageNum: 0
        },
        // 切换章节slider信息
        chapterSliderInfo: {
            // 当前进度
            progress: 0,
            // 显示进度窗口
            showProgressWindow: false
        },
        // 翻页容器的信息
        containerInfo: {
            // 容器当前的位置translateX
            currentPos: 0,
            // 一页的宽度
            pageWidth: 0,
            // 文本容器的总宽度
            containerWidth: 0,
            // 文本容器dom元素
            $page: null,
            // 翻页模式，1表示横向翻页，0表示竖向翻页
            turnPageMode: 1,
            // 是否可以滑动
            canSlide: true
        },
        // 上下翻页容器的信息
        verticalContainerInfo: {
            // 上下翻页组件的页面
            $page: null,
            // 章节列表的容器
            $chapterContainer: null,
            // 章节列表
            chapterList: [],
            // 是否允许下滑加载数据
            shouldScrollLoad: true
        }
    },
    mutations: {
        updateContentsStatus(state) {
            state.showContents = !state.showContents;
        },

        updateToolBarStatus(state) {
            state.showToolbar = !state.showToolbar;
        },

        // 更新容器相关的信息
        updateContainerInfo(state, payload) {
            state.containerInfo = assign(state.containerInfo, payload)
        },

        // 更新当前页面的信息
        updateCurrentInfo(state, payload) {
            state.currentInfo = assign(state.currentInfo, payload)
        },

        // 更新章节slider新的
        updateChapterSliderInfo(state, payload) {
            state.chapterSliderInfo = assign(state.chapterSliderInfo, payload)
        },

        // 更新章节相关信息
        updateChapterInfo(state, payload) {
            state.chapterInfo = assign(state.chapterInfo, payload)
        },

        // 更新小说相关信息
        updateNovelInfo(state, payload) {
            state.novelInfo = assign(state.novelInfo, payload)
        },

        // 更新缓存章节信息
        updateCacheChapterInfo(state, payload) {
            state.cacheChapter = assign(state.cacheChapter, payload)
        },

        // 更新上下翻页容器信息
        updateVerticalContainerInfo(state, payload) {
            state.verticalContainerInfo = assign(state.verticalContainerInfo, payload)
        }
    },
    actions: {
        // 获取章节信息
        getChapterInfo({ dispatch, state }, params) {
            const { scrollTurnPage } = state.currentInfo;
            const { startChapterId, endChapterId } = state.chapterInfo;
            const { chapterId } = params;

            // 判断边界，兜底
            if (startChapterId && chapterId < startChapterId) {
                return Toast('已经是第一章')
            }

            if (endChapterId && chapterId > endChapterId) {
                return Toast('当前是最后一章')
            }

            // 判断翻页方式
            if (scrollTurnPage) {
                dispatch('getVerticalChapterInfo', params)
            } else {
                dispatch('getHorizontalChapterInfo', params)
            }
        },

        // 上下翻页容器获取章节数据
        getVerticalChapterInfo({ state, commit, dispatch }, params) {
            /**
             * scrollLoad表示是否是通过滚动的形式加载数据，因为还可以点击目录加载数据
             */
            const { novelId, chapterId, replacePath = true, showLoading = true, scrollLoad = false, pullLoad = false, callback } = params;
            let { chapterList, $page, $chapterContainer } = state.verticalContainerInfo;

            showLoading && Loading.show();

            new Promise((resolve) => {
                // 判断该章节是否被缓存
                const cacheChapter = state.cacheChapter[chapterId];
                if (cacheChapter) {
                    commit('updateChapterInfo', cacheChapter);
                    if (scrollLoad) {
                        chapterList.push(cacheChapter);
                    } else if (pullLoad) {
                        chapterList.unshift(cacheChapter);
                    } else {
                        chapterList = [cacheChapter]
                    }
                    // 使用缓存数据
                    commit('updateVerticalContainerInfo', { chapterList });
                    console.log('使用缓存章节数据vertical');
                    resolve();
                } else {
                    // 请求接口获取
                    http.get('/chapterInfo', {
                        params: {
                            novelId,
                            chapterId
                        }
                    }).then((res) => {
                        if (!isEmptyObject(res.data)) {
                            commit('updateChapterInfo', res.data);
                            if (scrollLoad) {
                                chapterList.push(res.data);
                            } else if (pullLoad) {
                                chapterList.unshift(res.data);
                            } else {
                                chapterList = [res.data]
                            }
                            commit('updateVerticalContainerInfo', { chapterList });
                            // 将章节存到缓存数据中
                            saveCacheData({ commit, chapterId, data: res.data });
                            console.log('使用请求章节数据vertical');
                            resolve();
                        } else {
                            // TODO: 提示数据不存在
                        }
                    }).catch(err => {
                        console.log(err, 'Happened in the function of request verticalChapterInfo...')
                    })
                }
            }).then(() => {
                let { startChapterId, endChapterId } = state.chapterInfo;

                // 执行回调
                callback && callback();

                // 更新url参数
                shouldUpdateURL({
                    replacePath,
                    novelId,
                    chapterId
                });

                // 将章节信息存储到本地，以小说id为key存储
                storeChapterInfo({
                    novelId,
                    chapterId,
                    pageNum: 1
                })

                // 更新章节slider滑块的位置
                updateSlideBlockPos({
                    commit,
                    chapterId,
                    endChapterId,
                    startChapterId
                })

                // 更新容器的位置
                if (!scrollLoad && !pullLoad) {
                    $page.scrollTo(0, 0);
                } else if (pullLoad) {
                    // 获取第一个章节信息盒子的高度，然后让页面滚到到这个高度
                    const firstChapterBoxHeight = document.querySelector('.reader-page__viewport-vertical__chapter').clientHeight;
                    $page.scrollTo(0, firstChapterBoxHeight);
                }

                // 当页面内容没有占满屏幕时，自动在加载下一章内容
                if ($chapterContainer.clientHeight <= $page.clientHeight) {
                    dispatch('getChapterInfo', {
                        novelId,
                        chapterId: chapterId + 1,
                        scrollLoad: true,
                    });
                }

                Loading.close();
            }).catch((err) => {
                console.log(err, 'Happened in getVerticalChapterInfo Promise catch function...')
            })
        },

        // 水平翻页容器获取章节数据
        getHorizontalChapterInfo({ state, commit }, params) {
            // backEndPage表示加载完数据后是否回到章节最后一页, replacePath表示是否更新router的path
            const { novelId, chapterId, backEndPage = false, replacePath = true } = params;

            // 如果id没有变，return
            if (chapterId === state.chapterInfo.chapterId) {
                return
            }

            // 加载数据的时候禁止页面滑动翻页
            commit('updateContainerInfo', { canSlide: false });

            new Promise((resolve, reject) => {
                // 开启loading
                Loading.show();

                // 判断该章节是否被缓存
                const cacheChapter = state.cacheChapter[chapterId];
                if (cacheChapter) {
                    // 使用缓存数据
                    commit('updateChapterInfo', cacheChapter);
                    console.log('使用缓存章节数据');
                    resolve();
                } else {
                    // 请求接口获取
                    http.get('/chapterInfo', {
                        params: {
                            novelId,
                            chapterId
                        }
                    }).then((res) => {
                        if (!isEmptyObject(res.data)) {
                            commit('updateChapterInfo', res.data);
                            // 将章节存到缓存数据中
                            saveCacheData({ commit, chapterId, data: res.data });
                            console.log('使用请求章节数据');
                            // 如果翻页模式是上下翻页，不执行then里面的方法
                            resolve();
                        } else {
                            // TODO: 提示数据不存在
                            reject();
                        }
                    }).catch(err => {
                        console.log(err, 'Happened in the function of request chapterInfo...')
                    })
                }
            }).then(() => {
                // 更新url参数
                shouldUpdateURL({
                    replacePath,
                    novelId,
                    chapterId
                })

                // 更新容器和当前设置信息
                const { pageWidth, $page } = state.containerInfo;
                const { startChapterId, endChapterId } = state.chapterInfo;
                const containerWidth = $page.scrollWidth;
                const calculatePageNum = containerWidth / pageWidth;
                // 判断页数的计算结果是不是整数，如果不是，向下取整，兼容手机端
                const totalPageNum = isInteger(calculatePageNum) ? calculatePageNum : Math.floor(calculatePageNum);

                // 更新章节总页数和当前页数
                commit("updateCurrentInfo", {
                    totalPageNum,
                    pageNum: backEndPage ? totalPageNum : 1
                });

                // 更新章节slider滑块的位置
                updateSlideBlockPos({
                    commit,
                    chapterId,
                    endChapterId,
                    startChapterId
                })

                // 更新容器当前位置
                commit('updateContainerInfo', {
                    currentPos: backEndPage ? pageWidth - containerWidth : 0,
                    containerWidth,
                    // 数据加载结束后，允许滑动翻页
                    canSlide: true
                });

                // 容器复位
                $page.style.transitionDuration = '0s';
                $page.style.transform = `translateX(${backEndPage ? -containerWidth + pageWidth : 0}px)`;

                // 将章节信息存储到本地，以小说id为key存储
                storeChapterInfo({
                    novelId,
                    chapterId,
                    pageNum: backEndPage ? totalPageNum : 1
                })

                // 关闭loading
                Loading.close();
            }).catch(err => {
                console.log(err, 'Happened in getChapterInfo Promise catch function...')
            })
        },

        // 获取章节列表数据
        getChapterListInfo({ commit }, params) {
            http.get('/chapterList', {
                params
            }).then(res => {
                commit('updateNovelInfo', res.data)
            }).catch(err => {
                console.log(err, 'Happened in getChapterInfo function')
            })
        }
    },
    modules: {
    }
})

