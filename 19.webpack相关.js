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

//具体可看这个： https://juejin.im/post/5bc1a73df265da0a8d36b74f  很有深度

/**
 * plugin
 *
 * webpack 在编译过代码程中，会触发一系列 Tapable 钩子事件，插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，这样，当 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了。
 */

/**
 * webpack 打包的大致过程
  * 将命令行参数与 webpack 配置文件 合并、解析得到参数对象。
参数对象传给 webpack 执行得到 Compiler 对象。
执行 Compiler 的 run方法开始编译。每次执行 run 编译都会生成一个 Compilation 对象。
触发 Compiler 的 make方法分析入口文件，调用 compilation 的 buildModule 方法创建主模块对象。
生成入口文件 AST(抽象语法树)，通过 AST 分析和递归加载依赖模块。
所有模块分析完成后，执行 compilation 的 seal 方法对每个 chunk 进行整理、优化、封装。
最后执行 Compiler 的 emitAssets 方法把生成的文件输出到 output 的目录中。
  */

// 下面是一个webpack 插件demo，生成文件清单
class FileListPlugin {
  constructor(options) {
    // 获取插件配置项
    this.filename =
      options && options.filename ? options.filename : "FILELIST.md";
  }

  apply(compiler) {
    // 注册 compiler 上的 emit 钩子
    compiler.hooks.emit.tapAsync("FileListPlugin", (compilation, cb) => {
      // 通过 compilation.assets 获取文件数量
      let len = Object.keys(compilation.assets).length;

      // 添加统计信息
      let content = `# ${len} file${len > 1 ? "s" : ""} emitted by webpack\n\n`;

      // 通过 compilation.assets 获取文件名列表
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`;
      }

      // 往 compilation.assets 中添加清单文件
      compilation.assets[this.filename] = {
        // 写入新文件的内容
        source: function() {
          return content;
        },
        // 新文件大小（给 webapck 输出展示用）
        size: function() {
          return content.length;
        }
      };

      // 执行回调，让 webpack 继续执行
      cb();
    });
  }
}

module.exports = FileListPlugin;

// 热更新原理  https://mp.weixin.qq.com/s/2L9Y0pdwTTmd8U2kXHFlPA 这个不错
