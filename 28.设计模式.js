/**
 * 1. 指针与引用的区别
 *
 * 2. 变量的内存是如何释放：
 *   引用类型是在没有引用之后, 通过 v8 的 GC 自动回收, 值类型如果是处于闭包的情况下, 要等闭包没有引用才会被 GC 回收, 非闭包的情况下等待 v8 的      新生代 (new space) 切换的时候回收.
 *
 * 3. const 定义的 Array 中间元素能否被修改? 如果可以, 那 const 修饰对象有什么意义?
 * 其中的值可以被修改. 意义上, 主要保护引用不被修改 (如用 Map 等接口对引用的变化很敏感, 使用 const 保护引用始终如一是有意义的), 也适合用在 immutable 的场景.
 *
 * 4. 浏览器与node的事件循环有何区别
 *    一个进程的内存空间是共享的，每个线程都可用这些共享内存。
 *   以 Chrome 浏览器中为例，当你打开一个 Tab 页时，其实就是创建了一个进程，一个进程中可以有多个线程（下文会详细介绍），比如渲染线程、JS 引擎线程、HTTP 请求线程等等。当你发起一个请求时，其实就是创建了一个线程，当请求结束后，该线程可能就会被销毁。
 * 
 * 浏览器内核是多线程，在内核控制下各线程相互配合以保持同步，一个浏览器通常由以下常驻线程组成：

    GUI 渲染线程  (主要负责页面的渲染，解析html，css，构建DOM树，布局绘制等，重绘回流，会执行该线程，与js引擎线程互斥)

    JavaScript 引擎线程 (js脚本执行，也是主要负责待执行的事件，定时器，异步请求等，如果脚本执行时间过长会导致页面渲染的阻塞)

    定时触发器线程 (负责执行定时器一类的的 函数，主线程遇到定时器，会将定时器交给该线程，当计时完毕后会被加入到任务队列尾部，等待js引擎执行)

    事件触发线程 (主要负责将准备好的事件交给 JS 引擎线程执行,比如 setTimeout 定时器计数结束， ajax 等异步请求成功并触发回调函数，或者用户触发点击事件时，该线程会将整装待发的事件依次加入到任务队列的队尾，等待 JS 引擎线程的执行)

    异步 http 请求线程 (主要负责异步请求，Promise,axios,ajax)主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待 JS 引擎线程执行。

    5. Micro-Task(微任务) 与 Macro-Task(宏任务)
      常见的宏任务：setTimeout、setInterval、setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。
      常见的微任务：process.nextTick、new Promise().then(回调)、MutationObserver(html5 新特性) 等

      浏览器中的Event Loop
        一开始执行栈空,我们可以把执行栈认为是一个存储函数调用的栈结构，遵循先进后出的原则。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。
        全局上下文（script 标签）被推入执行栈，同步代码执行。在执行的过程中，会判断是同步任务还是异步任务，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，这个过程本质上是队列的 macro-task 的执行和出队的过程。
        上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：当 macro-task 出队时，任务是一个一个执行的；而 micro-task 出队时，任务是一队一队执行的。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。
        执行渲染操作，更新界面
        检查是否存在 Web worker 任务，如果有，则对其进行处理
        上述过程循环往复，直到两个队列都清空

      node中的Event Loop
      Node 中的 Event Loop 和浏览器中的是完全不相同的东西。Node.js 采用 V8 作为 js 的解析引擎，而 I/O 处理方面使用了自己设计的 libuv，libuv 是一个基于事件驱动的跨平台抽象层，封装了不同操作系统一些底层特性，对外提供统一的 API
      Node.js 的运行机制如下:
        V8 引擎解析 JavaScript 脚本。
        解析后的代码，调用 Node API。
        libuv 库负责 Node API 的执行。它将不同的任务分配给不同的线程，形成一个 Event Loop（事件循环），以异步的方式将任务的执行结果返回给 V8 引擎。
        V8 引擎再将结果返回给用户

      node 中的事件循环的顺序：
        外部输入数据–>轮询阶段(poll)–>检查阶段(check)–>关闭事件回调阶段(close callback)–>定时器检测阶段(timer)–>I/O 事件回调阶段(I/O callbacks)–>闲置阶段(idle, prepare)–>轮询阶段（按照该顺序反复运行）…
        timers 阶段：这个阶段执行 timer（setTimeout、setInterval）的回调
        I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
        idle, prepare 阶段：仅 node 内部使用
        poll 阶段：获取新的 I/O 事件, 适当的条件下 node 将阻塞在这里
        check 阶段：执行 setImmediate() 的回调
        close callbacks 阶段：执行 socket 的 close 事件回调

     process.nextTick 是独立于Event Loop之外的，有一个自己的对列，当每个阶段完成后，如果存在nextTick对列，就会清空对列中的所有回调函数，并且优先于微任务

     浏览器和 Node 环境下，microtask 任务队列的执行时机不同

        Node 端，microtask 在事件循环的各个阶段之间执行
        浏览器端，microtask 在事件循环的 macrotask 执行完之后执行

    

 */

