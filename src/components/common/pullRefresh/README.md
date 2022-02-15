# 开发下拉刷新组件

## 实现
+ 将目标div放到组件当中，组件的高度由内容撑开
+ 监听touch事件，在touch事件内判断当前是不是在页面顶部scrollTop === 0
+ 通过touch事件给组件动态设置translateY来实现下拉效果
+ 下拉距离小于某个值，将不执行回调，复位
+ 执行完onRefresh回调后，组件复位
+ 当滑动距离大于最大距离，在这个范围内滑动，组件也需要相应的滑动

## Props
+ onRefresh回调函数，表示下拉刷新时要执行的函数
+ onBottom回调函数，表示距离组件底部指定距离后执行
+ bottomDistance，距离底部多少距离执行onBottom函数
+ boxStyle，给组件容器的样式
+ flagId，组件的id，因为该组件可能会用在很多地方，用来区分
+ canFreshing,表示是否正在刷新，只用组件之前应该先将该属性设置为true，否则无效果，函数执行完之后，再将其设置为false，才会复位
+ maxDistance，下滑最大的距离，默认100px
+ showLoadingDistance，滑动多少距离显示loading icon，当icon显示在屏幕后，松开手就会执行onRefresh回调，如果，loading icon没有出现，则不执行回调
+ 需要给组件设置高度来实现滚动，默认是100%

## 学到的知识
+ 使用touch事件和translate属性实现下拉刷新功能
+ 使用dom的scrollTo方法让容器滚动到指定位置
+ 在vue中不要直接修改props的值，应该将props的值赋给data中的属性，在修改data中属性的值
+ TODO: 学习async await的使用
+ animation动画的使用