/**
 * bind实现
 * 思路：bind 同样是改变this指向，但是返回的是一个函数
 */

// 简单实现
Function.prototype.myBind = function(obj, ...args) {
  const self = this;
  //   obj.fn = this;
  return () => {
    // obj.fn(...args);
    return self.apply(obj, args);
  };
};

let p = {
  name: "lisi"
};

function person(p) {
  console.log(this.name);
  this.age = 20;
  //   console.log(p);
}

// let fn = person.myBind(p, 2);
// fn();

// 考虑new操作符
// instanceof运算符用来判断一个构造函数的prototype属性所指向的对象是否存在另外一个要检测对象的原型链上;
Function.prototype.myBind1 = function(context, ...args) {
  const self = this;
  const F = function() {};
  //   const obj = Object.create({});
  //
  const myBind = function() {
    console.log(this instanceof self);
    return self.apply(this instanceof self ? this : context || this, args);
  };
  //这两句话最重要,self.prototype（this.prototype）在不在p1的原型链上
  F.prototype = this.prototype;
  myBind.prototype = new F();
  //p1.__proto__ =>   myBind.prototype -> __proto__  => F.prototype => this.prototype
  return myBind;
};

let Fn = person.myBind1(p);
// Fn();

// 说明，如果new了bind返回的函数，就是说原函数的this不变
p1 = new Fn();
console.log(p1.age);