Promise.resolve().then(() => {
  console.log("Promise1");
  setTimeout(() => {
    console.log("setTimeout2");
  }, 0);
});
setTimeout(() => {
  console.log("setTimeout1");
  Promise.resolve().then(() => {
    console.log("Promise2");
  });
}, 0);

// 最后输出结果是 Promise1，setTimeout1，Promise2，setTimeout2

// 一开始执行栈的同步任务（这属于宏任务）执行完毕，会去查看是否有微任务队列，上题中存在(有且只有一个) ，然后执行微任务队列中的所有任务输出 Promise1，同时会生成一个宏任务 setTimeout2
// 然后去查看宏任务队列，宏任务 setTimeout1 在 setTimeout2 之前，先执行宏任务 setTimeout1，输出 setTimeout1
// 在执行宏任务 setTimeout1 时会生成微任务 Promise2 ，放入微任务队列中，接着先去清空微任务队列中的所有任务，输出 Promise2
// 清空完微任务队列中的所有任务后，就又会去宏任务队列取一个，这回执行的是 setTimeout2

setTimeout(() => {
  console.log("timer1");
  Promise.resolve().then(function() {
    console.log("promise1");
  });
}, 0);
process.nextTick(() => {
  console.log("nextTick");
  process.nextTick(() => {
    console.log("nextTick");
    process.nextTick(() => {
      console.log("nextTick");
      process.nextTick(() => {
        console.log("nextTick");
      });
    });
  });
});
// nextTick=>nextTick=>nextTick=>nextTick=>timer1=>promise1

// https://zhuanlan.zhihu.com/p/54882306  深度好文

