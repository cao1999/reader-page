import { throttle } from "../../utils/common";

/**
 * 首次加载数据
 * @param {} context 组件的上下文
 * @param {} type 翻页类型
 */
export function firstLoadChapter(context) {
  // 从本地或者url上获取数据
  let { novelId, urlChapterId } = context.$route.params;
  const novelHistory = JSON.parse(
    localStorage.getItem("novelHistory") || "{}"
  );
  const novelInfo = novelHistory[novelId];
  let chapterId = urlChapterId;
  // 如果当前书在本地有阅读记录，就使用本地数据，不适用url数据
  if (novelInfo) {
    chapterId = novelInfo.chapterId;
  }

  // 第一次加载章节数据
  context.$store.dispatch('getChapterInfo', {
    novelId: Number(novelId),
    chapterId,
    replacePath: !(Number(urlChapterId) === Number(chapterId))
  });
}

export const showToolBar = throttle(function () {
  // 唤起、关闭工具栏
  this.$store.commit("updateToolBarStatus");
  // 关闭菜单
  setTimeout(() => {
    this.$store.commit("updateCurrentInfo", {
      showMenu: false,
      activeMenu: "",
    });
  }, 300);
}, 300);