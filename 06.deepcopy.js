// 深copy

function isObject(x) {
  return Object.prototype.toString.call(x) === "[object Object]";
}
// 简单
function clone(source) {
  const target = {};

  if (!isObject(source)) {
    return source;
  }
  for (let k in source) {
    if (typeof source[k] === "object") {
      //函数调用的时候是创建的新作用域
      target[k] = clone(source[k]);
    } else {
      target[k] = source[k];
    }
  }
  return target;
}

let obj = {
  name: "lisi",
  list: {
    age: 10
  }
};

console.log(clone(obj));

// 考虑循环引用，数组，递归爆栈如何写???
