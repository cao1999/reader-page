import Toast from '@/components/common/toast';


/**
 * 封装关于章节操作的方法
 */


/**
 * 去下一章
 * @param {*} context 上下文
 * @returns 
 */
export function goNextChapter(context) {
    const { chapterId, endChapterId, novelId } = context.$store.state.chapterInfo;

    if (chapterId === endChapterId) {
        return lastChapterToast()
    }

    context.$store.dispatch('getChapterInfo', {
        novelId,
        chapterId: chapterId + 1
    })
}


/**
 * 去上一章
 * @param {*} context 上下文
 * @param {Boolean} backEndPage 是否回到章节的最后一页
 * @returns 
 */
export function goPreviousChapter(context, backEndPage = true) {
    const { chapterId, startChapterId, novelId } = context.$store.state.chapterInfo;

    if (chapterId === startChapterId) {
        return firstChapterToast()
    }

    context.$store.dispatch('getChapterInfo', {
        novelId,
        chapterId: chapterId - 1,
        backEndPage
    })
}

/**
* 更新滑块的位置
*/
export function updateSlideBlockPos(params) {
    const { commit, chapterId, startChapterId, endChapterId } = params;
    commit('updateChapterSliderInfo', {
        progress: (chapterId - startChapterId) / (endChapterId - startChapterId + 1)
    })
}


/**
 * 将章节数据存到缓存中
 * @param {*} chapterId 要存储章节的id
 * @param {*} data 
 */
export function saveCacheData(params) {
    const { commit, chapterId, data } = params;

    const payload = {};
    payload[chapterId] = data;
    commit('updateCacheChapterInfo', payload);
}


/**
 * 将当前小说的章节数据存储到本地存储
 * @param {Object} params 
 */
export function storeChapterInfo(params) {
    const { novelId, chapterId, pageNum } = params;

    // 将章节信息存储到本地，以小说id为key存储
    const novelHistory = JSON.parse(localStorage.getItem('novelHistory') || '{}');
    novelHistory[novelId] = {
        chapterId,
        pageNum
    };
    localStorage.setItem('novelHistory', JSON.stringify(novelHistory));
}


/**
 * 滑动到最后一章的最后一页提示
 */
export function lastChapterToast() {
    return Toast('当前是最后一章')
}


/**
 * 滑动到第一章第一页提示
 */
export function firstChapterToast() {
    return Toast('当前是第一章')
}