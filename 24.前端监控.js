// 利用performance做监控
/**
 * 监控哪些指标：
 *  页面加载时间
 *  资源请求时间
 */

const navTimes = performance.getEntriesByType("navigation");

// 页面加载时间
const [{ domComplete }] = performance.getEntriesByType("navigation");
console.log(domComplete);

console.log(performance.getEntriesByType("resource"));

// 资源加载时间
const [{ startTime, responseEnd }] = performance.getEntriesByType("resource");
const loadTime = responseEnd - startTime;
console.log(loadTime);

function loadTimeOutRes(limit = 10) {
  // limit 超时时间，默认10s
  const SEC = 1000;
  const TIMEOUT = limit * SEC;
  const setTime = (limit = TIMEOUT) => time => time >= limit;
  const getLoadTime = ({ requestStart, responseEnd }) =>
    responseEnd - requestStart;
  const getName = ({ name }) => name;
  const isTimeout = setTime(TIMEOUT);
  const resourceTimes = performance.getEntriesByType("resource");
  return resourceTimes
    .filter(item => isTimeout(getLoadTime(item)))
    .map(getName);
}
console.log(loadTimeOutRes(10));

/**
 * 监控的方向：
 *   1.数据监控
 *     pv/uv(page view) 页面点击量，uv：访问某个站点或点击某条新闻不同的ip地址的人数
 *     用户停留时间
 *     用户通过什么入口来访问网页
 *     用户在响应的页面中触发的行为
 *   2.性能监控
 *     不同用户，不同机型和不同系统吓得首屏加载时间
 *     白屏时间
 *     http请求响应的时间
 *     静态资源整体下载时间
 *     页面渲染时间
 *     页面交互动画完成时间
 *   3.异常监控
 *     样式丢失异常
 *     javascript异常
 *
 * 常用的前端买点方案：
 *    代码埋点：在代码里直接写入相关代码，
 *    可视化埋点：用一个系统来实现手动插入代码埋点的过程。
 *    无埋点：无埋点并不是说不需要埋点，而是全部埋点，前端的任意一个事件都被绑定一个标识，所有的事件都别记录下来。通过定期上传记录文件，配合文件解析，解析出来我们想要的数据，并生成可视化报告供专业人员分析因此实现“无埋点”统计。
 *
 *
 * 如果埋点的事件不是很多，上报可以时时进行，比如监控用户的交互事件，可以在用户触发事件后，立刻上报用户所触发的事件类型。如果埋点的事件较多，或者说网页内部交互频繁，可以通过本地存储的方式先缓存上报信息，然后定期上报。
 * 
 * 
 * 
 * 
 * 
 * 接着来确定需要埋点上报的数据，上报的信息包括用户个人信息以及用户行为，主要数据可以分为：

who: appid(系统或者应用的id),userAgent(用户的系统、网络等信息)

when: timestamp(上报的时间戳)

from where: currentUrl(用户当前url)，fromUrl(从哪一个页面跳转到当前页面)，type(上报的事件类型),element(触发上报事件的元素）

what: 上报的自定义扩展数据data:{},扩展数据中可以按需求定制，比如包含uid等信息
 *
 */

//  渲染完毕
var start = Date.now();
document.addEventListener("DOMContentLoaded", function() {
  fetch("some api", {
    type: "dom complete",
    data: {
      domCompletedTime: Date.now() - start
    }
  });
});
// 所有资源加载
window.addEventListener("load", function() {
  fetch("some api", {
    type: "load complete",
    data: {
      LoadCompletedTime: Date.now() - start
    }
  });
});

/**
 *前端监控结果可视化展示系统的设计


 可以在开源中后台系统ant-design-pro的基础上进行二次开发，首先要明确展示信息。展示的信息包括单个用户和整体应用。
对于单个用户来说需要展示的监控信息为：

单个用户，在交互过程中触发各个埋点事件的次数
单个用户，在某个时间周期内，访问本网页的入口来源
单个用户，在每一个子页面的停留时间

对于全体用户需要展示的信息为：

某一个时间段内网页的PV和UV
全体用户访问网页的设备和操作系统分析
某一个时间段内访问本网页的入口来源分析
全体用户在访问本网页时，在交互过程中触发各个埋点事件的总次数
全体用户在访问本网页时，网页上报异常的集合

删选功能集合：

时间筛选：提供今日（00点到当前时间）、本周、本月和全年
用户删选：提供根据用户id删选出用户行为的统计信息
设备删选：删选不同系统的整体展示信息

 */
