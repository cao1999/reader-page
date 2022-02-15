# 开发toast组件

## 功能
+  实现toast的显示和隐藏，以及动画效果
+ 可以调整toast的位置（优先级不高，可先不做）
+ 设置显示时长
+ 支持传入icon
+ 支持传入class（给最外层盒子）
+ 全局只能有一个toast，如果已经有toast显示，立即将他remove掉，然后添加新的toast
    + 在执行Toast方法时首先判断当前页面是否存在toast，如果存在则立刻remove掉，没有继续执行接下来的方法

## 学到的知识
+ 使用Vue.extend方法创建一个组件的实例，这个实例就是组件里的this
+ 可以通过直接给实例上添加属性的方式给组件传递data和props
+ 通过instance.$mount()方法获取到组件的实例，实例下的$el就是组件的真实节点
+ 可以给实例上添加方法，就跟写类一样
+ Vue.nextTick方法深入了解
+ createVNode、render等方法    