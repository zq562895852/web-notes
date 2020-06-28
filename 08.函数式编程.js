/**
 * 函数式编程
 *
 * 1. 声明式编程
 * 2. 惰性执行
 * 3. 无状态和数据不可变
 * 4. 没有副作用
 * 5. 纯函数 ，不依赖外部状态，不修改全局变量不修改入参
 */

//  函数柯里化

function add(a, b) {
  return a + b;
}
// 返回一个函数可以调用多次，当参数达到时执行函数
function curry(fn, args = []) {
  const len = fn.length;
  let paramsList = [...args]; //参数列表
  return (...rest) => {
    paramsList.push(...rest);
    if (paramsList.length < len) {
      return curry(fn, paramsList);
    } else {
      return fn(...paramsList);
    }
  };
}

const addCurry = curry(add);

console.log(addCurry(1, 2));

// 纯函数的可缓存性，因为相同的输入总是可以返回相同的输出，所以可以提前缓存

function memoize(fn) {
  const cache = {};
  return function() {
    const key = JSON.stringify(arguments);
    var value = cache[key];
    if (!value) {
      value = [fn.apply(null, arguments)]; // 放在一个数组中，方便应对 undefined，null 等异常情况
      cache[key] = value;
    }
    return value[0];
  };
}

// 函数组合
const compose = (...fns) => (...args) =>
  fns.reduceRight((val, fn) => fn.apply(null, [].concat(val)), args);

/**
 * 总结：
 *   优点：代码简洁，开发快速，更少的出错率，
 *   缺点：代码过度包装，性能降低，资源占用，递归陷阱
 */

// 拉平数组
function paArr(arr) {
  while (arr.some(Array.isArray)) {
    arr = [].concat(...arr);
  }
  return arr;
}

let arr = [[123, 4, 5], 9, [4, 5, 6]];
console.log(paArr(arr));
