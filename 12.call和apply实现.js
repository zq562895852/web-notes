// call 和 apply的实现
/**
 * 思路：call是改变this指向，那么利用谁调用指向谁的思想
 */

Function.prototype.myCall = function(obj, ...args) {
  // obj就是需要this指向的对象
  const that = this; //当前this指向了调用的函数
  // 那么有一个问题就是如果调用的时候没有传obj,this应该指向window 所以有了下面这一句
  obj = obj || window;
  // 使用symbol是为了不和obj原有的属性冲突，否则就会覆盖了原有的属性
  const fn = Symbol("fn");
  obj[fn] = this;
  const result = obj[fn](...args);
  delete obj[fn];
  return result;
};

//  调用的时候是函数调，如下

function person(p) {
  console.log(this.name);
  console.log(p);
}

let p = {
  name: "张三"
};

person.myCall(p, "参数。。。");

// apply的实现，
/**
 * 思路：call 和 apply只是传值上的不同，call接收的是一个一个参数，apply接收的是数组
 */

Function.prototype.myApply = function(obj, args) {
  obj = obj || window;
  const fn = Symbol("fn");
  obj[fn] = this;
  let result;
  if (args) {
    result = obj[fn](...args);
  } else {
    result = obj[fn]();
  }

  delete obj[fn];
  return result;
};

person.myApply(p, [1]);
