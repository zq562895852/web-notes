// 写一个函数实现call()

function fn(params) {}
const obj = {};
obj.fn = fn;

Function.prototype.myCall = function(thisArg, ...args) {
  const fn = Symbol("fn"); // 声明一个独有的Symbol属性, 防止fn覆盖已有属性
  thisArg = thisArg || window; // 若没有传入this, 默认绑定window对象
  thisArg[fn] = this; // this指向调用call的对象,即我们要改变this指向的函数
  const result = thisArg[fn](...args); // 执行当前函数
  delete thisArg[fn]; // 删除我们声明的fn属性
  return result; // 返回函数执行结果
};
fn.myCall(obj); //fn调用了myCall this指向了函数fn,此时 thisArg[fn]就是fn函数，对象上的[fn]属性是函数调用，则fn的this指向了thisArg,因为是thisArg调用了函数[fn]

//浏览器url输入发生了什么主要讲的渲染流程
// 首先，根据顶部定义的DTD类型进行对应的解析方式
// 渲染进程内部是多线程的，网页的解析将会被交给内部的GUI渲染线程处理
// 渲染线程中的HTML解释器，将HTML网页和资源从字节流解释转换成字符流
// 再通过词法分析器将字符流解释成词
// 之后经过语法分析器根据词构建成节点，最后通过这些节点组建一个DOM树
// 这个过程中，如果遇到的DOM节点是 JS 代码，就会调用 JS引擎 对 JS代码进行解释执行，此时由 JS引擎 和 GUI渲染线程 的互斥，GUI渲染线程 就会被挂起，渲染过程停止，如果 JS 代码的运行中对DOM树进行了修改，那么DOM的构建需要从新开始
// 如果节点需要依赖其他资源，图片 / CSS等等，就会调用网络模块的资源加载器来加载它们，它们是异步的，不会阻塞当前DOM树的构建
// 如果遇到的是 JS 资源URL（没有标记异步），则需要停止当前DOM的构建，直到 JS 的资源加载并被 JS引擎 执行后才继续构建DOM
// 对于CSS，CSS解释器会将CSS文件解释成内部表示结构，生成CSS规则树
// 然后合并CSS规则树和DOM树，生成 Render渲染树，也叫呈现树
// 最后对 Render树进行布局和绘制，并将结果通过IO线程传递给浏览器控制进程进行显示

// 手写bind函数   instanceof 判断一个实例是否属于某种类型
// 判断 foo 是否是 Foo 类的实例
// function Foo() {}
// var foo = new Foo();
// console.log(foo instanceof Foo); //true

Function.prototype.myBind = function(thisArg, ...args) {
  var self = this;
  // new优先级
  var fbound = function() {
    console.log("this", this);
    console.log("self", self);
    // this instanceof self    new 操作符优先，也就是当这个函数被new的时候this指向他的实例，foo调用了myBind,所以self指向了foo
    self.apply(
      this instanceof self ? this : thisArg,
      args.concat(Array.prototype.slice.call(arguments))
    );
  };
  // 继承原型上的属性和方法 这一句话至关重要，fbound.prototype->self.prototype
  fbound.prototype = Object.create(self.prototype);

  return fbound;
};
//测试
const obj1 = { name: "写代码像蔡徐抻" };
function foo() {
  console.log(this.name);
  //   console.log(arguments);
}

const fun = foo.myBind(obj1, "a", "b", "c");

const obj2 = new fun();
// JavaScript 原型继承,
console.log(obj2 instanceof fun); //true
console.log(obj2 instanceof foo); //true

// new foo();

// 防抖，短时间内多次触发只会执行一次
function debounce(fun, wait) {
  let timer = null;
  return function() {
    //返回一个函数，因为fun调用this指向调用者，为了修正this使用apply调用
    let context = this;
    let args = arguments;
    if (timer) clearTimeout(timer); //多次触发关闭上一次的重新计时重新开始，
    timer = setTimeout(() => {
      fun.apply(context, args);
    }, wait);
  };
}
// 节流 间隔执行，多次触发只在规定的时间节点执行
function throttle(fun, wait) {
  let timer = null;
  return function() {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        // 清空定时间，下次重新开启一个
        timer = null;
        fun.apply(context, args);
      }, wait);
    }
  };
}

// 数组扁平化
function flat() {
  let arr = [1, [1, 2]];
  // arr.flat(Infinity);
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr); //concact会把[1,2]这种值直接展开成1,2然后合并
  }
  return arr;
}
const arr = [1, [1, 2], [1, 2, 3]];
// 递归实现拉平数组
// function flat(arr) {
//     return arr.reduce((prev, cur) => {
//         return prev.concat(cur instanceof Array ? flat(cur) : cur)
//     }, [])
// }

console.log(flat());

