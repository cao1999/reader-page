# 开发loading组件

## 功能
+   目前只有一种样式的loading
+  调用Loading()显示loading，返回一个loading实例，实例上有关闭loading的close方法
+ 全局只能存在一个loading Node，如果存在直接return实例，不存在在去append

## 使用方法
+ 导出的Loading对象具有show和close方法
+ 执行show方法后会返回一个loading的实例，实例上也具有show和close方法
+ 可以使用show和close方法在全局控制loading的显示和隐藏