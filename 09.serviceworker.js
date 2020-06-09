/**
 * service workers 渐进式web应用程序
 * 1. 是一个浏览器背后运行的脚本独立于web页面
 * 2. service worker 声明周期：下载，安装，激活
 *register() 方法的一个重要细节是 Service Worker 文件的位置。在本例中，可以看到 Service Worker 文件位于域的根目录，这意味着 Service Worker 范围将是这个域下的。换句话说，这个 Service Worker 将为这个域中的所有内容接收 fetch 事件。如果我们在 /example/sw.js 注册 Service Worker 文件，那么 Service Worker 只会看到以 /example/ 开头的页面的 fetch 事件（例如 /example/page1/、/example/page2/）。

通常在安装步骤中，你需要缓存一些静态资源。 如果所有文件都缓存成功，则 Service Worker 将被安装。 如果任何文件无法下载和缓存，则安装步骤将失败，Service Worker 将不会激活（即不会被安装）。 如果发生这种情况，不要担心，下次再试一次。 但是，这意味着如果它安装，你知道你有这些静态资源在缓存中。

如果注册需要在加载事件之后发生，这就解答了你“注册是否需要在加载事件之后发生”的疑惑。这不是必要的，但绝对是推荐的。

为什么？让我们考虑用户第一次访问你的 Web 应用程序。目前还没有 Service Worker，而且浏览器无法预先知道最终是否会安装 Service Worker。如果安装了 Service Worker，浏览器将需要为这个额外的线程花费额外的 CPU 和内存，否则浏览器将把这些额外的 CPU 和内存用于呈现 Web 页面。

最重要的是，如果在页面上安装一个 Service Worker，就可能会有延迟加载和渲染的风险 —— 而不是尽快让你的用户可以使用该页面。

注意，这种情况对第一次的访问页面时才会有。后续的页面访问不会受到 Service Worker 安装的影响。一旦 Service Worker 在第一次访问页面时被激活，它就可以处理加载/缓存事件，以便后续访问 Web 应用程序。这一切都是有意义的，因为它需要准备好处理受限的的网络连接。

service worker 安装的内部机制
开启一个缓存
缓存我们的文件
确认是否缓存了所有必需的资源

 *
 */
