/**
 * webpack loader 和 plugin
 */

/**
 * loader: 其实就是一个函数接收一个参数，是上一个loader处理的结果，
 * 我们知道默认 loader 的执行是从右向左的，并且会将上一个 loader 处理的结果传递给下一个 loader，如果按照这种默认行为，css-loader 会返回一个 js 字符串给 style-loader。
 *
 *
 *
 */
// module.exports = function(source) {
//   // 处理 source ...
//   return handledSource;
// };

// module.exports = function(source) {
//   // 处理 source ...
//   this.callback(null, handledSource);
//   return handledSource;
// };

// 注意：如果是处理顺序排在最后一个的 loader，那么它的返回值将最终交给 webpack 的 require，换句话说，它一定是一段可执行的 JS 脚本 （用字符串来存储），更准确来说，是一个 node 模块的 JS 脚本，我们来看下面的例子。

// 一般都使用this.async()返回的callback来通知异步完成，但实际上，执行this.callback()也是一样的效果：
// context.async = function async() {
// if (isDone) {
//     if (reportedError) return; // ignore
//     throw new Error("async(): The callback was already called.");
// }
// isSync = false;
// return innerCallback;
// };
// var innerCallback = context.callback = function () {
//     // ……
// }

// 同时，在runSyncOrAsync()中，只有isSync标识为true时，才会在loader function执行完毕后立即（同步）回调callback来继续loader - runner。
// if (isSync) {
//     isDone = true;
//     if (result === undefined)
//         return callback();
//     if (result && typeof result === "object" && typeof result.then === "function") {
//         return result.catch(callback).then(function (r) {
//             callback(null, r);
//         });
//     }
//     return callback(null, result);
// }

// 看到这里你会发现，代码里有一处会判断返回值是否是Promise（typeof result.then === "function"），如果是Promise则会异步调用callback。因此，想要获得一个异步的loader，除了webpack文档里提到的this.async()方法，还可以直接返回一个Promise。

//具体可看这个： https://juejin.im/post/5bc1a73df265da0a8d36b74f
