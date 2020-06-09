/**
 * vue 数据劫持
 */

function Mvvm(options = {}) {
  this.$option = options;
  let data = this.$option.data;
  observe(data);
}

function observe(data) {
  if (!data || typeof data !== "object") return;
  return new Observe(data);
}

// 添加数据劫持
function Observe(data) {
  console.log(data);
  for (let k in data) {
    let val = data[k];
    observe(val); //递归调用
    Object.defineProperty(data, k, {
      configurable: true,
      get() {
        return val;
      },
      set(newVal) {
        if (val === newVal) return;
        val = newVal;
        // 这里是当一个属性是引用类型的时候可以递归加上get，set
        observe(newVal);
      }
    });
  }
}

let mvvm = new Mvvm({
  el: "#app",
  data: {
    a: {
      b: 1
    },
    c: 2
  }
});
console.log(mvvm);

// Object.defineProperty的第一个缺陷, 无法监听数组变化。 然而Vue的文档提到了Vue是可以检测到数组变化的，但是只有以下八种方法, vm.items[indexOfItem] = newValue这种是无法检测的。

// 这个是vue作者的奇技淫巧，劫持了原生方法
const aryMethods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse"
];
const arrayAugmentations = [];

aryMethods.forEach(method => {
  // 这里是原生Array的原型方法
  let original = Array.prototype[method];

  // 将push, pop等封装好的方法定义在对象arrayAugmentations的属性上
  // 注意：是属性而非原型属性
  arrayAugmentations[method] = function() {
    console.log("我被改变啦!");

    // 调用对应的原生方法并返回结果
    return original.apply(this, arguments);
  };
});
let list = ["a", "b", "c"];
// 将我们要监听的数组的原型指针指向上面定义的空数组对象
// 别忘了这个空数组的属性上定义了我们封装好的push等方法
list.__proto__ = arrayAugmentations;

// Object.defineProperty的第二个缺陷, 只能劫持对象的属性, 因此我们需要对每个对象的每个属性进行遍历，如果属性值也是对象那么需要深度遍历, 显然能劫持一个完整的对象是更好的选择

/**
 * proxy 实现双向绑定
 * 1. proxy 可以直接监听对象而非属性，有深层嵌套依然可以
 * 2. proxy 可以监听数组变化
 * 3. 有不限于apply、ownKeys、deleteProperty、has等等
 * 4. 返回一个新对象，我们可以只操作新的对象达到目的，
 * 5. 劣势就是兼容问题，无法使用polyfill抹平（意思是无法用已有的方法实现它？？？？？）
 */

// 1、Reflect对象与Proxy对象一样，也是 ES6 为了操作对象而提供的新 API。Reflect对象的设计目的有这样几个。

// 将Object对象的一些明显属于语言内部的方法（比如Object.defineProperty），放到Reflect对象上。
// 修改某些Object方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而Reflect.defineProperty(obj, name, desc)则会返回false。
// 让Object操作都变成函数行为。某些Object操作是命令式，比如name in obj和delete obj[name]，而Reflect.has(obj, name)和Reflect.deleteProperty(obj, name)让它们变成了函数行为。
// Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取默认行为。
// 2、Reflect.get方法查找并返回target对象的name属性，如果没有该属性，则返回undefined。

// 3、Reflect.set方法设置target对象的name属性等于value。如果name属性设置了赋值函数，则赋值函数的this绑定receiver。
// 4、Reflect.has方法对应name in obj里面的in运算符。

// 5、Reflect.deleteProperty方法等同于delete obj[name]，用于删除对象的属性。

// 该方法返回一个布尔值。如果删除成功，或者被删除的属性不存在，返回true；删除失败，被删除的属性依然存在，返回false。

// 6、Reflect.construct方法等同于new target(...args) ，这提供了一种不使用new，来调用构造函数的方法。
// 7、Reflect.defineProperty方法基本等同于Object.defineProperty，用来为对象定义属性。未来，后者会被逐渐废除，请从现在开始就使用Reflect.defineProperty代替它。

// 8、观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行。
let old = {};

arr = [];

const newObj = new Proxy(arr, {
  get(target, key, receiver) {
    //target就是原对象，key是读取的属性值，receiver 操作发生的对象（通常是代理） value 被写入的属性的值
    console.log("get", target, key, receiver);
    console.log(receiver == Proxy);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    console.log("set", value);
    Reflect.set(target, key, value, receiver);
  }
});

// newObj.name;

newObj.length = 1;