// v8执行一段代码
// 预解析：检查语法错误但不生成AST
// 生成AST：经过词法 / 语法分析，生成抽象语法树
// 生成字节码：基线编译器(Ignition)将AST转换成字节码
// 生成机器码：优化编译器(Turbofan)将字节码转换成优化过的机器码，此外在逐行执行字节码的过程中，如果一段代码经常被执行，那么V8会将这段代码直接转换成机器码保存起来，下一次执行就不必经过字节码，优化了执行速度

// 垃圾回收机制
// 引用计数：给一个变量赋值引用类型，则该对象的引用次数 + 1，如果这个变量变成了其他值，那么该对象的引用次数 - 1，垃圾回收器会回收引用次数为0的对象。但是当对象循环引用时，会导致引用次数永远无法归零，造成内存无法释放。
// 标记清除：垃圾收集器先给内存中所有对象加上标记，然后从根节点开始遍历，去掉被引用的对象和运行环境中对象的标记，剩下的被标记的对象就是无法访问的等待回收的对象

// 新生代内存回收机制：

// 新生代内存容量小，64位系统下仅有32M。新生代内存分为From、To两部分，进行垃圾回收时，先扫描From，将非存活对象回收，将存活对象顺序复制到To中，之后调换From / To，等待下一次回收

// 老生代内存回收机制

// 晋升：如果新生代的变量经过多次回收依然存在，那么就会被放入老生代内存中
// 标记清除：老生代内存会先遍历所有对象并打上标记，然后对正在使用或被强引用的对象取消标记，回收被标记的对象
// 整理内存碎片：把对象挪到内存的一端

// service worker 独立的线程
// 和Web Worker类似，是独立的线程，我们可以在这个线程中缓存文件，在主线程需要的时候读取这里的文件，Service Worker使我们可以自由选择缓存哪些文件以及文件的匹配、读取规则，并且缓存是持续性的
// Memory Cache  Disk Cache   Push Cache

// GET请求是幂等性的，而POST请求不是

//什么是幂等性？幂等性是指一次和多次请求某一个资源应该具有同样的副作用。简单来说意味着对同一URL的多个请求应该返回同样的结果。
// 正因为它们有这样的区别，所以不应该且不能用get请求做数据的增删改这些有副作用的操作。因为get请求是幂等的，在网络不好的隧道中会尝试重试。如果用get请求增数据，会有重复操作的风险，而这种重复操作可能会导致副作用（浏览器和操作系统并不知道你会用get请求去做增操作）

// http/2.0
//多路复用： 即多个请求都通过一个TCP连接并发地完成
// 服务端推送： 服务端能够主动把资源推送给客户端
// 新的二进制格式： HTTP / 2采用二进制格式传输数据，相比于HTTP / 1.1的文本格式，二进制格式具有更好的解析性和拓展性
// header压缩： HTTP / 2压缩消息头，减少了传输数据的大小
//this
// 在JavaScript中，this的指向是调用时决定的，而不是创建时决定的，这就会导致this的指向会让人迷惑，简单来说，this具有运行期绑定的特性

//深拷贝
function cloneJSON(source) {
  //内部使用了递归的方法
  return JSON.parse(JSON.stringify(source));
}
//递归深拷贝
function clone(source) {
  var target = {};
  for (var i in source) {
    if (source.hasOwnProperty(i)) {
      if (typeof source[i] === "object") {
        target[i] = clone(source[i]); // 注意这里
      } else {
        target[i] = source[i];
      }
    }
  }

  return target;
}

//深度优先遍历，循环引用依然无力应对
function cloneLoop(x) {
  const root = {};

  // 栈
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== "undefined") {
      res = parent[key] = {};
    }

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === "object") {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}
// 保持引用关系
function cloneForce(x) {
  // =============
  const uniqueList = []; // 用来去重
  // =============

  let root = {};

  // 循环数组
  const loopList = [
    {
      parent: root,
      key: undefined,
      data: x
    }
  ];

  while (loopList.length) {
    // 深度优先
    const node = loopList.pop();
    const parent = node.parent;
    const key = node.key;
    const data = node.data;

    // 初始化赋值目标，key为undefined则拷贝到父元素，否则拷贝到子元素
    let res = parent;
    if (typeof key !== "undefined") {
      res = parent[key] = {};
    }

    // =============
    // 数据已经存在
    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      continue; // 中断本次循环
    }

    // 数据不存在
    // 保存源数据，在拷贝数据中对应的引用
    uniqueList.push({
      source: data,
      target: res
    });
    // =============

    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        if (typeof data[k] === "object") {
          // 下一次循环
          loopList.push({
            parent: res,
            key: k,
            data: data[k]
          });
        } else {
          res[k] = data[k];
        }
      }
    }
  }

  return root;
}

function find(arr, item) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === item) {
      return arr[i];
    }
  }

  return null;
}

// 装饰器，代理

export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}

let fn1 = function(x) {
  return x + 10;
};
let fn2 = function(x) {
  return x * 10;
};
let fn3 = function(x) {
  return x / 10;
};

compose(
  fn1,
  fn2,
  fn3
)(2);