/**
 * node 基础：https://github.com/ElemeFE/node-interview/tree/master/sections/zh-cn  element基础面试题
 *  js基础
        1  js 中什么类型是引用传递, 什么类型是值传递? 如何将值类型的变量以引用的方式传递?
        2  js 中， 0.1 + 0.2 === 0.3 是否为 true ? 在不知道浮点数位数时应该怎样判断两个浮点数之和与第三数是否相等？
        3  const 定义的 Array 中间元素能否被修改? 如果可以, 那 const 修饰对象的意义是? 
        4  JavaScript 中不同类型以及不同环境下变量的内存都是何时释放?
    模块(module)
        5  a.js 和 b.js 两个文件互相 require 是否会死循环? 双方是否能导出变量? 如何从设计上避免这种问题? 
        6  如果 a.js require 了 b.js, 那么在 b 中定义全局变量 t = 111 能否在 a 中直接打印出来? 
        7  如何在不重启 node 进程的情况下热更新一个 js/json 文件? 这个问题本身是否有问题?
    事件/异步
        8  Promise 中 .then 的第二参数与 .catch 有什么区别? [more]
        9  Eventemitter 的 emit 是同步还是异步? [more]
        10 如何判断接口是否异步? 是否只要有回调函数就是异步? [more]
        11 nextTick, setTimeout 以及 setImmediate 三者有什么区别? [more]
        12 如何实现一个 sleep 函数? [more]
        13 如何实现一个异步的 reduce? (注:不是异步完了之后同步 reduce)
    进程
        进程的当前工作目录是什么? 有什么作用? [more]
        child_process.fork 与 POSIX 的 fork 有什么区别? [more]
        父进程或子进程的死亡是否会影响对方? 什么是孤儿进程? [more]
        cluster 是如何保证负载均衡的? [more]
        什么是守护进程? 如何实现守护进程?

    IO
        Buffer 一般用于处理什么数据? 其长度能否动态变化? [more]
        Stream 的 highWaterMark 与 drain 事件是什么? 二者之间的关系是? [more]
        Stream 的 pipe 的作用是? 在 pipe 的过程中数据是引用传递还是拷贝传递? [more]
        什么是文件描述符? 输入流/输出流/错误流是什么? [more]
        console.log 是同步还是异步? 如何实现一个 console.log? [more]
        如何同步的获取用户的输入? [more]
        Readline 是如何实现的? (有思路即可)

    Network
        cookie 与 session 的区别? 服务端如何清除 cookie? [more]
        HTTP 协议中的 POST 和 PUT 有什么区别? [more]
        什么是跨域请求? 如何允许跨域? [more]
        TCP/UDP 的区别? TCP 粘包是怎么回事，如何处理? UDP 有粘包吗? [more]
        TIME_WAIT 是什么情况? 出现过多的 TIME_WAIT 可能是什么原因? [more]
        ECONNRESET 是什么错误? 如何复现这个错误?
        socket hang up 是什么意思? 可能在什么情况下出现? [more]
        hosts 文件是什么? 什么叫 DNS 本地解析?
        列举几个提高网络传输速度的办法?

    OS
        什么是 TTY? 如何判断是否处于 TTY 环境? [more]
        不同操作系统的换行符 (EOL) 有什么区别? [more]
        服务器负载是什么概念? 如何查看负载? [more]
        ulimit 是用来干什么的?

    错误处理/调试
        怎么处理未预料的出错? 用 try/catch ，domains 还是其它什么? [more]
        什么是 uncaughtException 事件? 一般在什么情况下使用该事件? [more]
        domain 的原理是? 为什么要弃用 domain? [more]
        什么是防御性编程? 与其相对的 let it crash 又是什么?
        为什么要在 cb 的第一参数传 error? 为什么有的 cb 第一个参数不是 error, 例如 http.createServer?
        为什么有些异常没法根据报错信息定位到代码调用? 如何准确的定位一个异常? [more]
        内存泄漏通常由哪些原因导致? 如何分析以及定位内存泄漏?
    测试
        为什么要写测试? 写测试是否会拖累开发进度?[more]
        单元测试的单元是指什么? 什么是覆盖率?[more]
        测试是如何保证业务逻辑中不会出现死循环的?[more]
        mock 是什么? 一般在什么情况下 mock?

    util
        HTTP 如何通过 GET 方法 (URL) 传递 let arr = [1,2,3,4] 给服务器? [more]
        Node.js 中继承 (util.inherits) 的实现? [more]
        如何递归获取某个文件夹下所有的文件名?

    存储
        备份数据库与 M/S, M/M 等部署方式的区别? [more]
        索引有什么用，大致原理是什么? 设计索引有什么注意点? [more]
        Monogdb 连接问题(超时/断开等)有可能是什么问题导致的? [more]
        什么情况下数据会出现脏数据? 如何避免? [more]
        redis 与 memcached 的区别?
    
    安全
        加密是如何保证用户密码的安全性? [more]
        TLS 与 SSL 有什么区别? [more]
        HTTPS 能否被劫持? [more]
        XSS 攻击是什么? 有什么危害? [more]
        过滤 Html 标签能否防止 XSS? 请列举不能的情况? [more]
        CSRF 是什么? 如何防范? [more]
        如何避免中间人攻击?

  
 */
