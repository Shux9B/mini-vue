# mini-vue

#### 介绍
参考一下视频自己实现的vue
1. https://www.bilibili.com/video/BV1d4411v7UX?p=8&spm_id_from=pageDriver
2. 


#### 包括内容
1. Watcher          √
2. Observer         √
3. Dep              √
4. Virtual DOM转换  √
5. Dom diff         √
6. event            √
6. lifeCycle        √
    - beforeCreate  √
    - created       √
    - beforeDestory √
    - destoryed     √
7. children         √
8. Mixins           √
9. Plugin           √

### 待解决问题
1. 目前diff直接比较的真实DOM，应该比对虚拟DOM   
#### 实现疑问
1. 如果全部通过一个data实现，是不是任何子属性改变其他的都要重新收集依赖？这块在源码中有什么优化么？
