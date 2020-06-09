/**
 *
 * Web Worker 是HTML5标准的一部分，这一规范定义了一套 API，它允许一段JavaScript程序运行在主线程之外的另外一个线程中。值得注意的是， Web Worker 规范中定义了两类工作线程，分别是专用线程Dedicated Worker和共享线程 Shared Worker，其中，Dedicated Worker只能为一个页面所使用，而Shared Worker则可以被多个页面所共享
 */

//  直接把js文件地址传递进去就可以执行
const myWorker = new Worker("./13.bind.js");

var myTask = `
    var i = 0;
    function timedCount(){
        i = i+1;
        postMessage(i);
        console.log(i)
        setTimeout(timedCount, 1000);
    }
    timedCount();
`;

var blob = new Blob([myTask]);
// var myWorker = new Worker(window.URL.createObjectURL(blob));

// 下面简单数据的传递，其实还有一种性能更高的方法来传递数据，就是通过可转让对象将数据在主页面和Worker之间进行来回穿梭。可转让对象从一个上下文转移到另一个上下文而不会经过任何拷贝操作。这意味着当传递大数据时会获得极大的性能提升。和按照引用传递不同，一旦对象转让，那么它在原来上下文的那个版本将不复存在。该对象的所有权被转让到新的上下文内。例如，当你将一个 ArrayBuffer 对象从主应用转让到 Worker 中，原始的 ArrayBuffer 被清除并且无法使用。它包含的内容会(完整无差的)传递给 Worker 上下文。
myWorker.onmessage = e => {
  // 数据挂载在e.data上
  console.log(e);
};

/**
 * 注意：传入 Worker 构造函数的参数 URI 必须遵循同源策略。Worker线程的创建的是异步的，主线程代码不会阻塞在这里等待worker线程去加载、执行指定的脚本文件，而是会立即向下继续执行后面代码。

 */

/**
 * Worker 作用域下的常用属性
 * 1. importScripts("./11.obsever.js");
 * 2. self 这个线程本身的引用
 * 3. location 返回当线程被创建的时候与之关联的 WorkerLocation 对象，用于表示这个工作线程脚本资源的绝对URL,不管重定向多少次，url资源位置不会改变
 * 4. close 关闭当前线程
 * 5. xmlhttprequest  发送请求
 * 6. setTimeout/setInterval以及addEventListener/postMessage
 *
 * myWorker.terminate();主页面调用可以直接杀死woker线程，不管工作是否完成
 * Worker 线程调用  self.close();
 */

//  错误处理
myWorker.onerror = function onError(e) {
  console.log(
    ["ERROR: Line ", e.lineno, " in ", e.filename, ": ", e.message].join("")
  );
};

// 使用场景：
// 对于图像、视频、音频的解析处理；
// canvas 中的图像计算处理；
// 大量的 ajax 请求或者网络服务轮询；
// 大量数据的计算处理（排序、检索、过滤、分析...）；
