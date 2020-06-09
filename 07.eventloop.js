/**
 * 事件循环：
 * 
一个event loop有一个或者多个task队列。当用户代理安排一个任务，必须将该任务增加到相应的event loop的一个tsak队列中。

每一个task都来源于指定的任务源，比如可以为鼠标、键盘事件提供一个task队列，其他事件又是一个单独的队列。可以为鼠标、键盘事件分配更多的时间，保证交互的流畅。


DOM操作任务源：
此任务源被用来相应dom操作，例如一个元素以非阻塞的方式插入文档。

用户交互任务源：
此任务源用于对用户交互作出反应，例如键盘或鼠标输入。响应用户操作的事件（例如click）必须使用task队列。

网络任务源：
网络任务源被用来响应网络活动。

history traversal任务源：
当调用history.back()等类似的api时，将任务插进task队列。

setTimeout
setInterval
setImmediate
I/O
UI rendering

每一个event loop都有一个microtask队列，一个microtask会被排进microtask队列而不是task队列。


有两种event loops，一种在浏览器上下文，一种在workers中。
一个event loop只要存在，就会不断执行下边的步骤：
1.在tasks队列中选择最老的一个task,用户代理可以选择任何task队列，如果没有可选的任务，则跳到下边的microtasks步骤。
2.将上边选择的task设置为正在运行的task。
3.Run: 运行被选择的task。
4.将event loop的currently running task变为null。
5.从task队列里移除前边运行的task。
6.Microtasks: 执行microtasks任务检查点。（也就是执行microtasks队列里的任务）
7.更新渲染（Update the rendering）...
8.如果这是一个worker event loop，但是没有任务在task队列中，并且WorkerGlobalScope对象的closing标识为true，则销毁event loop，中止这些步骤，然后进行定义在Web workers章节的run a worker。
9.返回到第一步。

microtasks检查点（microtask checkpoint）
1.将microtask checkpoint的flag设为true。
2.Microtask queue handling: 如果event loop的microtask队列为空，直接跳到第八步（Done）。
3.在microtask队列中选择最老的一个任务。
4.将上一步选择的任务设为event loop的currently running task。
5.运行选择的任务。
6.将event loop的currently running task变为null。
7.将前面运行的microtask从microtask队列中删除，然后返回到第二步（Microtask queue handling）。
8.Done: 每一个environment settings object它们的 responsible event loop就是当前的event loop，会给environment settings object发一个 rejected promises 的通知。
9.清理IndexedDB的事务。
10.将microtask checkpoint的flag设为flase。

 */
