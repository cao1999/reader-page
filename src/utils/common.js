import router from '../routes/index';

/**
 * 防抖函数
 * @param {*} fn 
 * @param {*} timeout 
 */
export function debounce(fn, timeout) {
    let timer;

    return function () {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.call(this, arguments);
        }, timeout);
    }
}


/**
 * 节流函数
 * @param {function} fn 
 * @param {number} timeout 
 */
export function throttle(fn, timeout) {
    let execute = true;

    return function () {
        if (execute) {
            fn.apply(this, arguments);
            execute = false;

            setTimeout(() => {
                execute = true
            }, timeout);
        }
    }
}


/**
 * 判断对象是不是空对象
 * @param {*} obj 
 * @returns 
 */
export function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}'
}


export function assign(...obj) {
    return Object.assign({}, ...obj)
}


export function shouldUpdateURL(params) {
    const { replacePath, novelId, chapterId } = params;

    if (replacePath) {
        router.replace({
            name: 'readPage',
            params: {
                novelId,
                urlChapterId: chapterId
            }
        })
    }
}


/**
 * 当距离页面底部指定距离时执行callback
 * @param {*} $container 容器盒子
 * @param {*} distance 距离
 * @param {*} callback 回调
 */
export function farFromBottom($container, distance, callback) {
    const scrollHeight = $container.scrollHeight;
    const scrollTop = $container.scrollTop;
    const viewportHeight = $container.clientHeight;
}


/**
 * 判断数字是不是整数
 * @param {*} num 
 */
export function isInteger(num) {
    // 给数字本身取整，结果如果和本身相等，就是整数
    return typeof num === 'number' && Math.floor(num) === num
}