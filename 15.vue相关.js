/**
 * 虚拟dom
 * keep-alive
 * nextTick
 */

/**
 * nextTick实现
 */
// 1. 首先判断Promise是否存在，如果存在 做下面操作，也就是执行了一下，如果不存在做第2步操作
// const p = Promise.resolve()
// timerFunc = () => {
//     p.then(flushCallbacks)
//     if (isIOS) setTimeout(noop)
// }
//
// 2. 判断 MutationObserver 是否存在，存在执行observe
// let counter = 1;
// const observer = new MutationObserver(flushCallbacks => {
//   console.log("执行了");
// });
// const textNode = document.createTextNode(String(counter));
// observer.observe(textNode, {
//   characterData: true
// });
// (() => {
// 当textNode.data发生变化会触发MutationObserver执行
//   counter = (counter + 1) % 2;
//   textNode.data = String(counter);
// })();
// 3. 判断 setImmediate 是否存在，存在则丢进去执行一下
// 4. 最后上面都不支持，放到setTimeout执行一次

/**
 * 虚拟dom:
 *  其实 VNode 是对真实 DOM 的一种抽象描述，它的核心定义无非就几个关键属性，标签名、数据、子节点、键值等，Virtual DOM 除了它的数据结构的定义，映射到真实的 DOM 实际上要经历 VNode 的 create、diff、patch 等过程
 * 
 * 用JS对象模拟DOM（虚拟DOM）
把此虚拟DOM转成真实DOM并插入页面中（render）
如果有事件发生修改了虚拟DOM，比较两棵虚拟DOM树的差异，得到差异对象（diff）
把差异对象应用到真正的DOM树上（patch）
 */
